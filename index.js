import "dotenv/config";
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser';
import { run } from './mongodb.js';
import tweetRoutes from './routes/tweets.js'
import userRoutes from "./routes/users.js";
import followRouter from "./routes/follow.js";
import commentRouter from "./routes/comment.js";
import likeRouter from "./routes/like.js";
import trendRouter from "./routes/trends.js";
import { Server } from 'socket.io';
import { createServer} from 'node:http';
import notifyRouter from "./routes/notifications.js";

const app = express();
 // Use CORS middleware
 app.use(cors({origin:["http://localhost:5173", "http://localhost:3000"], credentials:true}));
 //app.use(cors());

 app.use(bodyParser.urlencoded({limit:"30mb", extended:true}))
 app.use(bodyParser.json({limit:"30mb", extended:true}))
 // a middleware to access json data
 app.use(express.json());
 
 app.use('/tweets', tweetRoutes);

 app.use("/api/auth", userRoutes);

 app.use("/follow", followRouter);

 app.use('/comment', commentRouter);

 app.use('/like', likeRouter);

 app.use('/trends', trendRouter);

 app.use('/notify', notifyRouter)

 
 app.get('/', (req, res) => {
    res.send('<h1>Twitter Clone</h1>');
  });


  const server = createServer(app);
  export const io = new Server(server, {
    // Set also 'polling' for allowing http protocol as fallbacks
    cors: {
      origin: ["http://localhost:5173", "http://localhost:3000"],
    },
    transports: ['websocket', 'polling'],
  });

    io.on('connection', (socket) => {
        const { userId } = socket.handshake.query;

        if (userId) {
          socket.join(userId); // User joins their own room
          console.log(`User ${userId} joined their notification room`);
        }

      
        socket.on('sendNotification', (data) => {
          console.log('received:', data)
          io.to(data.userId).emit('receiveNotification', data.notification);
        });
      
        /* socket.on('disconnect', () => {
          console.log('Client disconnected');
        }); */
      })


server.listen(3000, '0.0.0.0', async() => {
    await run()
    .then(()=>  console.log('Server is running on port 3000')); 
});