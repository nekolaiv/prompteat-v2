import { UUID, Timestamp } from "@/shared/types";

/**
 * Collection entity - Domain model for organizing prompts
 */
export interface Collection {
  id: UUID;
  userId: UUID;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  visibility: CollectionVisibility;
  promptCount: number;
  favoriteCount: number;
  orderIndex: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type CollectionVisibility = "public" | "private";
