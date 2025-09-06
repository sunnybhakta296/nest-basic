Install dependencies (NestJS CLI, Mongoose, Config, Swagger, Schedule, Multer, WebSockets, class-validator).
Scaffold modules, controllers, and services (e.g., Cats).
Set up MongoDB connection.
Implement sample code for each concept.
Add unit and integration test setup.

cd code && npm install @nestjs/mongoose mongoose @nestjs/config @nestjs/swagger swagger-ui-express @nestjs/schedule @nestjs/platform-express @nestjs/websockets @nestjs/platform-socket.io class-validator class-transformer

nest generate module cats && nest generate controller cats && nest generate service cats

nest generate module tasks && nest generate service tasks

nest generate gateway cats


nest generate middleware logger && nest generate pipe validation && nest generate guard roles && nest generate interceptor logging && nest generate filter http-exception

nest generate dto cats/create-cat && nest generate decorator roles --type class


nest generate service async && nest generate provider custom

nest generate service app


nest generate spec cats/cats && nest generate spec cats/cats.controller && nest generate spec cats/cats.service

nest generate spec tasks/tasks.service

nest generate spec cats/cats.gateway

nest generate spec logger.middleware && nest generate spec validation.pipe && nest generate spec roles.guard && nest generate spec logging.interceptor && nest generate spec http-exception.filter


nest generate spec async/async.service && nest generate spec custom.provider && nest generate spec app/app.service

nest generate spec cats/dto/create-cat.dto && nest generate spec roles.decorator

nest generate spec cats/cats.module

nest generate spec tasks/tasks.module