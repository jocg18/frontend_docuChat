import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
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
        MatProgressSpinnerModule
    ],
    templateUrl: './chatbot.component.html',
    styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent {
    question: string = '';
    response: string = '';
    message: string = '';
    loading: boolean = false;

    sendQuestion() {
        if (!this.question.trim()) {
            this.response = 'Por favor escribe una pregunta.';
            return;
        }

        this.loading = true;
        this.message = '';
        this.response = '';

        fetch(`${environment.apiUrl}/api/query`, { // ✅ USO de environment.apiUrl aquí
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: this.question })
        })
        .then(resp => {
            if (resp.ok) return resp.json();
            else throw new Error('Error al hacer la consulta');
        })
        .then(data => {
            console.log('Respuesta backend:', data);
            this.response = data.answer || 'No se obtuvo respuesta';
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
