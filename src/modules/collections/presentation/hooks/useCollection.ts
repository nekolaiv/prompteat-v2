"use client";

import { useState } from "react";
import { Collection } from "../../domain/entities";
import { CreateCollectionDTO, UpdateCollectionDTO } from "../../domain/repositories";
import { createClientComponentClient } from "@/shared/config/supabase-client";
import { SupabaseCollectionDataSource } from "../../data/sources";
import { CollectionRepository } from "../../data/repositories";
import { CreateCollectionUseCase, UpdateCollectionUseCase, DeleteCollectionUseCase } from "../../domain/usecases";

export function useCollection() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCollection = async (data: CreateCollectionDTO): Promise<Collection | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const supabase = createClientComponentClient();
      const dataSource = new SupabaseCollectionDataSource(supabase);
      const repository = new CollectionRepository(dataSource);
      const useCase = new CreateCollectionUseCase(repository);

      return await useCase.execute(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create collection");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateCollection = async (id: string, data: UpdateCollectionDTO): Promise<Collection | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const supabase = createClientComponentClient();
      const dataSource = new SupabaseCollectionDataSource(supabase);
      const repository = new CollectionRepository(dataSource);
      const useCase = new UpdateCollectionUseCase(repository);

      return await useCase.execute(id, data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update collection");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCollection = async (id: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const supabase = createClientComponentClient();
      const dataSource = new SupabaseCollectionDataSource(supabase);
      const repository = new CollectionRepository(dataSource);
      const useCase = new DeleteCollectionUseCase(repository);

      await useCase.execute(id);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete collection");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const addPrompt = async (collectionId: string, promptId: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const supabase = createClientComponentClient();
      const dataSource = new SupabaseCollectionDataSource(supabase);
      const repository = new CollectionRepository(dataSource);

      await repository.addPrompt(collectionId, promptId);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add prompt to collection");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const removePrompt = async (collectionId: string, promptId: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const supabase = createClientComponentClient();
      const dataSource = new SupabaseCollectionDataSource(supabase);
      const repository = new CollectionRepository(dataSource);

      await repository.removePrompt(collectionId, promptId);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove prompt from collection");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { createCollection, updateCollection, deleteCollection, addPrompt, removePrompt, isLoading, error };
}
