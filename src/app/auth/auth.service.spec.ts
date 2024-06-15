import { TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AutoMockingTestingModule } from 'src/common/testing/auto-mocking/auto-mocking-testing.module';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule =
      await AutoMockingTestingModule.createTestingModule({
        providers: [AuthService],
      });

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
