import { TestingModule } from '@nestjs/testing';
import { PrismaModule } from './prisma.module';
import { PrismaService } from './prisma.service';
import { AutoMockingTestingModule } from 'src/common/testing/auto-mocking/auto-mocking-testing.module';

describe('PrismaService', () => {
  let service: PrismaService;
  beforeEach(async () => {
    const module: TestingModule =
      await AutoMockingTestingModule.createTestingModule({
        imports: [PrismaModule],
      });
    service = module.get<PrismaService>(PrismaService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
