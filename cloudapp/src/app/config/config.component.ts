import { Component, OnInit } from '@angular/core';
import { CloudAppConfigService} from '@exlibris/exl-cloudapp-angular-lib';
import { HttpClient } from '@angular/common/http'; 
import { Constants } from '../constants';
import { DialogService } from "eca-components";
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})

export class ConfigComponent implements OnInit {
  constants: Constants = new Constants();
  htmlName: string = "";
  htmlEditName: string = "";
  html: string = ""
  htmlFiles = [];
  sampleLetter: string = "";
  formattedRecord: string; 
  saving: boolean = false;
  customHtmls = {customHtmls : []};
  editMode = false;

  constructor ( 
    private configService: CloudAppConfigService, 
    private readonly http: HttpClient,
    private dialog: DialogService,
    public dialog2: MatDialog,
  ) {}
  
  ngOnInit() { this.onLoad(); }

  onLoad() {
    console.log("loading config.");
    this.sampleLetter = Constants.SAMPLE_LETTER;
    this.htmlFiles = JSON.parse(JSON.stringify(Constants.HTML_FILES)); // clone by val
    this.configService.get().subscribe( response => {
      console.log("Got the config:");
      console.log(response);
      if (response.customHtmls) {
        this.customHtmls = response;  
      }
    },
    err => console.log(err.message));    
  }  

  onHtmlChanged(event: Event) {
    console.log("HTML was changed");
    this.html = (<HTMLInputElement>event.target).value;
    this.runHtml();
  }

  onSaveBtnClicked() {
    if (this.editMode) {
      this.editTemplate();
    }
    else{
      this.newTemplate();
    }
  }
  newTemplate(){
    this.dialog.confirm({
      text: [`Are you sure you want to create '${this.htmlName}' as a new template ?`],
    }).subscribe(result => {
      if (!result) return;
      this.saving=true;
      this.htmlName = this.htmlName.replace(".html","");
      var toSave = {            
      name: this.htmlName,
      html: this.html    
      };
      let isExist = this.customHtmls.customHtmls.filter(html => html.name === this.htmlName);
      if (isExist.length > 0) {
        this.saving = false;
        this.dialog.confirm({
          text: [`Template name '${this.htmlName}' already exist, Do you wish to overwrite it?`],
        }).subscribe(result => {
          if (!result) return;
          this.saving=true;
          this.customHtmls.customHtmls = this.customHtmls.customHtmls.filter(html => html.name !== this.htmlName);
          this.customHtmls.customHtmls.push(toSave);    
          console.log(this.customHtmls);
          this.configService.set(this.customHtmls).subscribe( response => {
          console.log("Saved");
          this.saving=false;
      },
      err => console.log(err.message));
        })
      }
      else {
        this.customHtmls.customHtmls = this.customHtmls.customHtmls.filter(html => html.name !== this.htmlName);
        this.customHtmls.customHtmls.push(toSave);    
        console.log(this.customHtmls);
        this.configService.set(this.customHtmls).subscribe( response => {
        console.log("Saved");
        this.saving=false;
      },
      err => console.log(err.message));
      }
    })

  }
  editTemplate(){
    this.dialog.confirm({
        text: [ `Are you sure?`],
    }).subscribe(result => {
      if (!result) return;
      this.saving=true;
      this.htmlName = this.htmlName.replace(".html","");
      var toSave = {            
      name: this.htmlName,
      html: this.html    
      };
      let isExist = this.customHtmls.customHtmls.filter(html => html.name === this.htmlName);
      if (isExist.length > 0 && this.htmlName != this.htmlEditName) {
        this.saving = false;
        this.dialog.confirm({
          text: [`Template name '${this.htmlName}' already exist, Do you wish to overwrite it?`],
        }).subscribe(result => {
          if (!result) return;
          this.saving=true;
          this.customHtmls.customHtmls = this.customHtmls.customHtmls.filter(html => html.name !== this.htmlName);
          this.customHtmls.customHtmls = this.customHtmls.customHtmls.filter(html => html.name !== this.htmlEditName);
          this.customHtmls.customHtmls.push(toSave); 
          this.htmlEditName = this.htmlName;   
          console.log(this.customHtmls);
          this.configService.set(this.customHtmls).subscribe( response => {
          console.log("Saved");
          this.saving=false;
      },
      err => console.log(err.message));
        })
      }
      else {
        this.customHtmls.customHtmls = this.customHtmls.customHtmls.filter(html => html.name !== this.htmlEditName);
        this.customHtmls.customHtmls.push(toSave);
        this.htmlEditName = this.htmlName;    
        console.log(this.customHtmls);
        this.configService.set(this.customHtmls).subscribe( response => {
        console.log("Saved");
        this.saving=false;
      },
      err => console.log(err.message));
      }
    })
  }

  onDeleteBtnClicked(){
    this.dialog.confirm({
      text: [`Are you sure you want to delete?`],
    }).subscribe(result => {
      if (!result) return;
      this.saving=true;
      this.customHtmls.customHtmls = this.customHtmls.customHtmls.filter(html => html.name !== this.htmlEditName);
      this.configService.set(this.customHtmls).subscribe( response => {
      console.log("Saved");
      this.html = '';
      this.htmlName = '';
      this.htmlEditName = '';
      this.editMode = false;
      this.formattedRecord = '';
      this.saving=false;
    },
    err => console.log(err.message));
    })
    
  }

  loadStartingPoint(template: any) {
    this.htmlName = "";
    this.htmlEditName = "";
    this.editMode = false;
    if (template.name){
      console.log("Using: "+ template.name);
    }
    else {
      console.log("Using: "+ template);
    }
    let htmlFilepath: string = 'assets/' + template;
    if (htmlFilepath.endsWith(".html")){
      this.http.get(htmlFilepath, { responseType: 'application' as 'json'}).subscribe(data => {
        console.log("Load: "+ htmlFilepath);
        this.html = data.toString();
        this.runHtml();
    })
    }
    else {
      this.html = template.html;
      this.runHtml();
    }
  }

  runHtml() { 
      this.changeCss();
      this.formattedRecord = Constants.HTML_BODY;    
  }

  changeCss(){
    if (!document.body.getElementsByTagName('style')[0]) {
      var style = document.createElement('style');
      style.innerHTML = this.html;
      document.body.appendChild(style);
    }
    else {
      document.body.getElementsByTagName('style')[0].innerHTML = this.html; 
    }
  }

  onCustomHtmlChange(customHtml: any){
    this.editMode = true;
    this.htmlName = customHtml.name;
    this.htmlEditName = customHtml.name;
    this.html = customHtml.html;
    this.runHtml();
  }
   

}