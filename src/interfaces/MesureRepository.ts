import { Measure } from "../domain/Measure";

// Define the Interfaces (Gateways)
export interface MeasureRepository {
    create(record: Measure): Promise<any>;
    getAll(query:any,limit:number):Promise<Array<Measure>>
  }