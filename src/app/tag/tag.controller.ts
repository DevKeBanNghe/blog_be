import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { GetTagListByPaginationDto, GetTagOptionsDto } from './dto/get-tag.dto';
import { ParseParamsPaginationPipe } from 'src/common/pipes/parse-params-pagination.pipe';
import { UpdateTagDto } from './dto/update-tag.dto';
import { ParseParamsOptionPipe } from 'src/common/pipes/parse-params-option.pipe';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  createTag(@Body() createDto: CreateTagDto) {
    return this.tagService.create(createDto);
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
