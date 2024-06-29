import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UsePipes,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { GetBlogListByPaginationDto } from './dto/get-blog.dto';
import { ParseParamsPaginationPipe } from 'src/common/pipes/parse-params-pagination.pipe';
import { ParseIntArrayPipe } from 'src/common/pipes/parse-int-array.pipe';
import {
  UpdatePublishBlogStatusDto,
  UpdateBlogDto,
  UpdateBlogTrackingInfoDto,
} from './dto/update-blog.dto';

@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  createBlog(@Body() createDto: CreateBlogDto) {
    return this.blogService.create(createDto);
  }

  @Put()
  updateBlog(@Body() updateDto: UpdateBlogDto) {
    return this.blogService.update(updateDto);
  }

  @Get()
  @UsePipes(ParseParamsPaginationPipe)
  getBlogList(@Query() getListByPaginationDto: GetBlogListByPaginationDto) {
    return this.blogService.getList(getListByPaginationDto);
  }

  @Get('for-user')
  @UsePipes(ParseParamsPaginationPipe)
  getBlogListForUser(
    @Query() getListByPaginationDto: GetBlogListByPaginationDto
  ) {
    return this.blogService.getListForUser(getListByPaginationDto);
  }

  @Get('/:id/for-user')
  getBlogDetailForUser(@Param('id') id: string) {
    return this.blogService.getDetailForUser(id);
  }

  @Get(':id')
  getBlogDetail(@Param('id') id: string) {
    return this.blogService.getDetail(id);
  }

  @Delete()
  deleteBlogs(@Query('ids') ids: string[]) {
    return this.blogService.remove(ids);
  }

  @Patch('/tracking/:id')
  updateBlogTrackingInfo(
    @Param('id') id: string,
    @Body() updateDto: UpdateBlogTrackingInfoDto
  ) {
    return this.blogService.updateBlogTrackingInfo({
      blog_id: id,
      ...updateDto,
    });
  }

  @Patch('/publish')
  updatePublishBlogStatus(
    @Body() updatePublishBlogStatusDto: UpdatePublishBlogStatusDto
  ) {
    return this.blogService.updatePublishBlogStatus(updatePublishBlogStatusDto);
  }
}
