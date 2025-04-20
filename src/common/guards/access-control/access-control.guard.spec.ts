import { AutoMockingTestingModule } from 'src/common/testing/auto-mocking/auto-mocking-testing.module';
import { AccessControlGuard } from './access-control.guard';

describe('AccessControlGuard', () => {
  let guard: AccessControlGuard;

  beforeAll(async () => {
    const app = await AutoMockingTestingModule.createTestingModule({
      providers: [AccessControlGuard],
    });

    guard = app.get<AccessControlGuard>(AccessControlGuard);
  });
  it('should be defined', () => {
    expect(guard).toBeDefined();
  });
});
