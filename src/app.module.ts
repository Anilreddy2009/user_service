import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './module/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
require("custom-env").env(true);

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URL
    ),
    UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
