"use client";

import { Header } from "@/shared/components";
import { CollectionList } from "@/modules/collections/presentation/components";
import { useCollections } from "@/modules/collections/presentation/hooks";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useAuthContext } from "@/modules/auth/presentation/components";

export default function CollectionsPage() {
  const { user } = useAuthContext();
  const { collections, isLoading } = useCollections("");

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Public Collections</h1>
              <p className="text-muted-foreground mt-1">Browse collections from the community</p>
            </div>
            {user && (
              <Button asChild>
                <Link href="/collections/new">
                  <Plus className="mr-2 h-4 w-4" />
                  New Collection
                </Link>
              </Button>
            )}
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : (
            <CollectionList collections={collections} />
          )}
        </div>
      </main>
    </div>
  );
}
