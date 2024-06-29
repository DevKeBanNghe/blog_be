import { Injectable } from '@nestjs/common';
import {
  DeleteService,
  GetAllService,
} from 'src/common/interfaces/service.interface';
import { CreateImageDto } from './dto/create-image.dto';
import { PrismaService } from 'src/common/db/prisma/prisma.service';
import { GetImageListByPaginationDto } from './dto/get-image.dto';
import { ApiService } from 'src/common/utils/api/api.service';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { CloudinaryEnvs } from 'src/consts';
import { FileUtilService } from 'src/common/utils/file/file-util.service';
import { resolve } from 'path';

@Injectable()
export class ImageService implements GetAllService, DeleteService {
  constructor(
    private prismaService: PrismaService,
    private apiService: ApiService,
    private configService: ConfigService,
    private fileUtilService: FileUtilService
  ) {}

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
      },
    });
  }

  async getListByPagination({
    page,
    itemPerPage,
  }: GetImageListByPaginationDto) {
    const skip = (page - 1) * itemPerPage;
    const list = await this.prismaService.image.findMany({
      select: {
        image_id: true,
        image_url: true,
        image_name: true,
        image_description: true,
      },
      skip,
      take: itemPerPage,
      orderBy: {
        image_id: 'desc',
      },
    });

    return this.apiService.formatPagination<typeof list>({
      list,
      totalItems: await this.prismaService.image.count(),
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
}
