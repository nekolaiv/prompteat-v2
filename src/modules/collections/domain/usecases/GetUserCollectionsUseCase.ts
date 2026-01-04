import { Collection } from "../entities";
import { ICollectionRepository } from "../repositories";
import { UUID } from "@/shared/types";

export class GetUserCollectionsUseCase {
  constructor(private collectionRepository: ICollectionRepository) {}

  async execute(userId: UUID): Promise<Collection[]> {
    return await this.collectionRepository.getByUserId(userId);
  }
}
