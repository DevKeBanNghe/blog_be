import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CreateService,
  DeleteService,
  GetAllService,
  GetDetailService,
  UpdateService,
} from 'src/common/interfaces/service.interface';
import {
  CreateBlogDto,
  ImportBlogsDto,
  SubscribeToBlogsDto,
} from './dto/create-blog.dto';
import { PrismaService } from 'src/common/db/prisma/prisma.service';
import { ExportBlogsDto, GetBlogListByPaginationDto } from './dto/get-blog.dto';
import { ApiService } from 'src/common/utils/api/api.service';
import {
  UpdatePublishBlogStatusDto,
  UpdateBlogDto,
  UpdateBlogTrackingInfoDto,
  UpdateActivateStatusDto,
} from './dto/update-blog.dto';
import { TagService } from '../tag/tag.service';
import { SSOService } from 'src/common/utils/api/sso/sso.service';
import { Blog } from '@prisma-postgresql/models';
import { BaseInstance } from 'src/common/classes/base.class';
import { isEmpty, isEqual, omit, uniqWith } from 'lodash';
import { ExcelUtilService } from 'src/common/utils/excel/excel-util.service';
import { QueryUtilService } from 'src/common/utils/query/query-util.service';
@Injectable()
export class BlogService
  implements
    BaseInstance,
    CreateService<CreateBlogDto>,
    GetAllService,
    GetDetailService,
    DeleteService,
    UpdateService<UpdateBlogDto>
{
  private excelSheets = {
    Blogs: 'Blogs',
  };
  constructor(
    private prismaService: PrismaService,
    private apiService: ApiService,
    private tagService: TagService,
    private ssoService: SSOService,
    private excelUtilService: ExcelUtilService,
    private queryUtil: QueryUtilService
  ) {}

  get instance() {
    return this.prismaService.blog;
  }

  get extended() {
    return this.prismaService.clientExtended.blog;
  }

  private updateBlog({ blog_id, ...dataUpdate }: UpdateBlogDto) {
    return this.extended.update({
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
  async getDetail(id: string, blogConditions?: Partial<Omit<Blog, 'tags'>>) {
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
        tags: {
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
    const { tags = [], ...blogDetail } = blogData;
    return { ...blogDetail, Tag: tags.map((item) => item.Tag) };
  }

  getDetailForUser(id: string) {
    return this.getDetail(id, { blog_is_publish: 1 });
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
    const blogFieldsSelect = {
      blog_id: true,
      blog_title: true,
      blog_description: true,
      blog_content: true,
    };
    const blogSearchQuery = this.queryUtil.buildSearchQuery({
      keys: blogFieldsSelect,
      value: search,
    });

    const skip = (page - 1) * itemPerPage;
    const list = await this.extended.findMany({
      select: {
        blog_id: true,
        blog_title: true,
        blog_description: true,
        blog_is_publish: true,
      },
      skip,
      take: itemPerPage,
      where: {
        OR: [
          {
            tags: {
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
          ...blogSearchQuery,
        ],
      },
    });

    return this.apiService.formatPagination<typeof list>({
      list,
      totalItems: await this.extended.count(),
      page,
      itemPerPage,
    });
  }

  async getListByPaginationForUser({
    page,
    itemPerPage,
    search = '',
  }: GetBlogListByPaginationDto) {
    const blogFieldsSelect = {
      blog_id: true,
      blog_title: true,
      blog_description: true,
      blog_content: true,
    };
    const blogSearchQuery = this.queryUtil.buildSearchQuery({
      keys: blogFieldsSelect,
      value: search,
    });

    const skip = (page - 1) * itemPerPage;
    const list = await this.extended.findMany({
      select: {
        blog_view: true,
        blog_thumbnail: true,
        blog_reading_time: true,
        ...omit(blogFieldsSelect, ['blog_content']),
      },
      skip,
      take: itemPerPage,
      where: {
        blog_is_publish: 1,
        OR: [
          {
            tags: {
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
          ...blogSearchQuery,
        ],
      },
    });
    return this.apiService.formatPagination<typeof list>({
      list,
      totalItems: await this.extended.count(),
      page,
      itemPerPage,
    });
  }

  async create({ tag_ids, ...dataCreate }: CreateBlogDto) {
    const blogData = await this.extended.create({
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

  async subscribeToBlogs({ user_email }: SubscribeToBlogsDto) {
    const {
      data: { data, errors },
    } = await this.ssoService.subscribeUser({
      user_email,
    });
    if (errors) throw new BadRequestException(errors);
    return data;
  }

  private async getBlogsExport({ ids }) {
    if (isEmpty(ids)) return await this.getAll();
    return await this.extended.findMany({
      select: {
        blog_title: true,
        blog_content: true,
      },
      where: {
        blog_id: { in: ids },
      },
    });
  }

  async exportBlogs({ ids }: ExportBlogsDto) {
    const data = await this.getBlogsExport({ ids });
    const dataBuffer = await this.excelUtilService.generateExcel({
      worksheets: [
        {
          sheetName: this.excelSheets.Blogs,
          data,
        },
      ],
    });

    return dataBuffer;
  }

  async importBlogs({ file, user }: ImportBlogsDto) {
    const dataCreated = await this.excelUtilService.read({ file });
    if (isEmpty(dataCreated))
      throw new BadRequestException('Import Blogs failed!');
    const data = await this.extended.createMany({
      data: uniqWith<Blog>(dataCreated[this.excelSheets.Blogs], isEqual).map(
        (item) => ({
          ...item,
          user,
        })
      ),
    });
    return data;
  }

  updateActivateStatus({ blog_ids, ...dataUpdate }: UpdateActivateStatusDto) {
    return this.extended.updateMany({
      data: dataUpdate,
      where: {
        blog_id: {
          in: blog_ids,
        },
      },
    });
  }
}
