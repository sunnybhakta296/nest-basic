# NestJS Concepts: Code Samples by Folder

## 1. App Module (`src/app.module.ts`)
```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [CatsModule, TasksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

## 2. Controller (`src/cats/cats.controller.ts`)
```typescript
import { Controller, Get, Post, Body, UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { CatsService } from './cats.service';
import { CreateCatDto } from '../../cats/dto/create-cat.dto';
import { HttpExceptionFilter } from '../http-exception/http-exception.filter';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { ValidationPipe } from '../validation/validation.pipe';

@Controller('cats')
@UseFilters(HttpExceptionFilter)
@UseGuards(RolesGuard)
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Get()
  findAll() {
    return this.catsService.getCats();
  }

  @Post()
  @Roles('admin')
  @UsePipes(ValidationPipe)
  create(@Body() createCatDto: CreateCatDto) {
    return this.catsService.createCat(createCatDto);
  }
}
```

## 3. Service (`src/cats/cats.service.ts`)
```typescript
import { Injectable } from '@nestjs/common';
import { CreateCatDto } from '../../cats/dto/create-cat.dto';

@Injectable()
export class CatsService {
  private cats = [{ name: 'Tom', age: 3 }];

  getCats() {
    return this.cats;
  }

  createCat(cat: CreateCatDto) {
    this.cats.push(cat);
    return cat;
  }
}
```

## 4. DTO (`code/cats/dto/create-cat.dto.ts`)
```typescript
import { IsString, IsInt } from 'class-validator';

export class CreateCatDto {
  @IsString()
  name: string;

  @IsInt()
  age: number;
}
```

## 5. Middleware (`src/logger/logger.middleware.ts`)
```typescript
import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    console.log(`[Request] ${req.method} ${req.url}`);
    next();
  }
}
```

## 6. Guard (`src/roles/roles.guard.ts`)
```typescript
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // Example: allow only if user has 'admin' role
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return user && user.roles && user.roles.includes('admin');
  }
}
```

## 7. Interceptor (`src/logging/logging.interceptor.ts`)
```typescript
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');
    return next.handle().pipe(tap(() => console.log('After...')));
  }
}
```

## 8. Pipe (`src/validation/validation.pipe.ts`)
```typescript
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class ValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value || typeof value.name !== 'string') {
      throw new BadRequestException('Validation failed: name is required');
    }
    return value;
  }
}
```

## 9. Exception Filter (`src/http-exception/http-exception.filter.ts`)
```typescript
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      message: exception.message,
    });
  }
}
```

## 10. Custom Provider (`src/custom/custom.ts`)
```typescript
export const customProvider = {
  provide: 'CUSTOM_TOKEN',
  useValue: { message: 'Hello from custom provider' },
};
```

## 11. Async Provider (`src/async/async.service.ts`)
```typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class AsyncService {
  async getAsyncValue() {
    return await Promise.resolve('Async value');
  }
}
```

## 12. Lifecycle Hooks (`src/app/app.service.ts`)
```typescript
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';

