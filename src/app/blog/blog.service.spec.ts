import { BlogService } from './blog.service';
import { BlogModule } from './blog.module';
import { AutoMockingTestingModule } from 'src/common/testing/auto-mocking/auto-mocking-testing.module';

describe('BlogService', () => {
  let service: BlogService;

  beforeEach(async () => {
    const module = await AutoMockingTestingModule.createTestingModule({
      imports: [BlogModule],
    });

    service = module.get<BlogService>(BlogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
