import { Measure } from "../domain/Measure";

// Define the Interfaces (Gateways)
export interface MeasureRepository {
    create(record: Measure): Promise<any>;
    getAll():Promise<Array<Measure>>
  }