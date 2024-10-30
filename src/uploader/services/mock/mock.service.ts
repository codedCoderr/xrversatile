import { Inject } from '@nestjs/common';
import { Logger } from 'winston';
import { Request, Response } from 'express';

import { LOGGER } from '@src/constants';
import { HttpAdapterHost } from '@nestjs/core';
import { FileUpload } from '@src/uploader/interfaces';
import configuration from '@src/config/env/configuration';
import { Uploader } from '../../uploader.interface';

export class MockService implements Uploader {
  private uploads: Record<string, FileUpload> = {};

  constructor(
    @Inject(LOGGER) private logger: Logger,
    private adapterHost: HttpAdapterHost,
  ) {
    // eslint-disable-next-line
    this.adapterHost?.httpAdapter?.get(
      '/mocks/*',
      (req: Request, res: Response) => {
        const file = req.url.split('/mocks/').pop();
        const upload = this.uploads[file];
        if (!upload) {
          res.status(404).end();
          return;
        }

        const buf = Buffer.from(upload.data.split(';base64,').pop(), 'base64');
        res.setHeader('Content-Type', upload.mime);
        res.send(buf);
      },
    );
    this.logger.info('mock upload route added');
  }

  name(): string {
    return 'mock uploader';
  }

  async upload(
    filename: string,
    _content: Buffer | string,
    upload: FileUpload,
  ): Promise<string> {
    this.logger.info(`uploading ${filename} to the mock cloud`);

    this.uploads[filename] = upload;
    const { port } = configuration();
    const url =
      filename.includes('doc') || filename.includes('docx')
        ? 'https://production-peoplehrm.s3.us-west-2.amazonaws.com/resumes/5f2ba853350c4396c81b9a75/60426085ab1b5cb45afd290c/Ogechi%2520Ugochukwu%27s%2520CV-2-1615974192474.docx'
        : `http://localhost:${port}/mocks/${filename}`;
    this.logger.info(`resource url: ${url}`);
    return url;
  }

  delete(_filename: string): Promise<boolean> {
    return Promise.reject(new Error('not supported'));
  }
}
