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
  Req,
  UploadedFile,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto, SubscribeToBlogsDto } from './dto/create-blog.dto';
import { GetBlogListByPaginationDto } from './dto/get-blog.dto';
import { ParseParamsPaginationPipe } from 'src/common/pipes/parse-params-pagination.pipe';
import {
  UpdatePublishBlogStatusDto,
  UpdateBlogDto,
  UpdateBlogTrackingInfoDto,
  UpdateActivateStatusDto,
} from './dto/update-blog.dto';
import { ExcelResponseInterceptor } from 'src/common/interceptors/excel-response.interceptor';
import { Blog } from '@prisma-postgresql/models';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  createBlog(@Body() createDto: CreateBlogDto) {
    return this.blogService.create(createDto);
  }

  @Get('export')
  @UseInterceptors(ExcelResponseInterceptor)
  async exportBlogs(@Query('ids') ids: Blog['blog_id'][]) {
    const data = await this.blogService.exportBlogs({ ids });
    return data;
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  importBlogs(@UploadedFile() file, @Req() req) {
    return this.blogService.importBlogs({ file, user: req.user });
  }

  @Put('activate-status')
  updateActivateStatus(@Body() payload: UpdateActivateStatusDto) {
    return this.blogService.updateActivateStatus(payload);
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

  @Post('/subscribe')
  subscribeToBlogs(@Body() subscribeToBlogsDto: SubscribeToBlogsDto) {
    return this.blogService.subscribeToBlogs(subscribeToBlogsDto);
  }
}
