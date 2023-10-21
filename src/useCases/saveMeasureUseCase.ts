import { MeasureRepository } from "../interfaces/MesureRepository";
import { Measure } from "../domain/Measure";

// Define the Use Cases (Interactors)
export class SaveMeasureUseCase {
    constructor(private recordRepository: MeasureRepository) {}
  
    async execute(timestamp: Date, deviceId:string , data: any) {
      console.log('Save record:',data)
      const record = new Measure(timestamp, deviceId, data);
      console.log(record)
      return await this.recordRepository.create(record);
    }



  }


