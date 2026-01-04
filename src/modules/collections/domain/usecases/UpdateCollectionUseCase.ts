import { Collection } from "../entities";
import { ICollectionRepository, UpdateCollectionDTO } from "../repositories";
import { UUID } from "@/shared/types";

/**
 * Use case: Update existing collection
 * Validates update data before applying changes
 */
export class UpdateCollectionUseCase {
  constructor(private collectionRepository: ICollectionRepository) {}

  async execute(id: UUID, data: UpdateCollectionDTO): Promise<Collection> {
    // Validate name if provided
    if (data.name !== undefined) {
      if (!data.name || data.name.trim().length < 3 || data.name.trim().length > 100) {
        throw new Error("Collection name must be 3-100 characters");
      }
    }

    // Validate description if provided
    if (data.description !== undefined && data.description && data.description.length > 500) {
      throw new Error("Description must be 500 characters or less");
    }

    return await this.collectionRepository.update(id, data);
  }
}
