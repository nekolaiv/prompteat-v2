import { ICollectionRepository } from "../repositories";
import { UUID } from "@/shared/types";

export class DeleteCollectionUseCase {
  constructor(private collectionRepository: ICollectionRepository) {}

  async execute(id: UUID): Promise<void> {
    await this.collectionRepository.delete(id);
  }
}
