import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { TagConfigComponent } from './tag-config/tag-config.component';
import { ReportComponent } from './report/report.component';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    TagConfigComponent,
    ReportComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: '', component: WelcomeComponent },
      { path: 'configure', component: TagConfigComponent },
      { path: 'report', component: ReportComponent }
    ])
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
