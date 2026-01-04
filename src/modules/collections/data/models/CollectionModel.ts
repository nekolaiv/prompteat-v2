import { Collection } from "../../domain/entities";

/**
 * Database model for collections (matches Supabase schema with snake_case)
 */
export interface CollectionModel {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  visibility: string;
  prompt_count: number;
  favorite_count: number;
  order_index: number;
  created_at: string;
  updated_at: string;
}

/**
 * Convert database model to domain entity
 */
export function toDomainCollection(model: CollectionModel): Collection {
  return {
    id: model.id,
    userId: model.user_id,
    name: model.name,
    slug: model.slug,
    description: model.description || undefined,
    icon: model.icon || undefined,
    visibility: model.visibility as any,
    promptCount: model.prompt_count,
    favoriteCount: model.favorite_count,
    orderIndex: model.order_index,
    createdAt: model.created_at,
    updatedAt: model.updated_at,
  };
}

/**
 * Convert domain entity to database model for inserts/updates
 */
export function toCollectionModel(collection: Partial<Collection>): Partial<CollectionModel> {
  return {
    user_id: collection.userId,
    name: collection.name,
    description: collection.description || null,
    icon: collection.icon || null,
    visibility: collection.visibility,
  };
}
