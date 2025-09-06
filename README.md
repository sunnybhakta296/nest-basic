# NestJS Concepts Overview

NestJS is a progressive Node.js framework for building efficient, reliable, and scalable server-side applications. Below are key concepts with brief descriptions and code examples.

---

## 1. Modules

Modules organize code into cohesive blocks.

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { CatsModule } from './cats/cats.module';

@Module({
    imports: [CatsModule],
})
export class AppModule {}
```

---

## 2. Controllers

Controllers handle incoming requests and return responses.

```typescript
// cats.controller.ts
import { Controller, Get } from '@nestjs/common';

@Controller('cats')
export class CatsController {
    @Get()
    findAll() {
        return 'This action returns all cats';
    }
}
```

---

## 3. Providers & Services

Services contain business logic and can be injected into controllers.

```typescript
// cats.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class CatsService {
    getCats() {
        return ['Tom', 'Jerry'];
    }
}
```

---

## 4. Dependency Injection

NestJS uses dependency injection for managing providers.

```typescript
// cats.controller.ts
import { Controller, Get } from '@nestjs/common';
import { CatsService } from './cats.service';

@Controller('cats')
export class CatsController {
    constructor(private catsService: CatsService) {}

    @Get()
    findAll() {
        return this.catsService.getCats();
    }
}
```

---

## 5. Middleware

Middleware can execute code before request reaches controller.

```typescript
// logger.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(req, res, next) {
        console.log('Request...');
        next();
    }
}
```

---

## 6. Exception Filters

Handle errors and customize error responses.

```typescript
// http-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        // handle exception
    }
}
```

---

## 7. Pipes

Transform and validate input data.

```typescript
// validation.pipe.ts
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class ValidationPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        // validate value
        return value;
    }
}
```

---

## 8. Guards

Implement authorization logic.

```typescript
// roles.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        // check user roles
        return true;
    }
}
```

---

## 9. Interceptors

Add extra logic before/after method execution.

```typescript
// logging.interceptor.ts
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

---

## 10. Decorators

NestJS uses decorators for metadata and configuration.

```typescript
@Controller('cats')
export class CatsController {}
```

---

## 11. Routing

Define routes using decorators.

```typescript
@Get(':id')
findOne(@Param('id') id: string) {
    return `Cat #${id}`;
}
```

---

## 12. Configuration & Environment

Use `@nestjs/config` for environment variables.

```typescript
// app.module.ts
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [ConfigModule.forRoot()],
})
export class AppModule {}
```

---

## 13. Testing

NestJS supports unit and e2e testing.

```typescript
// cats.service.spec.ts
import { CatsService } from './cats.service';

describe('CatsService', () => {
    let service: CatsService;

    beforeEach(() => {
        service = new CatsService();
    });

    it('should return cats', () => {
        expect(service.getCats()).toEqual(['Tom', 'Jerry']);
    });
});
```

---

## 14. Custom Decorators

Create reusable decorators for custom logic.

```typescript
// roles.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
```

---

## 15. Async Providers

Providers can be asynchronous, useful for dynamic configuration.

```typescript
// async.provider.ts
import { Module } from '@nestjs/common';

const asyncProvider = {
    provide: 'ASYNC_CONFIG',
    useFactory: async () => {
        return await Promise.resolve({ key: 'value' });
    },
};

@Module({
    providers: [asyncProvider],
})
export class AppModule {}
```

---

## 16. Request Lifecycle Events

Listen to application lifecycle events.

```typescript
// app.service.ts
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

---

## 17. Custom Providers

Define custom providers for dependency injection.

```typescript
// custom.provider.ts
const customProvider = {
    provide: 'CUSTOM_TOKEN',
    useValue: { message: 'Hello from custom provider' },
};
```

---

## 18. Global Middleware

Apply middleware globally in the main application file.

```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerMiddleware } from './logger.middleware';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.use(new LoggerMiddleware().use);
    await app.listen(3000);
}
bootstrap();
```

---

## 19. Interacting with Databases

NestJS supports various ORMs like TypeORM and Prisma.

```typescript
// cats.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Cat {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
}
```

---

## 20. DTOs (Data Transfer Objects)

DTOs define the shape of data sent over the network.

```typescript
// create-cat.dto.ts
export class CreateCatDto {
    name: string;
    age: number;
}
```

---

## 21. Validation

Use class-validator and pipes for input validation.

```typescript
// create-cat.dto.ts
import { IsString, IsInt } from 'class-validator';

export class CreateCatDto {
    @IsString()
    name: string;

    @IsInt()
    age: number;
}
```

---

## 22. Swagger API Documentation

NestJS integrates with Swagger for API docs.

```typescript
// main.ts
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document);
```

---

## 23. Scheduling Tasks

Use `@nestjs/schedule` for cron jobs and scheduled tasks.

```typescript
// tasks.service.ts
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TasksService {
    @Cron('45 * * * * *')
    handleCron() {
        console.log('Called every minute at 45 seconds');
    }
}
```

---

## 24. File Uploads

Handle file uploads using `@nestjs/platform-express`.

```typescript
// cats.controller.ts
import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('cats')
export class CatsController {
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        return { filename: file.originalname };
    }
}
```

---

## 25. WebSockets

NestJS supports real-time communication with WebSockets.

```typescript
// cats.gateway.ts
import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';

@WebSocketGateway()
export class CatsGateway {
    @SubscribeMessage('message')
    handleMessage(@MessageBody() data: string): string {
        return `Received: ${data}`;
    }
}
```


---

## 26. Scopes

NestJS providers can have different scopes: `Singleton` (default), `Request`, or `Transient`. Scopes control the provider's lifecycle.

```typescript
// cats.service.ts
import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class CatsService {
    // This service will be instantiated per request
}
```
