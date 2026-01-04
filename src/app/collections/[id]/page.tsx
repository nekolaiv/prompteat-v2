"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/shared/components";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collection } from "@/modules/collections/domain/entities";
import { Prompt } from "@/modules/prompts/domain/entities";
import { createClientComponentClient } from "@/shared/config/supabase-client";
import { SupabaseCollectionDataSource } from "@/modules/collections/data/sources";
import { CollectionRepository } from "@/modules/collections/data/repositories";
import { SupabasePromptDataSource } from "@/modules/prompts/data/sources";
import { PromptRepository } from "@/modules/prompts/data/repositories";
import { ArrowLeft, Edit, Trash2, Plus } from "lucide-react";
import { useAuthContext } from "@/modules/auth/presentation/components";
import { useCollection } from "@/modules/collections/presentation/hooks";
import { PromptCard } from "@/modules/prompts/presentation/components";
import * as LucideIcons from "lucide-react";

export default function CollectionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthContext();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { deleteCollection, isLoading: deleting } = useCollection();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const supabase = createClientComponentClient();
        const collectionDataSource = new SupabaseCollectionDataSource(supabase);
        const collectionRepository = new CollectionRepository(collectionDataSource);

        const collectionData = await collectionRepository.getById(params.id as string);

        if (!collectionData) {
          setError("Collection not found");
          return;
        }

        setCollection(collectionData);

        // Fetch prompts in collection
        const promptIds = await collectionRepository.getPromptIds(params.id as string);
        if (promptIds.length > 0) {
          const promptDataSource = new SupabasePromptDataSource(supabase);
          const promptRepository = new PromptRepository(promptDataSource);

          const promptsData = await Promise.all(
            promptIds.map((id) => promptRepository.getById(id))
          );

          setPrompts(promptsData.filter((p) => p !== null) as Prompt[]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch collection");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchData();
    }
  }, [params.id]);

  const handleDelete = async () => {
    if (!collection) return;

    const confirmed = await deleteCollection(collection.id);
    if (confirmed) {
      router.push("/dashboard/collections");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black">
        <Header />
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  if (error || !collection) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <h1 className="text-2xl font-bold mb-4">Collection Not Found</h1>
            <p className="text-muted-foreground mb-6">{error || "This collection doesn't exist."}</p>
            <Button onClick={() => router.push("/collections")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Browse Collections
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const IconComponent = collection.icon
    ? (LucideIcons as any)[collection.icon] || LucideIcons.Folder
    : LucideIcons.Folder;

  const isOwner = user && user.id === collection.userId;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-6">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <IconComponent className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-3xl mb-2">{collection.name}</CardTitle>
                    {collection.description && (
                      <CardDescription className="text-base">{collection.description}</CardDescription>
                    )}
                    <div className="text-sm text-muted-foreground mt-4">
                      {collection.promptCount} {collection.promptCount === 1 ? "prompt" : "prompts"}
                    </div>
                  </div>
                </div>
                {isOwner && (
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.push(`/collections/${collection.id}/edit`)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    {!showDeleteConfirm ? (
                      <Button variant="destructive" onClick={() => setShowDeleteConfirm(true)} disabled={deleting}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                        {deleting ? "Deleting..." : "Confirm"}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isOwner && (
                <Button asChild className="mb-6">
                  <a href={`/prompts?addToCollection=${collection.id}`}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Prompts
                  </a>
                </Button>
              )}

              {prompts.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No prompts in this collection yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {prompts.map((prompt) => (
                    <PromptCard key={prompt.id} prompt={prompt} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
