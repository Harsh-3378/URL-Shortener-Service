import express from 'express';
import 'dotenv/config'
import userRouter from './routes/user.routes.js';
import urlRouter from './routes/url.routes.js'
import { authenticationMiddleware } from "./middlewares/auth.middleware.js";

const app = express();
const PORT = process.env.PORT ?? 8000;

app.use(express.json());
app.use(authenticationMiddleware)

app.get('/', (req, res) => {
  return res.json({ message: 'URL Shortener Service is running' });
} );  

app.use("/api/user", userRouter);
app.use('/api/url', urlRouter)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});