import express from 'express';
//import bodyParser from 'body-parser';
import winston from 'winston';
import { MongoDBRecordRepository } from '../repositories/MongoDbRepository';
import { SaveMeasureUseCase } from '../useCases/saveMeasureUseCase';
import { logger } from '../common/logger';
const cors = require('cors');

// Create Express application
const app = express();
//app.use(bodyParser.json());
app.use(express.json({type:'*/*'}))
app.use(cors({
  origin: '*'
}));
// Create the repository instance
const recordRepository = new MongoDBRecordRepository();

// Define a route to save records
app.post('/device/:id', async (req, res) => {
  console.log('received...',req.body)
  let arrayOfMeasures:any[] =  req.body;

  try {
    console.log('la...')
    const saveRecordUseCase = new SaveMeasureUseCase(recordRepository)
    const createdRecord = await saveRecordUseCase.execute(new Date(), req.params.id, arrayOfMeasures);
    res.status(201).json(createdRecord);

    // Log successful record creation
   // logger.info('Record created', { timestamp, data });
  } catch (error) {
    // Log errors and send an error response
    logger.error('Error creating measure', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/device/:id', async (req, res) => {
  logger.info('GET received...')

  try {
    const saveRecordUseCase = new SaveMeasureUseCase(recordRepository)
    const limitStr = req.query['limit']
    let limit=1000
    if(limitStr){
      limit =  Number.parseInt(limitStr as any as string)
    }
    logger.info('Limit:'+limit)
    const createdRecord = await saveRecordUseCase.getAll({}, limit);
    res.status(201).json(createdRecord);

    // Log successful record creation
   // logger.info('Record created', { timestamp, data });
  } catch (error) {
    // Log errors and send an error response
    logger.error('Error getting measure', error);
    res.status(500).send('Internal Server Error');
  }
});
// Start the Express server
const port = 8003;

// Export the Express app for testing
export = app;

app.listen(port, () => {
  logger.info(`Server is running on http://localhost:${port}`);
});
