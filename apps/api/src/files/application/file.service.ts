import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { existsSync, mkdirSync, unlinkSync, writeFileSync, readFileSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);
  private readonly uploadDir = join(process.cwd(), 'files');

  constructor() {
    // Ensure upload directory exists
    if (!existsSync(this.uploadDir)) {
      mkdirSync(this.uploadDir, { recursive: true });
      this.logger.log(`Created upload directory: ${this.uploadDir}`);
    }
  }

  /**
   * Upload a file and return its URL
   */
  async uploadFile(file: Express.Multer.File): Promise<{ url: string; filename: string; size: number; mimeType: string }> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Generate unique filename to avoid conflicts
    const fileExtension = file.originalname.split('.').pop();
    const uniqueFilename = `${uuidv4()}.${fileExtension}`;
    const filePath = join(this.uploadDir, uniqueFilename);

    try {
      // Write file to disk
      writeFileSync(filePath, file.buffer);
      
      this.logger.log(`File uploaded: ${uniqueFilename} (${file.size} bytes)`);

      return {
        url: `/files/${uniqueFilename}`,
        filename: uniqueFilename,
        size: file.size,
        mimeType: file.mimetype,
      };
    } catch (error) {
      this.logger.error(`Error uploading file: ${error.message}`, error.stack);
      throw new BadRequestException(`Failed to upload file: ${error.message}`);
    }
  }

  /**
   * Upload multiple files
   */
  async uploadFiles(files: Express.Multer.File[]): Promise<Array<{ url: string; filename: string; size: number; mimeType: string }>> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    const uploadPromises = files.map(file => this.uploadFile(file));
    return Promise.all(uploadPromises);
  }

  /**
   * Delete a file by filename
   */
  async deleteFile(filename: string): Promise<void> {
    const filePath = join(this.uploadDir, filename);

    if (!existsSync(filePath)) {
      throw new NotFoundException(`File not found: ${filename}`);
    }

    try {
      unlinkSync(filePath);
      this.logger.log(`File deleted: ${filename}`);
    } catch (error) {
      this.logger.error(`Error deleting file: ${error.message}`, error.stack);
      throw new BadRequestException(`Failed to delete file: ${error.message}`);
    }
  }

  /**
   * Get file info
   */
  async getFileInfo(filename: string): Promise<{ exists: boolean; size?: number; mimeType?: string }> {
    const filePath = join(this.uploadDir, filename);

    if (!existsSync(filePath)) {
      return { exists: false };
    }

    try {
      const stats = require('fs').statSync(filePath);
      // Try to determine MIME type from extension
      const mimeTypes: Record<string, string> = {
        'pdf': 'application/pdf',
        'doc': 'application/msword',
        'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'xls': 'application/vnd.ms-excel',
        'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'txt': 'text/plain',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'gif': 'image/gif',
      };

      const extension = filename.split('.').pop()?.toLowerCase() || '';
      const mimeType = mimeTypes[extension] || 'application/octet-stream';

      return {
        exists: true,
        size: stats.size,
        mimeType,
      };
    } catch (error) {
      this.logger.error(`Error getting file info: ${error.message}`, error.stack);
      return { exists: false };
    }
  }
}

