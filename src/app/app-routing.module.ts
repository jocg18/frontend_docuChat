import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { UploadComponent } from './components/upload/upload.component';
import { SearchComponent } from './components/search/search.component';
import { ResultsComponent } from './components/results/results.component';

const routes: Routes = [
    { path: '', redirectTo: '/chatbot', pathMatch: 'full' },
    { path: 'chatbot', component: ChatbotComponent },
    { path: 'upload', component: UploadComponent },
    { path: 'search', component: SearchComponent },
    { path: 'results', component: ResultsComponent }
    ];

    @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
