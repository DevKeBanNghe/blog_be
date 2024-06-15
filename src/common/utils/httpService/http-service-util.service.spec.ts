import { TestingModule } from '@nestjs/testing';
import { HttpServiceUtilService } from './http-service-util.service';
import { AutoMockingTestingModule } from 'src/common/testing/auto-mocking/auto-mocking-testing.module';

describe('HttpServiceUtilService', () => {
  let service: HttpServiceUtilService;

  beforeEach(async () => {
    const module: TestingModule =
      await AutoMockingTestingModule.createTestingModule({
        providers: [HttpServiceUtilService],
      });

    service = module.get<HttpServiceUtilService>(HttpServiceUtilService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
