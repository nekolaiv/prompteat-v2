import { SupabaseClient } from "@supabase/supabase-js";
import { CollectionModel } from "../models";

/**
 * Supabase data source for collections
 * Handles direct database operations with RLS policies
 */
export class SupabaseCollectionDataSource {
  constructor(private supabase: SupabaseClient) {}

  // Fetch collection by ID
  async getCollectionById(id: string): Promise<CollectionModel | null> {
    const { data, error } = await this.supabase
      .from("collections")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  }

  // Fetch collections by user ID (RLS ensures only user's collections returned)
  async getCollectionsByUserId(userId: string): Promise<CollectionModel[]> {
    const { data, error } = await this.supabase
      .from("collections")
      .select("*")
      .eq("user_id", userId)
      .order("order_index", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Fetch public collections
  async getPublicCollections(limit = 20, offset = 0): Promise<CollectionModel[]> {
    const { data, error } = await this.supabase
      .from("collections")
      .select("*")
      .eq("visibility", "public")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return data || [];
  }

  // Create new collection
  async createCollection(collectionData: Partial<CollectionModel>): Promise<CollectionModel> {
    const { data, error } = await this.supabase
      .from("collections")
      .insert(collectionData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Update existing collection
  async updateCollection(id: string, updates: Partial<CollectionModel>): Promise<CollectionModel> {
    const { data, error } = await this.supabase
      .from("collections")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Delete collection
  async deleteCollection(id: string): Promise<void> {
    const { error } = await this.supabase
      .from("collections")
      .delete()
      .eq("id", id);

    if (error) throw error;
  }

  // Add prompt to collection
  async addPromptToCollection(collectionId: string, promptId: string): Promise<void> {
    const { error } = await this.supabase
      .from("collection_prompts")
      .insert({
        collection_id: collectionId,
        prompt_id: promptId,
      });

    if (error) throw error;
  }

  // Remove prompt from collection
  async removePromptFromCollection(collectionId: string, promptId: string): Promise<void> {
    const { error } = await this.supabase
      .from("collection_prompts")
      .delete()
      .eq("collection_id", collectionId)
      .eq("prompt_id", promptId);

    if (error) throw error;
  }

  // Get prompt IDs in collection
  async getCollectionPromptIds(collectionId: string): Promise<string[]> {
    const { data, error } = await this.supabase
      .from("collection_prompts")
      .select("prompt_id")
      .eq("collection_id", collectionId)
      .order("order_index", { ascending: true });

    if (error) throw error;
    return data?.map((item) => item.prompt_id) || [];
  }
}
