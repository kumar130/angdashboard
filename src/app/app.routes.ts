import { Routes } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { ConfigComponent } from './config/config.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'config', component: ConfigComponent },
  { path: 'dashboard', component: DashboardComponent }
];
