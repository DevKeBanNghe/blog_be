import { TagService } from './tag.service';
import { TagModule } from './tag.module';
import { AutoMockingTestingModule } from 'src/common/testing/auto-mocking/auto-mocking-testing.module';

describe('TagService', () => {
  let service: TagService;

  beforeEach(async () => {
    const module = await AutoMockingTestingModule.createTestingModule({
      imports: [TagModule],
    });

    service = module.get<TagService>(TagService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