@Injectable()
export class AppService implements OnModuleInit, OnModuleDestroy {
  onModuleInit() {
    console.log('Module initialized');
  }
  onModuleDestroy() {
    console.log('Module destroyed');
  }
}
```

## 13. WebSocket Gateway (`src/cats/cats.gateway.ts`)
```typescript
import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class CatsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: string): string {
    // Echo the message back to the client
    return `Received: ${data}`;
  }

  // Example: broadcast to all clients
  broadcastCatEvent(cat: any) {
    this.server.emit('catEvent', cat);
  }
}
```

**Usage:**
- Register `CatsGateway` in the `providers` array of your `CatsModule`.
- Connect with a WebSocket client and emit a `message` event to test.
- Use `broadcastCatEvent` to send events to all connected clients.

## 14. Scheduling (`src/tasks/tasks.service.ts`)
```typescript
import { Injectable } from '@nestjs/common';
import { Cron, Interval, Timeout } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  // Runs every minute at 45 seconds
  @Cron('45 * * * * *')
  handleCron() {
    console.log('Called every minute at 45 seconds');
  }

  // Runs every 10 seconds
  @Interval(10000)
  handleInterval() {
    console.log('Called every 10 seconds');
  }

  // Runs once after 5 seconds
  @Timeout(5000)
  handleTimeout() {
    console.log('Called once after 5 seconds');
  }
}
```

**Usage:**
1. Install the schedule module if not already:
   ```sh
   npm install @nestjs/schedule
   ```
2. Import `ScheduleModule.forRoot()` in your `AppModule`:
   ```typescript
   import { ScheduleModule } from '@nestjs/schedule';

   @Module({
     imports: [ScheduleModule.forRoot(), /* other modules */],
     /* ... */
   })
   export class AppModule {}
   ```
3. Add `TasksService` to the `providers` array of your `TasksModule`.
4. The scheduled methods will run automatically when the app starts.

---

## Using Exception Filter, Roles Guard, and Validation Pipe Together

### Exception Filter (`src/http-exception/http-exception.filter.ts`)
```typescript
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      message: exception.message,
    });
  }
}
```

### Roles Guard (`src/roles/roles.guard.ts`)
```typescript
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // Example: allow only if user has 'admin' role
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return user && user.roles && user.roles.includes('admin');
  }
}
```

### Roles Decorator (`src/roles/roles.decorator.ts`)
```typescript
import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
```

### Validation Pipe (`src/validation/validation.pipe.ts`)
```typescript
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class ValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value || typeof value.name !== 'string') {
      throw new BadRequestException('Validation failed: name is required');
    }
    return value;
  }
}
```

### Using All in a Controller (`src/cats/cats.controller.ts`)
```typescript
import { Controller, Post, Body, UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { CatsService } from './cats.service';
import { CreateCatDto } from '../../cats/dto/create-cat.dto';
import { HttpExceptionFilter } from '../http-exception/http-exception.filter';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { ValidationPipe } from '../validation/validation.pipe';

@Controller('cats')
@UseFilters(HttpExceptionFilter)
@UseGuards(RolesGuard)
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  @Roles('admin')
  @UsePipes(ValidationPipe)
  create(@Body() createCatDto: CreateCatDto) {
    return this.catsService.createCat(createCatDto);
  }
}
```

---

## Example: Logger Middleware and Logging Interceptor

### Logger Middleware (`src/logger/logger.middleware.ts`)
```typescript
import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    console.log(`[Request] ${req.method} ${req.url}`);
    next();
  }
}
```

**Usage:**
Register globally in `main.ts`:
```typescript
import { LoggerMiddleware } from './logger/logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(LoggerMiddleware);
  await app.listen(3000);
}
```
Or register in a module:
```typescript
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerMiddleware } from './logger/logger.middleware';

@Module({ /* ... */ })
export class CatsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
```

### Logging Interceptor (`src/logging/logging.interceptor.ts`)
```typescript
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');
    return next.handle().pipe(tap(() => console.log('After...')));
  }
}
```

**Usage:**
Register globally in `main.ts`:
```typescript
import { LoggingInterceptor } from './logging/logging.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
```
Or use in a controller:
```typescript
import { UseInterceptors } from '@nestjs/common';
import { LoggingInterceptor } from '../logging/logging.interceptor';

@UseInterceptors(LoggingInterceptor)
@Controller('cats')
export class CatsController { /* ... */ }
```

---

## Scheduling (Cron, Interval, Timeout) Concepts in NestJS

### 1. Install the Schedule Module
```sh
npm install @nestjs/schedule
```

### 2. Import ScheduleModule in Your App or Feature Module
```typescript
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot(), /* other modules */],
  /* ... */
})
export class AppModule {}
```
Or in a feature module (e.g., `TasksModule`):
```typescript
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [TasksService],
})
export class TasksModule {}
```

### 3. Using @Cron, @Interval, and @Timeout in a Service
```typescript
import { Injectable } from '@nestjs/common';
import { Cron, Interval, Timeout } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  // Runs every minute at 45 seconds
  @Cron('45 * * * * *')
  handleCron() {
    console.log('Called every minute at 45 seconds');
  }

  // Runs every 10 seconds
  @Interval(10000)
  handleInterval() {
    console.log('Called every 10 seconds');
  }

  // Runs once after 5 seconds
  @Timeout(5000)
  handleTimeout() {
    console.log('Called once after 5 seconds');
  }
}
```

### 4. Testing and Observing Scheduled Tasks
- Start your app and watch the terminal for log messages from the scheduled methods.
- You can also add endpoints in a controller to trigger these methods manually for testing.

### 5. Best Practices
- Use `@Cron` for cron-based schedules.
- Use `@Interval` for repeated intervals.
- Use `@Timeout` for one-time delayed execution.
- Use NestJS `Logger` for production logging instead of `console.log`.

---

## Unit Test Examples for All Main Files

### CatsController
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

describe('CatsController', () => {
  let controller: CatsController;
  let service: CatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatsController],
      providers: [CatsService],
    }).compile();
    controller = module.get<CatsController>(CatsController);
    service = module.get<CatsService>(CatsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all cats', () => {
    jest.spyOn(service, 'getCats').mockReturnValue([{ name: 'Tom', age: 3 }]);
    expect(controller.findAll()).toEqual([{ name: 'Tom', age: 3 }]);
  });
});
```

