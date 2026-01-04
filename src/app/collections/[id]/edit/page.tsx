"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/shared/components";
import { Collection } from "@/modules/collections/domain/entities";
import { createClientComponentClient } from "@/shared/config/supabase-client";
import { SupabaseCollectionDataSource } from "@/modules/collections/data/sources";
import { CollectionRepository } from "@/modules/collections/data/repositories";
import { useAuthContext } from "@/modules/auth/presentation/components";
import { CollectionForm } from "@/modules/collections/presentation/components";
import { useCollection } from "@/modules/collections/presentation/hooks";
import { UpdateCollectionDTO } from "@/modules/collections/domain/repositories";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function EditCollectionPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuthContext();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { updateCollection, isLoading: updating } = useCollection();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/signin");
      return;
    }

    const fetchCollection = async () => {
      try {
        setIsLoading(true);
        const supabase = createClientComponentClient();
        const dataSource = new SupabaseCollectionDataSource(supabase);
        const repository = new CollectionRepository(dataSource);

        const data = await repository.getById(params.id as string);

        if (!data) {
          setError("Collection not found");
          return;
        }

        if (data.userId !== user?.id) {
          setError("You don't have permission to edit this collection");
          return;
        }

        setCollection(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch collection");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id && user) {
      fetchCollection();
    }
  }, [params.id, user, authLoading, router]);

  const handleSubmit = async (data: UpdateCollectionDTO) => {
    const updated = await updateCollection(params.id as string, data);
    if (updated) {
      router.push(`/collections/${params.id}`);
    }
  };

  if (authLoading || isLoading) {
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
            <h1 className="text-2xl font-bold mb-4">Cannot Edit Collection</h1>
            <p className="text-muted-foreground mb-6">{error || "This collection doesn't exist or you don't have permission."}</p>
            <Button onClick={() => router.push("/dashboard/collections")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Collections
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <CollectionForm
          onSubmit={handleSubmit}
          isLoading={updating}
          initialData={collection}
          mode="edit"
        />
      </main>
    </div>
  );
}
