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
  UpdateBlogDto,
  UpdateBlogTrackingInfoDto,
} from './dto/update-blog.dto';
import { TagService } from '../tag/tag.service';
@Injectable()
export class BlogService
  implements
    CreateService<CreateBlogDto>,
    GetAllService,
    GetDetailService,
    DeleteService,
    UpdateService<UpdateBlogDto>
{
  private readonly TRENDING_THRESHOLD = 10; // Lượng view cần để trở thành `hot post`
  constructor(
    private prismaService: PrismaService,
    private apiService: ApiService,
    private tagService: TagService
  ) {}
  async update({ blog_id, tag_ids, ...dataUpdate }: UpdateBlogDto) {
    const blogData = await this.prismaService.blog.update({
      data: dataUpdate,
      where: {
        blog_id,
      },
    });

    await this.tagService.updateBlog({ blog_id, tag_ids });

    return blogData;
  }
  remove(ids: number[]) {
    return this.prismaService.blog.deleteMany({
      where: {
        blog_id: {
          in: ids,
        },
      },
    });
  }
  async getDetail(id: number) {
    const blogData = await this.prismaService.blog.findUnique({
      where: { blog_id: id },
      select: {
        blog_id: true,
        blog_title: true,
        blog_description: true,
        blog_content: true,
        Tag: {
          select: {
            tag_id: true,
            tag_name: true,
          },
        },
      },
    });
    if (!blogData) throw new BadRequestException('Blog not found');
    return blogData;
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

  async getListByPagination({ page, itemPerPage }: GetBlogListByPaginationDto) {
    const skip = (page - 1) * itemPerPage;
    const list = await this.prismaService.blog.findMany({
      select: {
        blog_id: true,
        blog_title: true,
        blog_description: true,
      },
      skip,
      take: itemPerPage,
      orderBy: {
        blog_id: 'desc',
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
      },
      skip,
      take: itemPerPage,
      orderBy: {
        blog_id: 'desc',
      },
      where: {
        OR: [
          {
            Tag: {
              some: {
                tag_name: {
                  contains: search,
                  mode: 'insensitive',
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
      list: list.map((item) => ({
        ...item,
        blog_is_trending: item.blog_view >= this.TRENDING_THRESHOLD,
      })),
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
}
