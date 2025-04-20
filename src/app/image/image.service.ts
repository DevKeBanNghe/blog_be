import { Injectable } from '@nestjs/common';
import {
  DeleteService,
  GetAllService,
} from 'src/common/interfaces/service.interface';
import { CreateImageDto } from './dto/create-image.dto';
import { PrismaService } from 'src/common/db/prisma/prisma.service';
import {
  ExportImagesDto,
  GetImageListByPaginationDto,
} from './dto/get-image.dto';
import { ApiService } from 'src/common/utils/api/api.service';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { CloudinaryEnvs } from 'src/consts';
import { FileUtilService } from 'src/common/utils/file/file-util.service';
import { resolve } from 'path';
import { BaseInstance } from 'src/common/classes/base.class';
import { isEmpty } from 'lodash';
import { ExcelUtilService } from 'src/common/utils/excel/excel-util.service';
import { QueryUtilService } from 'src/common/utils/query/query-util.service';
import { UpdateActivateStatusDto } from './dto/update-tag.dto';

@Injectable()
export class ImageService
  implements BaseInstance, GetAllService, DeleteService
{
  private excelSheets = {
    Images: 'Images',
  };
  constructor(
    private prismaService: PrismaService,
    private apiService: ApiService,
    private configService: ConfigService,
    private fileUtilService: FileUtilService,
    private excelUtilService: ExcelUtilService,
    private queryUtil: QueryUtilService
  ) {}
  get instance() {
    return this.prismaService.image;
  }
  get extended() {
    return this.prismaService.clientExtended.image;
  }

  remove(ids: string[]) {
    return this.prismaService.image.deleteMany({
      where: {
        image_id: {
          in: ids,
        },
      },
    });
  }

  getList(getImageListByPaginationDto: GetImageListByPaginationDto) {
    if (!getImageListByPaginationDto.page) return this.getAll();
    return this.getListByPagination(getImageListByPaginationDto);
  }
  getAll() {
    return this.prismaService.image.findMany({
      select: {
        image_id: true,
        image_name: true,
        image_url: true,
      },
    });
  }

  async getListByPagination({
    page,
    itemPerPage,
    search = '',
  }: GetImageListByPaginationDto) {
    const imageFieldsSelect = {
      image_id: true,
      image_name: true,
      image_url: true,
      image_description: true,
    };
    const imageSearchQuery = this.queryUtil.buildSearchQuery({
      keys: imageFieldsSelect,
      value: search,
    });

    const skip = (page - 1) * itemPerPage;
    const list = await this.extended.findMany({
      select: imageFieldsSelect,
      skip,
      take: itemPerPage,
      where: {
        OR: imageSearchQuery,
      },
    });

    return this.apiService.formatPagination<typeof list>({
      list,
      totalItems: await this.extended.count(),
      page,
      itemPerPage,
    });
  }

  async upload(files = []) {
    cloudinary.config({
      cloud_name: this.configService.get(CloudinaryEnvs.CLOUDINARY_NAME),
      api_key: this.configService.get(CloudinaryEnvs.CLOUDINARY_API_KEY),
      api_secret: this.configService.get(CloudinaryEnvs.CLOUDINARY_API_SECRET),
    });

    const imagesData: CreateImageDto[] = [];
    for (const file of files) {
      const { secure_url, display_name, created_at } =
        await cloudinary.uploader.upload(resolve(__dirname, '..', file.path), {
          public_id: this.fileUtilService.removeFileExtension(
            file.originalname
          ),
        });

      imagesData.push({
        image_name: display_name,
        image_url: secure_url,
        created_at: new Date(created_at),
      });
    }

    return this.prismaService.image.createMany({
      data: imagesData,
    });
  }

  private async getImagesExport({ ids }) {
    if (isEmpty(ids)) return await this.getAll();
    return await this.extended.findMany({
      select: {
        image_name: true,
        image_url: true,
      },
      where: {
        image_id: { in: ids },
      },
    });
  }

  async exportImages({ ids }: ExportImagesDto) {
    const data = await this.getImagesExport({ ids });
    const dataBuffer = await this.excelUtilService.generateExcel({
      worksheets: [
        {
          sheetName: this.excelSheets.Images,
          data,
        },
      ],
    });

    return dataBuffer;
  }

  updateActivateStatus({ image_ids, ...dataUpdate }: UpdateActivateStatusDto) {
    return this.extended.updateMany({
      data: dataUpdate,
      where: {
        image_id: {
          in: image_ids,
        },
      },
    });
  }
}
