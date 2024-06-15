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
  remove(ids: number[]) {
    return this.prismaService.tag.deleteMany({
      where: {
        tag_id: {
          in: ids,
        },
      },
    });
  }
  async getDetail(id: number) {
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

  async getListByPagination({ page, itemPerPage }: GetTagListByPaginationDto) {
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

  private async removeBlogExist(blog_id: number) {
    return this.prismaService.tag.updateMany({
      data: {
        blog_id: null,
      },
      where: {
        blog_id,
      },
    });
  }

  async updateBlog({ blog_id, tag_ids }: UpdateBlogDto) {
    await this.removeBlogExist(blog_id);
    return this.prismaService.tag.updateMany({
      data: {
        blog_id,
      },
      where: {
        tag_id: {
          in: tag_ids,
        },
      },
    });
  }
}
