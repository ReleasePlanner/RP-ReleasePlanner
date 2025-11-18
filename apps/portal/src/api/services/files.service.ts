/**
 * Files API Service
 */
import { httpClient } from '../httpClient';
import { API_ENDPOINTS } from '../config';

export interface UploadFileResponse {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

export interface FileInfo {
  exists: boolean;
  size?: number;
  mimeType?: string;
}

class FilesService {
  private readonly baseUrl = `${API_ENDPOINTS.BASE_URL}/files`;

  /**
   * Upload a single file
   */
  async uploadFile(file: File): Promise<UploadFileResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await httpClient.post<UploadFileResponse>(
      `${this.baseUrl}/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  }

  /**
   * Upload multiple files
   */
  async uploadFiles(files: File[]): Promise<UploadFileResponse[]> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await httpClient.post<UploadFileResponse[]>(
      `${this.baseUrl}/upload-multiple`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  }

  /**
   * Delete a file
   */
  async deleteFile(filename: string): Promise<void> {
    await httpClient.delete(`${this.baseUrl}/${filename}`);
  }

  /**
   * Get file download URL
   */
  getFileUrl(filename: string): string {
    return `${API_ENDPOINTS.BASE_URL}/files/${filename}`;
  }

  /**
   * Get file info
   */
  async getFileInfo(filename: string): Promise<FileInfo> {
    const response = await httpClient.get<FileInfo>(`${this.baseUrl}/${filename}/info`);
    return response.data;
  }
}

export const filesService = new FilesService();

