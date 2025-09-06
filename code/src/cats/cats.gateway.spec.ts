import { Test, TestingModule } from '@nestjs/testing';
import { CatsGateway } from './cats.gateway';

describe('CatsGateway', () => {
  let gateway: CatsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CatsGateway],
    }).compile();

    gateway = module.get<CatsGateway>(CatsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
