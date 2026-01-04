import { Collection } from "../entities";
import { ICollectionRepository, CreateCollectionDTO } from "../repositories";

/**
 * Use case: Create new collection
 * Validates collection data before creation
 */
export class CreateCollectionUseCase {
  constructor(private collectionRepository: ICollectionRepository) {}

  async execute(data: CreateCollectionDTO): Promise<Collection> {
    // Validate name (3-100 chars)
    if (!data.name || data.name.trim().length < 3 || data.name.trim().length > 100) {
      throw new Error("Collection name must be 3-100 characters");
    }

    // Validate description (max 500 chars if provided)
    if (data.description && data.description.length > 500) {
      throw new Error("Description must be 500 characters or less");
    }

    return await this.collectionRepository.create(data);
  }
}
