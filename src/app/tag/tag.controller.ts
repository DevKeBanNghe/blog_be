import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { GetTagListByPaginationDto, GetTagOptionsDto } from './dto/get-tag.dto';
import { ParseParamsPaginationPipe } from 'src/common/pipes/parse-params-pagination.pipe';
import { UpdateActivateStatusDto, UpdateTagDto } from './dto/update-tag.dto';
import { ParseParamsOptionPipe } from 'src/common/pipes/parse-params-option.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { Tag } from '@prisma-postgresql/models';
import { ExcelResponseInterceptor } from 'src/common/interceptors/excel-response.interceptor';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  createTag(@Body() createDto: CreateTagDto) {
    return this.tagService.create(createDto);
  }

  @Get('export')
  @UseInterceptors(ExcelResponseInterceptor)
  async exportTags(@Query('ids') ids: Tag['tag_id'][]) {
    const data = await this.tagService.exportTags({ ids });
    return data;
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  importTags(@UploadedFile() file, @Req() req) {
    return this.tagService.importTags({ file, user: req.user });
  }

  @Put('activate-status')
  updateActivateStatus(@Body() payload: UpdateActivateStatusDto) {
    return this.tagService.updateActivateStatus(payload);
  }

  @Put()
  updateTag(@Body() updateDto: UpdateTagDto) {
    return this.tagService.update(updateDto);
  }

  @Get()
  @UsePipes(ParseParamsPaginationPipe)
  getTagList(@Query() getListByPaginationDto: GetTagListByPaginationDto) {
    return this.tagService.getList(getListByPaginationDto);
  }

  @Get('/options')
  @UsePipes(ParseParamsOptionPipe)
  getTagOptions(@Query() getOptionsDto?: GetTagOptionsDto) {
    return this.tagService.getOptions(getOptionsDto);
  }

  @Get(':id')
  getTagDetail(@Param('id') id: string) {
    return this.tagService.getDetail(id);
  }

  @Delete()
  deleteTags(@Query('ids') ids: string[]) {
    return this.tagService.remove(ids);
  }
}
