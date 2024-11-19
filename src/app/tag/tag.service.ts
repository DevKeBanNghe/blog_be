import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CreateService,
  DeleteService,
  GetAllService,
  GetDetailService,
  GetOptionsService,
  UpdateService,
} from 'src/common/interfaces/service.interface';
import { CreateTagDto } from './dto/create-tag.dto';
import { PrismaService } from 'src/common/db/prisma/prisma.service';
import { GetTagListByPaginationDto, GetTagOptionsDto } from './dto/get-tag.dto';
import { ApiService } from 'src/common/utils/api/api.service';
import { UpdateBlogDto, UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagService
  implements
    CreateService<CreateTagDto>,
    GetAllService,
    GetDetailService,
    DeleteService,
    UpdateService<UpdateTagDto>,
    GetOptionsService<GetTagOptionsDto>
{
  constructor(
    private prismaService: PrismaService,
    private apiService: ApiService
  ) {}
  getOptions(getOptionsDto?: GetTagOptionsDto) {
    return this.prismaService.tag.findMany({
      select: {
        tag_id: true,
        tag_name: true,
      },
      where: {
        tag_name: {
          contains: getOptionsDto.tag_name,
          mode: 'insensitive',
        },
      },
      take: getOptionsDto.limit,
    });
  }
  update({ tag_id, ...dataUpdate }: UpdateTagDto) {
    return this.prismaService.tag.update({
      data: dataUpdate,
      where: {
        tag_id,
      },
    });
  }
  remove(ids: string[]) {
    return this.prismaService.tag.deleteMany({
      where: {
        tag_id: {
          in: ids,
        },
      },
    });
  }
  async getDetail(id: string) {
    const tag = await this.prismaService.tag.findUnique({
      where: { tag_id: id },
      select: {
        tag_id: true,
        tag_name: true,
        tag_description: true,
      },
    });
    if (!tag) throw new BadRequestException('Tag not found');
    return tag;
  }

  getList(getTagListByPaginationDto: GetTagListByPaginationDto) {
    if (!getTagListByPaginationDto.page) return this.getAll();
    return this.getListByPagination(getTagListByPaginationDto);
  }
  getAll() {
    return this.prismaService.tag.findMany({
      select: {
        tag_id: true,
        tag_name: true,
      },
    });
  }

  async getListByPagination({
    page,
    itemPerPage,
    search = '',
  }: GetTagListByPaginationDto) {
    const skip = (page - 1) * itemPerPage;
    const list = await this.prismaService.tag.findMany({
      select: {
        tag_id: true,
        tag_name: true,
        tag_description: true,
      },
      skip,
      take: itemPerPage,
      orderBy: {
        tag_id: 'desc',
      },
      where: {
        OR: [
          {
            tag_name: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            tag_description: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      },
    });

    return this.apiService.formatPagination<typeof list>({
      list,
      totalItems: await this.prismaService.tag.count(),
      page,
      itemPerPage,
    });
  }
  create(createDto: CreateTagDto) {
    return this.prismaService.tag.create({
      data: {
        ...createDto,
      },
    });
  }

  async updateBlog({ blog_id, tag_ids = [] }: UpdateBlogDto) {
    await this.prismaService.blogTag.deleteMany({
      where: { blog_id, tag_id: { notIn: tag_ids } },
    });
    for (const tag_id of tag_ids) {
      await this.prismaService.blogTag.upsert({
        create: {
          blog_id,
          tag_id,
        },
        update: {
          blog_id,
          tag_id,
        },
        where: {
          blog_id_tag_id: {
            blog_id,
            tag_id,
          },
        },
      });
    }

    return {};
  }
}
