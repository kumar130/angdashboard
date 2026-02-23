
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import * as Papa from 'papaparse';

@Component({
  standalone: true,
  selector: 'app-report',
  imports: [CommonModule],
  template: `
    <h2>Compliance Report</h2>
    <div *ngFor="let type of failed | keyvalue">
      <h3>{{type.key}}</h3>
      <div *ngFor="let r of type.value">
        {{r.id}} - {{r.reason}}
      </div>
    </div>
  `
})
export class ReportComponent implements OnInit {

  failed:any = {};

  constructor(private http: HttpClient){}

  ngOnInit(){
    const required = JSON.parse(localStorage.getItem('requiredTags')||'[]');
    this.http.get('assets/sample.csv',{responseType:'text'})
    .subscribe(data=>{
      Papa.parse(data,{
        header:true,
        complete:(res:any)=>{
          res.data.forEach((r:any)=>{
            required.forEach((t:any)=>{
              if(r[t.key]!==t.value){
                const type=r.ResourceType||'Unknown';
                if(!this.failed[type]) this.failed[type]=[];
                this.failed[type].push({
                  id:r.ResourceId,
                  reason:`${t.key} expected ${t.value}, actual ${r[t.key]||'Missing'}`
                });
              }
            });
          });
        }
      })
    })
  }
}
