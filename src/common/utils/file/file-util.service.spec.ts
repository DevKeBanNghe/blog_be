import { TestingModule } from '@nestjs/testing';
import { FileUtilService } from './file-util.service';
import { JwtService } from '@nestjs/jwt';
import { AutoMockingTestingModule } from 'src/common/testing/auto-mocking/auto-mocking-testing.module';

describe('FileUtilService', () => {
  let service: FileUtilService;

  beforeEach(async () => {
    const module: TestingModule =
      await AutoMockingTestingModule.createTestingModule({
        providers: [FileUtilService, JwtService],
      });

    service = module.get<FileUtilService>(FileUtilService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
