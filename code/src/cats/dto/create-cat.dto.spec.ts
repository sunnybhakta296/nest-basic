import { validate } from 'class-validator';
import { CreateCatDto } from '../../../../cats/dto/create-cat.dto';

describe('CreateCatDto', () => {
  it('should validate a valid DTO', async () => {
    const dto = new CreateCatDto();
    dto.name = 'Tom';
    dto.age = 3;
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation for missing name', async () => {
    const dto = new CreateCatDto();
    dto.age = 3;
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('name');
  });

  it('should fail validation for non-integer age', async () => {
    const dto = new CreateCatDto();
    dto.name = 'Tom';
    // @ts-expect-error
    dto.age = 'not-a-number';
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('age');
  });
});
