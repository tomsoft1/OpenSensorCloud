import { MeasureRepository } from "../interfaces/MesureRepository";
import { Measure } from "../domain/Measure";

// Define the Use Cases (Interactors)
export class SaveMeasureUseCase {
    constructor(private recordRepository: MeasureRepository) {}
  
    async execute(timestamp: Date, data: string) {
      const record = new Measure(timestamp, data);
      return await this.recordRepository.create(record);
    }
  }