import { Injectable } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';

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