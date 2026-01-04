"use client";

import { useState, useEffect } from "react";
import { Collection } from "../../domain/entities";
import { createClientComponentClient } from "@/shared/config/supabase-client";
import { SupabaseCollectionDataSource } from "../../data/sources";
import { CollectionRepository } from "../../data/repositories";

export function useCollections(userId?: string) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId === undefined) {
      return;
    }

    const fetchCollections = async () => {
      try {
        setIsLoading(true);
        const supabase = createClientComponentClient();
        const dataSource = new SupabaseCollectionDataSource(supabase);
        const repository = new CollectionRepository(dataSource);

        const data = userId
          ? await repository.getByUserId(userId)
          : await repository.getPublicCollections();

        setCollections(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch collections");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollections();
  }, [userId]);

  return { collections, isLoading, error };
}
