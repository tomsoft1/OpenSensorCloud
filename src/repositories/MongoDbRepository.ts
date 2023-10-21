import { Measure } from "../domain/Measure";
import { MeasureRepository } from "../interfaces/MesureRepository";
import mongoose, { Schema } from 'mongoose';

// Define the MongoDB connection
mongoose.connect('mongodb://localhost:27017/opensensorchatgpt', {
});

// Définissez un schéma Mongoose pour le modèle
const MeasureSchema = new Schema<Measure>({
    timestamp: Date,
    data: String,
    // ... autres champs du modèle
  });

const MeasureDb = mongoose.model<Measure>('Measure', MeasureSchema);


// Define the Repositories (Data Source)
export class MongoDBRecordRepository implements MeasureRepository {
    constructor() {}
  
    async create(record: Measure) {
      const model = new MeasureDb(record);
      return model.save();
    }
  }