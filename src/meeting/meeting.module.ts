import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MEETING } from '@src/constants/schema_constants';
import { JobModule } from '@src/job/job.module';
import { MeetingController } from './meeting.controller';
import { MeetingService } from './meeting.service';
import { MeetingSchema } from './schemas/meeting.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: MEETING, schema: MeetingSchema }]),
    JobModule,
  ],
  controllers: [MeetingController],
  providers: [MeetingService],
  exports: [MeetingService],
})
export class MeetingModule {}
