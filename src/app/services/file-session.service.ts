import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FileSessionService {
    private fileId: string | null = null;

    setFileId(id: string) { this.fileId = id; }
    getFileId() { return this.fileId; }
    clearFileId() { this.fileId = null; }
}
