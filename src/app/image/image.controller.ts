import {
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { GetImageListByPaginationDto } from './dto/get-image.dto';
import { ParseParamsPaginationPipe } from 'src/common/pipes/parse-params-pagination.pipe';
import { ParseIntArrayPipe } from 'src/common/pipes/parse-int-array.pipe';
import { FilesStorageInterceptor } from './interceptors/files-storage.interceptor';

@Controller('images')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Get()
  @UsePipes(ParseParamsPaginationPipe)
  getImageList(@Query() getListByPaginationDto: GetImageListByPaginationDto) {
    return this.imageService.getList(getListByPaginationDto);
  }

  @Delete()
  deleteImages(@Query('ids') ids: string[]) {
    return this.imageService.remove(ids);
  }

  @Post('/upload')
  @UseInterceptors(FilesStorageInterceptor)
  uploadImages(@UploadedFiles() files) {
    return this.imageService.upload(files);
  }
}
