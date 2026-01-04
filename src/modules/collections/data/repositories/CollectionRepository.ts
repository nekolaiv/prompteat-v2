import { Collection } from "../../domain/entities";
import { ICollectionRepository, CreateCollectionDTO, UpdateCollectionDTO } from "../../domain/repositories";
import { SupabaseCollectionDataSource } from "../sources";
import { toDomainCollection, toCollectionModel } from "../models";
import { UUID } from "@/shared/types";

/**
 * Collection repository implementation
 * Bridges domain layer and data source with model mapping
 */
export class CollectionRepository implements ICollectionRepository {
  constructor(private dataSource: SupabaseCollectionDataSource) {}

  async getById(id: UUID): Promise<Collection | null> {
    const model = await this.dataSource.getCollectionById(id);
    return model ? toDomainCollection(model) : null;
  }

  async getByUserId(userId: UUID): Promise<Collection[]> {
    const models = await this.dataSource.getCollectionsByUserId(userId);
    return models.map(toDomainCollection);
  }

  async getPublicCollections(limit = 20, offset = 0): Promise<Collection[]> {
    const models = await this.dataSource.getPublicCollections(limit, offset);
    return models.map(toDomainCollection);
  }

  async create(data: CreateCollectionDTO): Promise<Collection> {
    // Generate slug from name
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const collectionData = {
      user_id: data.userId,
      name: data.name,
      slug,
      description: data.description || null,
      icon: data.icon || null,
      visibility: data.visibility || "private",
      prompt_count: 0,
      favorite_count: 0,
      order_index: 0,
    };

    const model = await this.dataSource.createCollection(collectionData);
    return toDomainCollection(model);
  }

  async update(id: UUID, updates: UpdateCollectionDTO): Promise<Collection> {
    const updateData = toCollectionModel(updates);
    const model = await this.dataSource.updateCollection(id, updateData);
    return toDomainCollection(model);
  }

  async delete(id: UUID): Promise<void> {
    await this.dataSource.deleteCollection(id);
  }

  async addPrompt(collectionId: UUID, promptId: UUID): Promise<void> {
    await this.dataSource.addPromptToCollection(collectionId, promptId);
  }

  async removePrompt(collectionId: UUID, promptId: UUID): Promise<void> {
    await this.dataSource.removePromptFromCollection(collectionId, promptId);
  }

  async getPromptIds(collectionId: UUID): Promise<UUID[]> {
    return await this.dataSource.getCollectionPromptIds(collectionId);
  }
}
