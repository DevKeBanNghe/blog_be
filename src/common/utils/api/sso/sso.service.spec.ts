import { TestingModule } from '@nestjs/testing';
import { SSOService } from './sso.service';
import { AutoMockingTestingModule } from 'src/common/testing/auto-mocking/auto-mocking-testing.module';

describe('SSOService', () => {
  let service: SSOService;

  beforeEach(async () => {
    const module: TestingModule =
      await AutoMockingTestingModule.createTestingModule({
        providers: [SSOService],
      });

    service = module.get<SSOService>(SSOService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
