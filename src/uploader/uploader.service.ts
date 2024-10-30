import { Injectable, Inject } from '@nestjs/common';
import { Logger } from 'winston';
import { extension } from 'mime-types';
import * as p from 'path';
import { UPLOADER } from '@src/constants';
import { Uploader } from './uploader.interface';
import { FileUploadDTO } from './dto';
import { UploadedResource } from './interfaces';

@Injectable()
export class UploadService {
  constructor(@Inject(UPLOADER) private uploader: Uploader) {}

  getExtensionFromInput(input: FileUploadDTO): string {
    return extension(input.mime) || p.extname(input.filename);
  }

  async uploadCV(
    organizationName: string,
    jobID: string,
    input: FileUploadDTO,
    logger: Logger,
  ): Promise<UploadedResource> {
    logger.info(`uploading ${input.filename} using ${this.uploader.name()}`);

    const extension = this.getExtensionFromInput(input);
    const currentTimestamp = new Date().getTime();
    const filename = `${encodeURI(
      p.parse(input.filename).name,
    )}-${currentTimestamp}.${extension}`;
    logger.debug(`uploading with filename: ${filename}`);

    const path = `resumes/${organizationName}/${jobID}/${filename}`;
    const url = await this.uploader.upload(path, input.data, input);
    return {
      url,
      filename,
      mime: input.mime,
      size: input.size,
    };
  }

  async uploadOfferDocument(
    jobID: string,
    input: FileUploadDTO,
    logger: Logger,
    isUpdate = false,
  ): Promise<UploadedResource> {
    logger.info(`uploading ${input.filename} using ${this.uploader.name()}`);

    const extension = this.getExtensionFromInput(input);
    const currentTimestamp = new Date().getTime();
    const filename = isUpdate
      ? p.parse(input.filename).name
      : `${encodeURI(input.filename)}-${currentTimestamp}.${extension}`;

    const path = `offers/${jobID}/${filename}`;
    const url = await this.uploader.upload(path, input.data, input);
    logger.info(`done uploading file ${url}`);

    return {
      url,
      filename,
      mime: input.mime,
      size: input.size,
    };
  }
}
