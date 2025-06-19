import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FileSessionService } from '../../services/file-session.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatProgressBarModule],
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {
  selectedFile: File | null = null;
  message: string = '';
  loading: boolean = false;

  constructor(private fileSession: FileSessionService) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.message = '';
    }
  }

  uploadFile() {
    if (!this.selectedFile) {
      this.message = 'Selecciona un archivo primero';
      return;
    }

    this.loading = true;
    const formData = new FormData();
    formData.append('file', this.selectedFile);

    fetch(`${environment.apiUrl}/api/upload`, {  // ✅ USO de environment.apiUrl aquí
      method: 'POST',
      body: formData
    })
    .then(async resp => {
      this.loading = false;
      if (resp.ok) {
        const data = await resp.json();
        console.log('🔍 DEBUG - Respuesta completa del upload:', data);
        this.message = `✅ Archivo "${this.selectedFile?.name}" cargado con éxito.`;

        const namespace = data.file_info?.namespace || data.namespace;
        const fileId = data.file_info?.file_id || data.file_id || data.documentId || data.id;

        console.log('🔍 DEBUG - Namespace extraído:', namespace);
        console.log('🔍 DEBUG - File ID extraído:', fileId);

        if (namespace) {
          this.fileSession.setFileId(namespace);
          console.log('🔍 DEBUG - Namespace guardado en session:', this.fileSession.getFileId());
          this.message += ` (Namespace: ${namespace})`;
        } else if (fileId) {
          this.fileSession.setFileId(fileId);
          console.log('🔍 DEBUG - File ID guardado en session:', this.fileSession.getFileId());
          this.message += ` (File ID: ${fileId})`;
        } else {
          console.warn('⚠️ DEBUG - No se encontró namespace ni file_id en la respuesta');
          this.message += ' (⚠️ Sin identificador de archivo)';
        }
      } else {
        const err = await resp.json().catch(() => null);
        console.error('❌ DEBUG - Error en upload:', err);
        throw new Error(err?.details || 'Error al subir archivo');
      }
    })
    .catch(err => {
      this.loading = false;
      this.message = err.message;
    });
  }
}