### CatsService
```typescript
import { CatsService } from './cats.service';

describe('CatsService', () => {
  let service: CatsService;

  beforeEach(() => {
    service = new CatsService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return cats', () => {
    expect(service.getCats()).toEqual([{ name: 'Tom', age: 3 }]);
  });
});
```

### CatsGateway
```typescript
import { CatsGateway } from './cats.gateway';

describe('CatsGateway', () => {
  let gateway: CatsGateway;

  beforeEach(() => {
    gateway = new CatsGateway();
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  it('should echo the message', () => {
    expect(gateway.handleMessage('test')).toBe('Received: test');
  });
});
```

### LoggerMiddleware
```typescript
import { LoggerMiddleware } from './logger.middleware';

describe('LoggerMiddleware', () => {
  it('should call next()', () => {
    const middleware = new LoggerMiddleware();
    const req = {} as any;
    const res = {} as any;
    const next = jest.fn();
    middleware.use(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
```

### LoggingInterceptor
```typescript
import { LoggingInterceptor } from './logging.interceptor';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';

describe('LoggingInterceptor', () => {
  it('should log before and after', (done) => {
    const interceptor = new LoggingInterceptor();
    const context = {} as ExecutionContext;
    const callHandler: CallHandler = {
      handle: () => of('test'),
    };
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    interceptor.intercept(context, callHandler).subscribe(() => {
      expect(spy).toHaveBeenCalledWith('Before...');
      expect(spy).toHaveBeenCalledWith('After...');
      spy.mockRestore();
      done();
    });
  });
});
```

### ValidationPipe
```typescript
import { ValidationPipe } from './validation.pipe';

describe('ValidationPipe', () => {
  it('should return value unchanged if valid', () => {
    const pipe = new ValidationPipe();
    const value = { name: 'Tom' };
    const metadata = {} as any;
    expect(pipe.transform(value, metadata)).toBe(value);
  });

  it('should throw if name is missing', () => {
    const pipe = new ValidationPipe();
    expect(() => pipe.transform({}, {} as any)).toThrow();
  });
});
```

### RolesGuard
```typescript
import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  it('should allow if user has admin role', () => {
    const guard = new RolesGuard();
    const context: any = {
      switchToHttp: () => ({
        getRequest: () => ({ user: { roles: ['admin'] } }),
      }),
    };
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should deny if user has no roles', () => {
    const guard = new RolesGuard();
    const context: any = {
      switchToHttp: () => ({
        getRequest: () => ({ user: {} }),
      }),
    };
    expect(guard.canActivate(context)).toBe(false);
  });
});
```

### HttpExceptionFilter
```typescript
import { HttpExceptionFilter } from './http-exception.filter';

describe('HttpExceptionFilter', () => {
  it('should be defined', () => {
    const filter = new HttpExceptionFilter();
    expect(filter).toBeDefined();
  });
});
```

### AsyncService
```typescript
import { AsyncService } from './async.service';

describe('AsyncService', () => {
  let service: AsyncService;

  beforeEach(() => {
    service = new AsyncService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return async value', async () => {
    await expect(service.getAsyncValue()).resolves.toBe('Async value');
  });
});
```

### customProvider
```typescript
import { customProvider } from './custom';

describe('customProvider', () => {
  it('should provide a message', () => {
    expect(customProvider.useValue.message).toBe('Hello from custom provider');
  });
});
```

### TasksService
```typescript
import { TasksService } from './tasks.service';

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(() => {
    service = new TasksService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have handleCron method', () => {
    expect(typeof service.handleCron).toBe('function');
  });
});
```
