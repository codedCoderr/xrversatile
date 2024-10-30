import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lowerCase } from 'lodash';
import * as moment from 'moment';
import * as base4hHelper from 'base64-arraybuffer';
import * as AWS from 'aws-sdk';
import * as html2pdf from 'html-pdf';

import { PDF_GENERATOR } from '@src/constants';
import { Logger } from 'winston';
import {
  ClientSession,
  Document,
  UpdateQuery,
  FilterQuery,
  Model,
} from 'mongoose';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { FileUploadDTO } from '@src/uploader/dto';
import { UploadService } from '@src/uploader/uploader.service';
import { HttpService } from '@nestjs/axios';
import { RangeEnums } from '@src/account/dtos';
import configuration from '@src/config/env/configuration';

import { Base64 } from 'aws-sdk/clients/ecr';
import { Stream } from 'stream';
import { CKEditorCSS } from './css/ckeditor_css';

@Injectable()
export class UtilService {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
    private uploadService: UploadService,
    @Inject(PDF_GENERATOR) private a2pClient: unknown,
    private jwtService: JwtService,
  ) {}

  isDev(): boolean {
    const env = this.configService.get<string>('NODE_ENV');
    const envs = ['development', 'test', 'localhost', 'local'];
    return !env || envs.includes(env);
  }

  generateRandom(length: number, chars?: string, isOTP?: boolean): string {
    let dict = chars;
    if (!chars) {
      dict = '0123456789';
      if (!isOTP) {
        dict += 'ABCDEFGHJKLMNOPQRSTUVWXYZ';
      }
    }

    let result = '';
    for (let i = length; i > 0; i -= 1) {
      result += dict[Math.round(Math.random() * (dict.length - 1))];
    }
    return result;
  }

  async convertFileUploadCVToPdf(
    organizationName: string,
    jobID: string,
    file: FileUploadDTO,
    logger: Logger,
  ): Promise<FileUploadDTO> {
    if (file.mime.includes('pdf')) return file;

    const filename = `${this.generateRandom(12)}.pdf`;

    const uploaded = await this.uploadService.uploadCV(
      organizationName,
      jobID,
      file,
      logger,
    );

    const convertedFile = await this.convertFileToPdf(uploaded, filename);
    const { pdf } = convertedFile;
    const buffer = await new Promise<Buffer>((resolve, reject) => {
      this.httpService
        .get<ArrayBuffer>(pdf, {
          responseType: 'arraybuffer',
        })
        .toPromise()
        .then((resp) => {
          resolve(Buffer.from(resp.data));
        })
        .catch((e) => reject(e));
    });

    return {
      ...file,
      data: base4hHelper.encode(buffer),
      filename,
      mime: 'application/pdf',
    };
  }

  async convertHtmlContentToPdf(content: string): Promise<Stream> {
    const htmlString = `
      <html>
      <head>
       <style>
      ${CKEditorCSS}
  </style>
      </head>
      <body>
      <div class="ck-content">
      ${content}
      </div>
      </body>
      </html>
      `;

    return new Promise<Stream>((resolve, reject) => {
      html2pdf
        .create(htmlString, {
          format: 'A4',
          orientation: 'portrait',
        })
        .toStream((error, stream) => {
          if (error) {
            reject(error);
          }

          resolve(stream);
        });
    });
  }

  async streamToBase64(pdfStream: Stream): Promise<string> {
    const chunks = [];
    return new Promise((resolve, reject) => {
      pdfStream.on('data', (chunk) => chunks.push(chunk));
      pdfStream.on('end', () => resolve(Buffer.concat(chunks)));
      pdfStream.on('error', (error) => reject(error));
    }).then((buffer) => Buffer.from(buffer as any).toString('base64'));
  }

  async convertFileToPdf(file: FileUploadDTO, filename: string): Promise<any> {
    return (this.a2pClient as any).libreofficeConvert(
      file.url.startsWith('https://') || file.url.startsWith('http://')
        ? file.url
        : `https://${file.url}`,
      true,
      filename,
    );
  }

  getRangeToTimeline(
    range?: RangeEnums,
    sDate?: Date,
    eDate?: Date,
  ): { startDate: Date; endDate: Date } {
    let startDate: Date;
    let endDate: Date;
    switch (range) {
      case RangeEnums.Day: {
        startDate = moment().startOf('day').toDate();
        endDate = moment(startDate).endOf('day').toDate();
        break;
      }
      case RangeEnums.Week: {
        startDate = moment().startOf('isoWeek').toDate();
        endDate = moment(startDate).endOf('isoWeek').toDate();
        break;
      }
      case RangeEnums.Month: {
        startDate = moment().startOf('month').toDate();
        endDate = moment(startDate).endOf('month').toDate();
        break;
      }
      case RangeEnums.ThreeMonth: {
        startDate = moment().startOf('month').toDate();
        endDate = moment(startDate).subtract(3, 'M').endOf('month').toDate();
        break;
      }
      case RangeEnums.Year: {
        startDate = moment().startOf('year').toDate();
        endDate = moment(startDate).endOf('year').toDate();
        break;
      }
      case RangeEnums.LastYear: {
        startDate = moment().subtract(1, 'year').startOf('year').toDate();
        endDate = moment(startDate).endOf('year').toDate();
        break;
      }
      case RangeEnums.All: {
        startDate = moment('1970-01-01').startOf('year').toDate();
        endDate = moment().endOf('year').toDate();
        break;
      }
      case RangeEnums.FirstQuater: {
        startDate = moment().startOf('year').toDate();
        endDate = moment().quarter(1).toDate();
        break;
      }
      case RangeEnums.SecondQuater: {
        startDate = moment().quarter(1).toDate();
        endDate = moment().quarter(2).toDate();
        break;
      }
      case RangeEnums.ThirdQuater: {
        startDate = moment().quarter(2).toDate();
        endDate = moment().quarter(3).toDate();
        break;
      }
      case RangeEnums.FourthQuater: {
        startDate = moment().quarter(3).toDate();
        endDate = moment().quarter(4).toDate();
        break;
      }
      case RangeEnums.Custom: {
        startDate = moment(sDate).toDate();
        endDate = moment(eDate).toDate();
        break;
      }
      default:
        throw new Error('invalid range selected');
    }
    return { startDate, endDate };
  }

  async findOneOrCreate<T extends Document>(
    model: Model<T>,
    criteria: FilterQuery<T>,
    data: UpdateQuery<T>,
    session?: ClientSession,
  ): Promise<T> {
    let item = await model.findOne(criteria, null, session && { session });

    if (!item) {
      [item] = await model.create([data], session && { session });
    }

    return item;
  }

  getTime(dateTime: moment.Moment): moment.Moment {
    return moment({ h: dateTime.hours(), m: dateTime.minutes() });
  }

  static ucfirst(values: string): string {
    if (!values) return '';

    return lowerCase(values.toString())
      .split(' ')
      .map((value: string) => value.charAt(0).toUpperCase() + value.slice(1))
      .join(' ');
  }

  static unslug(slug: string): string {
    const words = slug.split('-');

    return words
      .map(
        (word) =>
          word.charAt(0).toUpperCase() + word.substring(1).toLowerCase(),
      )
      .join(' ');
  }

  signToJwtToken(
    params: string | Record<string, unknown> | Buffer,
    opts?: JwtSignOptions,
  ): string {
    return this.jwtService.sign(params as string, opts);
  }

  verifyJwtToken(token: string): any {
    return this.jwtService.verify(token);
  }

  trimAndLowerCase(value: string): string {
    return value ? value.trim().toLowerCase() : '';
  }

  validateDateTime(datetime: string): boolean {
    return moment(datetime).isValid();
  }

  static generateRandomString(
    length: number,
    chars?: string,
    isOTP?: boolean,
  ): string {
    let dict = chars;
    if (!chars) {
      dict = '0123456789';
      if (!isOTP) {
        dict += 'ABCDEFGHJKLMNOPQRSTUVWXYZ';
      }
    }

    let result = '';
    for (let i = length; i > 0; i -= 1) {
      result += dict[Math.round(Math.random() * (dict.length - 1))];
    }
    return result;
  }

  roundTo2Figs(num: number): number {
    return Math.round(num * 100) / 100;
  }

  generateUniqueEmail(): string {
    const domain = 'gmail.com';
    const username = this.generateRandom(10);
    const email = `${username}+random@${domain}`;
    return email;
  }

  generateUniquePhoneNumber(countryCode: string): string {
    const localNumber = this.generateRandom(10, undefined, true);
    const phoneNumber = `${countryCode}${localNumber}`;
    return phoneNumber;
  }

  getFileExtension(mimeType: string) {
    switch (mimeType) {
      case 'image/jpeg':
        return '.jpg';
      case 'image/png':
        return '.png';
      case 'application/pdf':
        return '.pdf';
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        return '.xlsx';
      case 'text/csv':
        return '.csv';
      default:
        return mimeType;
    }
  }

  async uploadFile(mime: string, base64: Base64, folder = '', filename = '') {
    const size = ((base64.length / 4) * 3) / 1000000;
    if (size > 3) {
      throw new BadRequestException('File too large');
    }
    const { s3 } = configuration();
    const name = `${folder}${filename?.split('.')[0]}_${Math.random()
      .toString(36)
      .substring(2, 8)}${this.getFileExtension(mime)}`;
    const s3client = new AWS.S3({
      credentials: {
        accessKeyId: s3.accessKeyId,
        secretAccessKey: s3.secretAccessKey,
      },
    });
    const params = {
      Bucket: s3.bucket,
      Body: Buffer.from(base64, 'base64'),
      Key: name,
      ContentType: mime,
      ContentEncoding: 'base64',
    };

    return new Promise<AWS.S3.ManagedUpload.SendData>((resolve, reject) => {
      s3client.upload(params, (err, data: AWS.S3.ManagedUpload.SendData) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(data);
      });
    });
  }
}
