"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const lodash_1 = require("lodash");
const moment = require("moment");
const base4hHelper = require("base64-arraybuffer");
const AWS = require("aws-sdk");
const html2pdf = require("html-pdf");
const constants_1 = require("../constants");
const jwt_1 = require("@nestjs/jwt");
const uploader_service_1 = require("../uploader/uploader.service");
const axios_1 = require("@nestjs/axios");
const dtos_1 = require("../account/dtos");
const configuration_1 = require("../config/env/configuration");
const ckeditor_css_1 = require("./css/ckeditor_css");
let UtilService = class UtilService {
    constructor(configService, httpService, uploadService, a2pClient, jwtService) {
        this.configService = configService;
        this.httpService = httpService;
        this.uploadService = uploadService;
        this.a2pClient = a2pClient;
        this.jwtService = jwtService;
    }
    isDev() {
        const env = this.configService.get('NODE_ENV');
        const envs = ['development', 'test', 'localhost', 'local'];
        return !env || envs.includes(env);
    }
    generateRandom(length, chars, isOTP) {
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
    async convertFileUploadCVToPdf(organizationName, jobID, file, logger) {
        if (file.mime.includes('pdf'))
            return file;
        const filename = `${this.generateRandom(12)}.pdf`;
        const uploaded = await this.uploadService.uploadCV(organizationName, jobID, file, logger);
        const convertedFile = await this.convertFileToPdf(uploaded, filename);
        const { pdf } = convertedFile;
        const buffer = await new Promise((resolve, reject) => {
            this.httpService
                .get(pdf, {
                responseType: 'arraybuffer',
            })
                .toPromise()
                .then((resp) => {
                resolve(Buffer.from(resp.data));
            })
                .catch((e) => reject(e));
        });
        return Object.assign(Object.assign({}, file), { data: base4hHelper.encode(buffer), filename, mime: 'application/pdf' });
    }
    async convertHtmlContentToPdf(content) {
        const htmlString = `
      <html>
      <head>
       <style>
      ${ckeditor_css_1.CKEditorCSS}
  </style>
      </head>
      <body>
      <div class="ck-content">
      ${content}
      </div>
      </body>
      </html>
      `;
        return new Promise((resolve, reject) => {
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
    async streamToBase64(pdfStream) {
        const chunks = [];
        return new Promise((resolve, reject) => {
            pdfStream.on('data', (chunk) => chunks.push(chunk));
            pdfStream.on('end', () => resolve(Buffer.concat(chunks)));
            pdfStream.on('error', (error) => reject(error));
        }).then((buffer) => Buffer.from(buffer).toString('base64'));
    }
    async convertFileToPdf(file, filename) {
        return this.a2pClient.libreofficeConvert(file.url.startsWith('https://') || file.url.startsWith('http://')
            ? file.url
            : `https://${file.url}`, true, filename);
    }
    getRangeToTimeline(range, sDate, eDate) {
        let startDate;
        let endDate;
        switch (range) {
            case dtos_1.RangeEnums.Day: {
                startDate = moment().startOf('day').toDate();
                endDate = moment(startDate).endOf('day').toDate();
                break;
            }
            case dtos_1.RangeEnums.Week: {
                startDate = moment().startOf('isoWeek').toDate();
                endDate = moment(startDate).endOf('isoWeek').toDate();
                break;
            }
            case dtos_1.RangeEnums.Month: {
                startDate = moment().startOf('month').toDate();
                endDate = moment(startDate).endOf('month').toDate();
                break;
            }
            case dtos_1.RangeEnums.ThreeMonth: {
                startDate = moment().startOf('month').toDate();
                endDate = moment(startDate).subtract(3, 'M').endOf('month').toDate();
                break;
            }
            case dtos_1.RangeEnums.Year: {
                startDate = moment().startOf('year').toDate();
                endDate = moment(startDate).endOf('year').toDate();
                break;
            }
            case dtos_1.RangeEnums.LastYear: {
                startDate = moment().subtract(1, 'year').startOf('year').toDate();
                endDate = moment(startDate).endOf('year').toDate();
                break;
            }
            case dtos_1.RangeEnums.All: {
                startDate = moment('1970-01-01').startOf('year').toDate();
                endDate = moment().endOf('year').toDate();
                break;
            }
            case dtos_1.RangeEnums.FirstQuater: {
                startDate = moment().startOf('year').toDate();
                endDate = moment().quarter(1).toDate();
                break;
            }
            case dtos_1.RangeEnums.SecondQuater: {
                startDate = moment().quarter(1).toDate();
                endDate = moment().quarter(2).toDate();
                break;
            }
            case dtos_1.RangeEnums.ThirdQuater: {
                startDate = moment().quarter(2).toDate();
                endDate = moment().quarter(3).toDate();
                break;
            }
            case dtos_1.RangeEnums.FourthQuater: {
                startDate = moment().quarter(3).toDate();
                endDate = moment().quarter(4).toDate();
                break;
            }
            case dtos_1.RangeEnums.Custom: {
                startDate = moment(sDate).toDate();
                endDate = moment(eDate).toDate();
                break;
            }
            default:
                throw new Error('invalid range selected');
        }
        return { startDate, endDate };
    }
    async findOneOrCreate(model, criteria, data, session) {
        let item = await model.findOne(criteria, null, session && { session });
        if (!item) {
            [item] = await model.create([data], session && { session });
        }
        return item;
    }
    getTime(dateTime) {
        return moment({ h: dateTime.hours(), m: dateTime.minutes() });
    }
    static ucfirst(values) {
        if (!values)
            return '';
        return (0, lodash_1.lowerCase)(values.toString())
            .split(' ')
            .map((value) => value.charAt(0).toUpperCase() + value.slice(1))
            .join(' ');
    }
    static unslug(slug) {
        const words = slug.split('-');
        return words
            .map((word) => word.charAt(0).toUpperCase() + word.substring(1).toLowerCase())
            .join(' ');
    }
    signToJwtToken(params, opts) {
        return this.jwtService.sign(params, opts);
    }
    verifyJwtToken(token) {
        return this.jwtService.verify(token);
    }
    trimAndLowerCase(value) {
        return value ? value.trim().toLowerCase() : '';
    }
    validateDateTime(datetime) {
        return moment(datetime).isValid();
    }
    static generateRandomString(length, chars, isOTP) {
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
    roundTo2Figs(num) {
        return Math.round(num * 100) / 100;
    }
    generateUniqueEmail() {
        const domain = 'gmail.com';
        const username = this.generateRandom(10);
        const email = `${username}+random@${domain}`;
        return email;
    }
    generateUniquePhoneNumber(countryCode) {
        const localNumber = this.generateRandom(10, undefined, true);
        const phoneNumber = `${countryCode}${localNumber}`;
        return phoneNumber;
    }
    getFileExtension(mimeType) {
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
    async uploadFile(mime, base64, folder = '', filename = '') {
        const size = ((base64.length / 4) * 3) / 1000000;
        if (size > 3) {
            throw new common_1.BadRequestException('File too large');
        }
        const { s3 } = (0, configuration_1.default)();
        const name = `${folder}${filename === null || filename === void 0 ? void 0 : filename.split('.')[0]}_${Math.random()
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
        return new Promise((resolve, reject) => {
            s3client.upload(params, (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(data);
            });
        });
    }
};
exports.UtilService = UtilService;
exports.UtilService = UtilService = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, common_1.Inject)(constants_1.PDF_GENERATOR)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        axios_1.HttpService,
        uploader_service_1.UploadService, Object, jwt_1.JwtService])
], UtilService);
//# sourceMappingURL=util.service.js.map