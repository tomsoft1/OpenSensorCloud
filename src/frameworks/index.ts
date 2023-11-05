import express from 'express';
import { MongoDBRecordRepository } from '../repositories/MongoDbRepository';
import { SaveMeasureUseCase } from '../useCases/saveMeasureUseCase';
import { logger } from '../common/logger';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
var morgan = require('morgan')
import cors from 'cors';
const mqtt = require('mqtt')


// MQTT Broquer
const protocol = 'mqtt'
const host = 'mqtt.myapp.fr'
const mqtt_port = '1883'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`

const connectUrl = `${protocol}://${host}:${mqtt_port}`

// Create Express application
const app = express();
app.use(express.json({ type: '*/*' }))
app.use(cors({
  origin: '*'
}));
app.use(morgan('dev'))
// Create the repository instance
const recordRepository = new MongoDBRecordRepository();

app.get('/test',async (req, res) => {
  sendAll("test","YO",{a:"b"})
  res.status(200).send("ok");
})

// Define a route to save records
app.post('/device/:id', async (req, res) => {
  logger.info('received...', req.body)
  let arrayOfMeasures: any[] = req.body;

  try {
    const saveRecordUseCase = new SaveMeasureUseCase(recordRepository)
    const createdRecord = await saveRecordUseCase.execute(new Date(), req.params.id, arrayOfMeasures);
    res.status(200).json(createdRecord);
    sendAll(req.params.id, "INSERT" , createdRecord)
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
    let limit = 1000
    if (limitStr) {
      limit = Number.parseInt(limitStr as any as string)
    }
    logger.info('Limit:' + limit)
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
const port = process.env.PORT || 8003;

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
let sockets: Array<Socket> = []

io.on('connection', (socket: Socket) => {
  logger.info('New client connected');
  sockets.push(socket)
  // Send a message to the client
  socket.emit('message', { info: 'connected' });

  socket.on('disconnect', () => {
    logger.warn('Client disconnected');
    sockets = sockets.filter(elem => elem != socket)
  });
});

function sendAll(device_id:string, action:string, message: any) {
  logger.info('Send all %o to length:' + sockets.length, message)
  sockets.forEach(socket => {
    socket.emit('message', { device: device_id, action: action, message: message })
  })
  client.publish("device/"+device_id+"/"+action,JSON.stringify(message))
}


const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  reconnectPeriod: 1000,
})

client.on('connect', () => {
  console.log('Connected')
  client.subscribe(["register/#"], () => {
    console.log(`Subscribe to topic'`)
  })
  client.on('message', (topic:string, payload: { toString: () => any; }) => {
    console.log('Received Message:', topic, payload.toString())
  })
})

server.listen(port, () => {
  logger.info(`Server is running on http://localhost:${port}`);
});


// Export the Express app for testing
export = app;


