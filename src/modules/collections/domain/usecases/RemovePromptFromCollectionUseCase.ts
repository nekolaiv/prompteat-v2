import { ICollectionRepository } from "../repositories";
import { UUID } from "@/shared/types";

export class RemovePromptFromCollectionUseCase {
  constructor(private collectionRepository: ICollectionRepository) {}

  async execute(collectionId: UUID, promptId: UUID): Promise<void> {
    await this.collectionRepository.removePrompt(collectionId, promptId);
  }
}
