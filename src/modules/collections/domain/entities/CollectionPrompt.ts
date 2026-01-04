import { UUID, Timestamp } from "@/shared/types";

/**
 * CollectionPrompt entity - Junction table model for collection-prompt relationship
 */
export interface CollectionPrompt {
  collectionId: UUID;
  promptId: UUID;
  orderIndex: number;
  addedAt: Timestamp;
}
