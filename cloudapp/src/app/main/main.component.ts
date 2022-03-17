import { finalize} from 'rxjs/operators';
import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CloudAppRestService, AlertService, CloudAppSettingsService, CloudAppConfigService, HttpMethod } from '@exlibris/exl-cloudapp-angular-lib';
import { PageEvent } from '@angular/material/paginator';
import { PageOptions } from './models/alma';
import { MatCheckbox } from '@angular/material/checkbox';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit{

  loading = false;
  printing_queue = [];
  clicked_records = [];
  total_records = 0;
  html: string;
  status = ['All', 'Canceled', 'Pending', 'Printed'];
  selected = 'Pending';

  @ViewChildren("checkboxes") checkboxes: QueryList<MatCheckbox>;
  @ViewChild('pageParams') pageParams : PageEvent;

  constructor(
    private restService: CloudAppRestService,
    private alert: AlertService,
    private settingsService: CloudAppSettingsService,
    private readonly http: HttpClient,
    private configService: CloudAppConfigService, 
  ) { }

  ngOnInit() {
    this.getPrintouts();
    this.loadHtml();
  }

  page(event: PageEvent){
    this.getPrintouts({
      limit: event.pageSize,
      offset: event.pageIndex * event.pageSize
    })
  }
  
  onStatusChange(event: PageEvent){
    this.getPrintouts({
      limit: event.pageSize,
      offset: 0
    })
  }

  getPrintouts(page: PageOptions = {limit: 10, offset: 0}){
    this.loading = true;
    const queryParams = {
      limit: page.limit,
      offset: page.offset,
      status: this.selected
    }
    this.restService.call({url: '/almaws/v1/task-lists/printouts', queryParams}).pipe(finalize(() => this.loading = false)).subscribe(
      result => {
        if (result.printout){
          this.printing_queue = result.printout;  
        }
        else{
          this.printing_queue = [];
        }
        this.total_records = result.total_record_count;
    },
    error => {
      this.alert.error(error.message);
    }
    )
  }

  onMarkAsPrinted(){
    this.loading = true;
    const queryParams = {
      printout_id : this.clicked_records.map(res=> res.id),
      op: 'mark_as_printed'
    }
    let request = {
      url: "/almaws/v1/task-lists/printouts",
      method: HttpMethod.POST,
      queryParams
    };
    this.restService.call(request).pipe(finalize(() => this.loading = false)).subscribe(
      (result) => {
        this.alert.success(`${result.total_record_count} Records marked as printed`)
        this.onStatusChange(this.pageParams);
    },
    error => {
      this.alert.error(error.message);
    })
  }

  onRecordClick(event: any){
    if (event.checked){
      this.clicked_records.push(event.source.value);
    }
    else{
      this.clicked_records = this.clicked_records.filter(record => record.id != event.source.value.id);
    }
  }

  onClear(){
    this.checkboxes.forEach((element) => { 
      element.checked = false;
    });
    this.clicked_records = [];
  }

  isChecked(record: any){
    if (this.clicked_records.map(res=> res.id).includes(record.id))
      return true;
    return false;  
  }

  onPrintPreviewNewTab(){
    var content = '<html><head><style>';
    content += this.html + '</style></head><body onload=\"window.print(); \"><div class="row">';
    
    let grid = this.html.split('grid-template-columns:')[1];
    if (grid) {
      grid = grid.split(';')[0];
    }
    if (grid) {
      var grid_cols = grid.split('%').length - 1;
    }
    else {
      grid_cols = 1;
    }
    let index = 1;
    this.clicked_records.forEach((record, i, arr) => {
      if (grid_cols == index) { 
        content += `<div class="letter">${record.letter}</div>`;
        content += `</div>`;
        if (i != arr.length - 1){
          content += `<div class="row">`;
        }
        index = 0;
      }
      else {
        content += `<div class="letter">${record.letter}</div>`;
      }
      index++;  
    })
    content += '</div></body></html>';
    
    var win = window.open();
    win.document.write(`<title>Print Preview</title>`);
    win.document.write(content);
    win.document.close();
  }

  loadHtml(){
    let htmlFilepath: string = 'assets/' + '2 slips per line.html'; // default
    this.settingsService.get().subscribe(response => {
      console.log("Got the settings: ");
      console.log(response);
      if (response.htmlFile) {
        htmlFilepath = response.htmlFile;
      }
      console.log("htmlFilepath: "+ htmlFilepath);
      if (htmlFilepath.endsWith(".html")) {
        if (response.htmlFile){
          htmlFilepath = 'assets/' + response.htmlFile;
        }
        this.http.get(htmlFilepath, { responseType: 'application' as 'json'}).subscribe(data => {
          console.log("Load: "+ htmlFilepath);
          this.html = data.toString();  
        })
      } else {
        this.configService.get().subscribe(response => {
          console.log("Got the config:");
          console.log(response);
          this.html = response.customHtmls.filter((html: any) => html.name === htmlFilepath)[0].html;
        },
        err => console.log(err.message));
      }
    },
    err => console.log(err.message));
  }
}