import express from 'express';
import { FaceSwapRouter } from './api/faceswap';
import { ApiRoutes } from '../types/apiRoutes';
import swaggerUi from "swagger-ui-express";
import swaggerOutput from "./swagger_output.json";
import morgan from 'morgan';
import cors from 'cors';

const app: express.Application = express();
const port: number = Number(process.env.PORT) || 3000;

app.get('/', (req: express.Request, res: express.Response) => {
    res.send('Up and running!');
});

app.use(ApiRoutes.faceswap, FaceSwapRouter);
app.use(
  cors(
    {
      origin: "*",
      allowedHeaders: "Content-Type,Authorization",
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    }
  )
)
app.use(express.json());
app.use(morgan("tiny"));
app.use(express.static("public"));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerOutput));
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/`);
});