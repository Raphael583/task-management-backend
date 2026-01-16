import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongoModule } from './database/mongo.module';
import { TasksModule } from './tasks/tasks.module';
import { ConfigModule } from '@nestjs/config';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [
     ConfigModule.forRoot({
      isGlobal: true,
     }),
     MongoModule,
     TasksModule,
     AiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
