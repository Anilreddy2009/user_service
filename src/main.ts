import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { Queues } from './submodules/entities/src/enum/queues';
require("custom-env").env(true);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice({
    transport: Transport.RMQ,
    options : {
      urls: [process.env.RBTMQ_HOST],
      queue: Queues.USER,
      queueOptions: {
        durable: true,
      }
    }
  });
  await app.listen(8000);
}
bootstrap();
