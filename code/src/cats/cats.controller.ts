import { Controller, Post, Body, UseFilters, UseGuards, UsePipes, Get, UseInterceptors } from '@nestjs/common';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { HttpExceptionFilter } from '../http-exception/http-exception.filter';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { ValidationPipe } from '../validation/validation.pipe';
import { LoggingInterceptor } from '../logging/logging.interceptor';


@UseInterceptors(LoggingInterceptor)
@Controller('cats')
@UseFilters(HttpExceptionFilter) // Apply exception filter to all routes in this controller

         // Apply guard to all routes in this controller
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Get()
  getAll() {
    return this.catsService.getCats();
  }

  @Post()
  @Roles('admin') // Only users with 'admin' role can access
  @UseGuards(RolesGuard)  
  @UsePipes(ValidationPipe) // Validate request body
  create(@Body() createCatDto: CreateCatDto) {
    return this.catsService.createCat(createCatDto);
  }

  @Post("/validation-pipe")
  @UsePipes(ValidationPipe)
  createWithValidation(@Body() createCatDto: CreateCatDto) {
    return this.catsService.createCat(createCatDto);
  }
}