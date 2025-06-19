import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { FileSessionService } from '../../services/file-session.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SearchComponent {
  question: string = '';
  response: string = '';
  message: string = '';
  loading: boolean = false;

  constructor(private fileSession: FileSessionService) {}

  askQuestion() {
    if (!this.question.trim()) {
      this.response = 'Escribe una pregunta primero.';
      return;
    }

    const file_id = this.fileSession.getFileId();
    console.log('🔍 DEBUG - File ID obtenido de la sesión:', file_id);
    
    if (!file_id) {
      console.warn('⚠️ DEBUG - No se encontró file_id en la sesión');
      this.response = 'Primero debes subir un archivo antes de consultar.';
      return;
    }

    this.loading = true;
    this.message = '';
    this.response = '';

    const payload = { query: this.question, file_id };
    console.log('🔍 DEBUG - Payload enviado:', payload);

    fetch(`${environment.apiUrl}/api/query`, { // ✅ USO de environment.apiUrl aquí
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then(resp => {
        if (resp.ok) return resp.json();
        else throw new Error('Error al hacer la consulta');
      })
      .then(data => {
        console.log('🔍 DEBUG - Respuesta completa del backend:', data);
        console.log('🔍 DEBUG - Longitud de la respuesta:', (data.answer || data.response || '').length);
        
        let response = data.answer || data.response || 'No se obtuvo respuesta';
        
        if (data.file_summaries && data.file_summaries.length > 0) {
          const summary = data.file_summaries[0];
          if (summary.preview && !response.includes(summary.preview)) {
            response += '\n\n**Información adicional:**\n' + summary.preview;
          }
        }
        
        if (data.metadata && data.metadata.suggestion) {
          response += '\n\n💡 **Sugerencia:** ' + data.metadata.suggestion;
        }
        
        this.response = response;
        console.log('🔍 DEBUG - Respuesta final asignada:', this.response);
        console.log('🔍 DEBUG - Longitud final:', this.response.length);
      })
      .catch(err => {
        this.message = err.message;
        this.response = '';
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
