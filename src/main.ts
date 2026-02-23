import 'zone.js';

import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideForms } from '@angular/forms';
import { ReportComponent } from './app/report.component';

bootstrapApplication(ReportComponent, {
  providers: [
    provideHttpClient(),
    provideForms()
  ]
});