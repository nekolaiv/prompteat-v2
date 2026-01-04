import { Collection } from "../entities";
import { UUID } from "@/shared/types";

/**
 * Collection repository interface
 * Defines contract for collection data operations
 */
export interface ICollectionRepository {
  // Read operations
  getById(id: UUID): Promise<Collection | null>;
  getByUserId(userId: UUID): Promise<Collection[]>;
  getPublicCollections(limit?: number, offset?: number): Promise<Collection[]>;

  // Write operations
  create(collection: CreateCollectionDTO): Promise<Collection>;
  update(id: UUID, updates: UpdateCollectionDTO): Promise<Collection>;
  delete(id: UUID): Promise<void>;

  // Collection-Prompt operations
  addPrompt(collectionId: UUID, promptId: UUID): Promise<void>;
  removePrompt(collectionId: UUID, promptId: UUID): Promise<void>;
  getPromptIds(collectionId: UUID): Promise<UUID[]>;
}

export interface CreateCollectionDTO {
  userId: UUID;
  name: string;
  description?: string;
  icon?: string;
  visibility?: "public" | "private";
}

export interface UpdateCollectionDTO {
  name?: string;
  description?: string;
  icon?: string;
  visibility?: "public" | "private";
}
