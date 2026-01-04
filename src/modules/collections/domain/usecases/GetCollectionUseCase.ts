import { Collection } from "../entities";
import { ICollectionRepository } from "../repositories";
import { UUID } from "@/shared/types";

export class GetCollectionUseCase {
  constructor(private collectionRepository: ICollectionRepository) {}

  async execute(id: UUID): Promise<Collection | null> {
    return await this.collectionRepository.getById(id);
  }
}
