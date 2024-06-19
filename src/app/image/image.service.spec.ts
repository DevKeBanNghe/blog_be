import { ImageService } from './image.service';
import { ImageModule } from './image.module';
import { AutoMockingTestingModule } from 'src/common/testing/auto-mocking/auto-mocking-testing.module';

describe('ImageService', () => {
  let service: ImageService;

  beforeEach(async () => {
    const module = await AutoMockingTestingModule.createTestingModule({
      imports: [ImageModule],
    });

    service = module.get<ImageService>(ImageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
