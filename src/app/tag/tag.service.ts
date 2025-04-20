import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CreateService,
  DeleteService,
  GetAllService,
  GetDetailService,
  GetOptionsService,
  UpdateService,
} from 'src/common/interfaces/service.interface';
import { CreateTagDto, ImportTagsDto } from './dto/create-tag.dto';
import { PrismaService } from 'src/common/db/prisma/prisma.service';
import {
  ExportTagsDto,
  GetTagListByPaginationDto,
  GetTagOptionsDto,
} from './dto/get-tag.dto';
import { ApiService } from 'src/common/utils/api/api.service';
import {
  UpdateActivateStatusDto,
  UpdateBlogDto,
  UpdateTagDto,
} from './dto/update-tag.dto';
import { BaseInstance } from 'src/common/classes/base.class';
import { isEmpty, isEqual, uniqWith } from 'lodash';
import { ExcelUtilService } from 'src/common/utils/excel/excel-util.service';
import { Tag } from '@prisma-postgresql/models';
import { QueryUtilService } from 'src/common/utils/query/query-util.service';

@Injectable()
export class TagService
  implements
    BaseInstance,
    CreateService<CreateTagDto>,
    GetAllService,
    GetDetailService,
    DeleteService,
    UpdateService<UpdateTagDto>,
    GetOptionsService<GetTagOptionsDto>
{
  private excelSheets = {
    Tags: 'Tags',
  };
  constructor(
    private prismaService: PrismaService,
    private apiService: ApiService,
    private excelUtilService: ExcelUtilService,
    private queryUtil: QueryUtilService
  ) {}
  get instance() {
    return this.prismaService.tag;
  }
  get extended() {
    return this.prismaService.clientExtended.tag;
  }
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
    return this.extended.update({
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
    const tagFieldsSelect = {
      tag_id: true,
      tag_name: true,
      tag_description: true,
    };
    const tagSearchQuery = this.queryUtil.buildSearchQuery({
      keys: tagFieldsSelect,
      value: search,
    });

    const skip = (page - 1) * itemPerPage;
    const list = await this.extended.findMany({
      select: tagFieldsSelect,
      skip,
      take: itemPerPage,
      where: {
        OR: tagSearchQuery,
      },
    });

    return this.apiService.formatPagination<typeof list>({
      list,
      totalItems: await this.extended.count(),
      page,
      itemPerPage,
    });
  }
  create(createDto: CreateTagDto) {
    return this.extended.create({
      data: {
        ...createDto,
      },
    });
  }

  async updateBlog({ blog_id, tag_ids = [] }: UpdateBlogDto) {
    await this.prismaService.clientExtended.blogTag.deleteMany({
      where: { blog_id, tag_id: { notIn: tag_ids } },
    });
    for (const tag_id of tag_ids) {
      await this.prismaService.clientExtended.blogTag.upsert({
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

  private async getTagsExport({ ids }) {
    if (isEmpty(ids)) return await this.getAll();
    return await this.extended.findMany({
      select: {
        tag_name: true,
      },
      where: {
        tag_id: { in: ids },
      },
    });
  }

  async exportTags({ ids }: ExportTagsDto) {
    const data = await this.getTagsExport({ ids });
    const dataBuffer = await this.excelUtilService.generateExcel({
      worksheets: [
        {
          sheetName: this.excelSheets.Tags,
          data,
        },
      ],
    });

    return dataBuffer;
  }

  async importTags({ file, user }: ImportTagsDto) {
    const dataCreated = await this.excelUtilService.read({ file });
    if (isEmpty(dataCreated))
      throw new BadRequestException('Import Tags failed!');
    const data = await this.extended.createMany({
      data: uniqWith<Tag>(dataCreated[this.excelSheets.Tags], isEqual).map(
        (item) => ({
          ...item,
          user,
        })
      ),
    });
    return data;
  }

  updateActivateStatus({ tag_ids, ...dataUpdate }: UpdateActivateStatusDto) {
    return this.extended.updateMany({
      data: dataUpdate,
      where: {
        tag_id: {
          in: tag_ids,
        },
      },
    });
  }
}
