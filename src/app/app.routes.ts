
import { Routes } from '@angular/router';
import { WelcomeComponent } from './welcome.component';
import { ConfigComponent } from './config.component';
import { ReportComponent } from './report.component';

export const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'configure', component: ConfigComponent },
  { path: 'report', component: ReportComponent }
];
