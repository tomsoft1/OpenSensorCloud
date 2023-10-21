import express from 'express';
//import bodyParser from 'body-parser';
import winston from 'winston';
import { MongoDBRecordRepository } from '../repositories/MongoDbRepository';
import { SaveMeasureUseCase } from '../useCases/saveMeasureUseCase';

// Create an instance of the Winston logger
const logger = winston.createLogger({
  format: winston.format.combine(winston.format.printf((info) => {
    if (typeof info.message === 'object') {
      info.message = JSON.stringify(info.message, null, 3)
    }
    return info.message
  }),
    winston.format.timestamp(),
    winston.format.splat(),
    winston.format.align(),
    winston.format.json(),
    winston.format.colorize({ all: true }),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
  ],
});

// Create Express application
const app = express();
//app.use(bodyParser.json());
app.use(express.json({type:'*/*'}))

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
  console.log('received...')
  let arrayOfMeasures:any[] =  req.body;

  try {
    console.log('la...')
    const saveRecordUseCase = new SaveMeasureUseCase(recordRepository)
    const createdRecord = await saveRecordUseCase.getAll();
    res.status(201).json(createdRecord);

    // Log successful record creation
   // logger.info('Record created', { timestamp, data });
  } catch (error) {
    // Log errors and send an error response
    logger.error('Error creating measure', error);
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
