import { Routes } from '@angular/router';
import { WelcomeComponent } from './welcome.component';
import { ReportComponent } from './report.component';

export const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'report', component: ReportComponent },
  { path: '**', redirectTo: '' }
];
