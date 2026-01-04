"use client";

import { useRouter } from "next/navigation";
import { Header } from "@/shared/components";
import { CollectionForm } from "@/modules/collections/presentation/components";
import { useCollection } from "@/modules/collections/presentation/hooks";
import { useAuthContext } from "@/modules/auth/presentation/components";
import { useEffect } from "react";

export default function NewCollectionPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuthContext();
  const { createCollection, isLoading } = useCollection();

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

  const handleSubmit = async (data: any) => {
    const collection = await createCollection(data);
    if (collection) {
      router.push("/dashboard/collections");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <CollectionForm userId={user.id} onSubmit={handleSubmit} isLoading={isLoading} />
      </main>
    </div>
  );
}
