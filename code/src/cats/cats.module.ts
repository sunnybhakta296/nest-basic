import { MiddlewareConsumer, Module, NestMiddleware, NestModule } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsGateway } from './cats.gateway';
import { CatsService } from './cats.service';
import { LoggerMiddleware } from '../logger/logger.middleware';

@Module({
  controllers: [CatsController],
  providers: [CatsService, CatsGateway]
})
export class CatsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(CatsController);
  }
}
