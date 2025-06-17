import { Component } from '@angular/core';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {
  selectedFile: File | null = null;
  message: string = '';

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadFile() {
    if (!this.selectedFile) {
      this.message = "Selecciona un archivo primero";
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    fetch('http://127.0.0.1:3000/api/upload', {
      method: 'POST',
      body: formData
    })
    .then(resp => {
      if (resp.ok) return resp.json();
      else throw new Error("Error al subir archivo");
    })
    .then(data => {
      this.message = "Archivo subido exitosamente";
    })
    .catch(err => {
      this.message = err.message;
    });
  }
}
