import { ConfigService } from '@nestjs/config';
import * as moment from 'moment';
import * as AWS from 'aws-sdk';
import { Logger } from 'winston';
import { ClientSession, Document, UpdateQuery, FilterQuery, Model } from 'mongoose';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { FileUploadDTO } from '@src/uploader/dto';
import { UploadService } from '@src/uploader/uploader.service';
import { HttpService } from '@nestjs/axios';
import { RangeEnums } from '@src/account/dtos';
import { Base64 } from 'aws-sdk/clients/ecr';
import { Stream } from 'stream';
export declare class UtilService {
    private configService;
    private httpService;
    private uploadService;
    private a2pClient;
    private jwtService;
    constructor(configService: ConfigService, httpService: HttpService, uploadService: UploadService, a2pClient: unknown, jwtService: JwtService);
    isDev(): boolean;
    generateRandom(length: number, chars?: string, isOTP?: boolean): string;
    convertFileUploadCVToPdf(organizationName: string, jobID: string, file: FileUploadDTO, logger: Logger): Promise<FileUploadDTO>;
    convertHtmlContentToPdf(content: string): Promise<Stream>;
    streamToBase64(pdfStream: Stream): Promise<string>;
    convertFileToPdf(file: FileUploadDTO, filename: string): Promise<any>;
    getRangeToTimeline(range?: RangeEnums, sDate?: Date, eDate?: Date): {
        startDate: Date;
        endDate: Date;
    };
    findOneOrCreate<T extends Document>(model: Model<T>, criteria: FilterQuery<T>, data: UpdateQuery<T>, session?: ClientSession): Promise<T>;
    getTime(dateTime: moment.Moment): moment.Moment;
    static ucfirst(values: string): string;
    static unslug(slug: string): string;
    signToJwtToken(params: string | Record<string, unknown> | Buffer, opts?: JwtSignOptions): string;
    verifyJwtToken(token: string): any;
    trimAndLowerCase(value: string): string;
    validateDateTime(datetime: string): boolean;
    static generateRandomString(length: number, chars?: string, isOTP?: boolean): string;
    roundTo2Figs(num: number): number;
    generateUniqueEmail(): string;
    generateUniquePhoneNumber(countryCode: string): string;
    getFileExtension(mimeType: string): string;
    uploadFile(mime: string, base64: Base64, folder?: string, filename?: string): Promise<AWS.S3.ManagedUpload.SendData>;
}
