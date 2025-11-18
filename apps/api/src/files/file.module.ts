import { Module } from '@nestjs/common';
import { FileController } from './presentation/file.controller';
import { FileService } from './application/file.service';

@Module({
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}

