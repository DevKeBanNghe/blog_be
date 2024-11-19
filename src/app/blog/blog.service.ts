import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CreateService,
  DeleteService,
  GetAllService,
  GetDetailService,
  UpdateService,
} from 'src/common/interfaces/service.interface';
import { CreateBlogDto } from './dto/create-blog.dto';
import { PrismaService } from 'src/common/db/prisma/prisma.service';
import { GetBlogListByPaginationDto } from './dto/get-blog.dto';
import { ApiService } from 'src/common/utils/api/api.service';
import {
  UpdatePublishBlogStatusDto,
  UpdateBlogDto,
  UpdateBlogTrackingInfoDto,
} from './dto/update-blog.dto';
import { TagService } from '../tag/tag.service';
import { Blog } from './entities/blog.entity';
@Injectable()
export class BlogService
  implements
    CreateService<CreateBlogDto>,
    GetAllService,
    GetDetailService,
    DeleteService,
    UpdateService<UpdateBlogDto>
{
  constructor(
    private prismaService: PrismaService,
    private apiService: ApiService,
    private tagService: TagService
  ) {}

  private updateBlog({ blog_id, ...dataUpdate }: UpdateBlogDto) {
    return this.prismaService.blog.update({
      data: dataUpdate,
      where: {
        blog_id,
      },
    });
  }
  async update({ blog_id, tag_ids, ...dataUpdate }: UpdateBlogDto) {
    const blogData = await this.updateBlog({ blog_id, ...dataUpdate });
    await this.tagService.updateBlog({ blog_id, tag_ids });
    return blogData;
  }
  remove(ids: string[]) {
    return this.prismaService.blog.deleteMany({
      where: {
        blog_id: {
          in: ids,
        },
      },
    });
  }
  async getDetail(id: string, blogConditions?: Partial<Blog>) {
    const blogData = await this.prismaService.blog.findUnique({
      where: { blog_id: id, ...blogConditions },
      select: {
        blog_id: true,
        blog_title: true,
        blog_description: true,
        blog_content: true,
        blog_thumbnail: true,
        blog_reading_time: true,
        blog_is_publish: true,
        BlogTag: {
          select: {
            Tag: {
              select: {
                tag_id: true,
                tag_name: true,
              },
            },
          },
        },
      },
    });
    if (!blogData) throw new BadRequestException('Blog not found');
    const { BlogTag = [], ...blogDetail } = blogData;
    return { ...blogDetail, Tag: BlogTag.map((item) => item.Tag) };
  }

  getDetailForUser(id: string) {
    return this.getDetail(id, { blog_is_publish: true });
  }

  getList(getBlogListByPaginationDto: GetBlogListByPaginationDto) {
    if (!getBlogListByPaginationDto.page) return this.getAll();
    return this.getListByPagination(getBlogListByPaginationDto);
  }

  getListForUser(getBlogListByPaginationDto: GetBlogListByPaginationDto) {
    if (!getBlogListByPaginationDto.page) return this.getAll();
    return this.getListByPaginationForUser(getBlogListByPaginationDto);
  }
  getAll() {
    return this.prismaService.blog.findMany({
      select: {
        blog_id: true,
        blog_title: true,
        blog_description: true,
      },
    });
  }

  async getListByPagination({
    page,
    itemPerPage,
    search = '',
  }: GetBlogListByPaginationDto) {
    console.log('>>> search', search);
    const skip = (page - 1) * itemPerPage;
    const list = await this.prismaService.blog.findMany({
      select: {
        blog_id: true,
        blog_title: true,
        blog_description: true,
        blog_is_publish: true,
      },
      skip,
      take: itemPerPage,
      orderBy: {
        blog_id: 'desc',
      },
      where: {
        OR: [
          {
            BlogTag: {
              some: {
                Tag: {
                  tag_name: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
              },
            },
          },
          {
            blog_title: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            blog_description: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            blog_content: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      },
    });

    return this.apiService.formatPagination<typeof list>({
      list,
      totalItems: await this.prismaService.blog.count(),
      page,
      itemPerPage,
    });
  }

  async getListByPaginationForUser({
    page,
    itemPerPage,
    search = '',
  }: GetBlogListByPaginationDto) {
    const skip = (page - 1) * itemPerPage;
    const list = await this.prismaService.blog.findMany({
      select: {
        blog_id: true,
        blog_title: true,
        blog_description: true,
        blog_view: true,
        created_at: true,
        blog_thumbnail: true,
        blog_reading_time: true,
      },
      skip,
      take: itemPerPage,
      orderBy: {
        blog_id: 'desc',
      },
      where: {
        blog_is_publish: true,
        OR: [
          {
            BlogTag: {
              some: {
                Tag: {
                  tag_name: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
              },
            },
          },
          {
            blog_title: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            blog_description: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            blog_content: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      },
    });
    const listData = list.map((item) => ({
      ...item,
      created_at: item.created_at.toLocaleDateString('en-GB'),
    }));
    return this.apiService.formatPagination<typeof listData>({
      list: listData,
      totalItems: await this.prismaService.blog.count(),
      page,
      itemPerPage,
    });
  }
  async create({ tag_ids, ...dataCreate }: CreateBlogDto) {
    const blogData = await this.prismaService.blog.create({
      data: {
        ...dataCreate,
      },
    });

    await this.tagService.updateBlog({ blog_id: blogData.blog_id, tag_ids });

    return blogData;
  }

  async updateBlogTrackingInfo({
    blog_id,
    ...dataUpdate
  }: UpdateBlogTrackingInfoDto) {
    return await this.prismaService.blog.update({
      data: {
        blog_view: {
          increment: 1,
        },
        ...dataUpdate,
      },
      where: {
        blog_id,
      },
    });
  }

  updatePublishBlogStatus(
    updatePublishBlogStatusDto: UpdatePublishBlogStatusDto
  ) {
    return this.updateBlog(updatePublishBlogStatusDto);
  }
}
