"use client";

import { Header } from "@/shared/components";
import { CollectionList } from "@/modules/collections/presentation/components";
import { useCollections } from "@/modules/collections/presentation/hooks";
import { useAuthContext } from "@/modules/auth/presentation/components";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardCollectionsPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuthContext();
  const { collections, isLoading } = useCollections(user?.id);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/signin");
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">My Collections</h1>
              <p className="text-muted-foreground mt-1">Manage your prompt collections</p>
            </div>
            <Button asChild>
              <Link href="/collections/new">
                <Plus className="mr-2 h-4 w-4" />
                New Collection
              </Link>
            </Button>
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
