import { S3 } from 'aws-sdk';

import configuration from '@src/config/env/configuration';
import { FileUpload } from '@src/uploader/interfaces';
import { Uploader } from '../../uploader.interface';

export class S3Service implements Uploader {
  private client: S3;

  private bucket: string;

  constructor() {
    const config = configuration().s3;
    // use credential from env
    this.client = new S3({
      apiVersion: '2006-03-01',
      secretAccessKey: config.secretAccessKey,
      accessKeyId: config.accessKeyId,
      endpoint: config.endpoint,
      s3ForcePathStyle: configuration().isDev(),
    });
    this.bucket = config.bucket;
  }

  name(): string {
    return 'aws s3 uploader';
  }

  async upload(
    filename: string,
    content: Buffer | string,
    upload: FileUpload,
  ): Promise<string> {
    let body = content;
    if (!Buffer.isBuffer(content)) {
      body = Buffer.from(content.split(';base64,').pop(), 'base64');
    }
    const params: S3.PutObjectRequest = {
      Bucket: this.bucket,
      Key: filename,
      Body: body,
      ACL: 'public-read',
      ContentType: upload?.mime,
    };

    const res = await this.client.upload(params).promise();
    return res.Location;
  }

  delete(_filename: string): Promise<boolean> {
    return Promise.reject(new Error('not supported'));
  }
}
