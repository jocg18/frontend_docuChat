import { Component } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  queryText: string = '';
  results: any[] = [];

  sendQuery() {
    if (!this.queryText.trim()) return;

    fetch('http://127.0.0.1:3000/api/query', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ query: this.queryText })
    })
    .then(resp => resp.json())
    .then(data => {
      this.results = data.matches || [];
    })
    .catch(err => {
      console.error(err);
    });
  }
}
