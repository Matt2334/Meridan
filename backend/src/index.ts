import app from './app';
import { connectRedis } from '../prisma/library/redis';

const PORT = process.env.PORT || 3000;
const start = async () => {
  await connectRedis();
  app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
};
start();