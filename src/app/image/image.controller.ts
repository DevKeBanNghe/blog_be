import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { GetImageListByPaginationDto } from './dto/get-image.dto';
import { ParseParamsPaginationPipe } from 'src/common/pipes/parse-params-pagination.pipe';
import { ExcelResponseInterceptor } from 'src/common/interceptors/excel-response.interceptor';
import { Image } from '@prisma-postgresql/models';
import { UpdateActivateStatusDto } from './dto/update-tag.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('images')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Get()
  @UsePipes(ParseParamsPaginationPipe)
  getImageList(@Query() getListByPaginationDto: GetImageListByPaginationDto) {
    return this.imageService.getList(getListByPaginationDto);
  }

  @Get('export')
  @UseInterceptors(ExcelResponseInterceptor)
  async exportImages(@Query('ids') ids: Image['image_id'][]) {
    const data = await this.imageService.exportImages({ ids });
    return data;
  }

  @Put('activate-status')
  updateActivateStatus(@Body() payload: UpdateActivateStatusDto) {
    return this.imageService.updateActivateStatus(payload);
  }

  @Delete()
  deleteImages(@Query('ids') ids: string[]) {
    return this.imageService.remove(ids);
  }

  @Post('/upload')
  @UseInterceptors(FilesInterceptor('files'))
  uploadImages(@UploadedFiles() files) {
    return this.imageService.upload(files);
  }
}
