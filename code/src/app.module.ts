import { Module } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppController } from './app.controller';
import { CatsModule } from './cats/cats.module';
import { TasksModule } from './tasks/tasks.module';
// import { Custom } from './custom/custom';
import { AppService } from './app.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './logging/logging.interceptor';
import { TasksService } from './tasks/tasks.service';

@Module({
  imports: [CatsModule, TasksModule],
  controllers: [AppController],
  providers: [
    AppService,
    TasksService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
