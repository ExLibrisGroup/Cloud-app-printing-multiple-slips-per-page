import { Component, OnInit } from '@angular/core';
import { AlertService, CloudAppSettingsService} from '@exlibris/exl-cloudapp-angular-lib';
import { CloudAppConfigService} from '@exlibris/exl-cloudapp-angular-lib';
import { Constants } from '../constants';
import { HttpClient } from '@angular/common/http'; 
import { finalize } from 'rxjs/operators';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})

export class SettingsComponent implements OnInit {
  
  optionSelected: string;
  saving: boolean = false;
  htmlFiles = [];
  formattedRecord: string; 
  html: string;

  constructor ( 
    private configService: CloudAppConfigService,
    private settingsService: CloudAppSettingsService,
    private readonly http: HttpClient,
    private alert: AlertService
  ) {}
  
  ngOnInit() {     this.load();   }

  load() {
    // if the App has inst-level-config - add it to the dropdown
    this.htmlFiles = JSON.parse(JSON.stringify(Constants.HTML_FILES)); // clone by val
    this.configService.get().subscribe( response => {
      console.log("Got the config:");      console.log(response);
      if (response.customHtmls) {
        response.customHtmls.forEach(customHtml => {
          this.htmlFiles.push( { id: customHtml.name, name: customHtml.name } );
          console.log("Added another line to the drop-down");
          console.log(this.htmlFiles);
        });
      }
    },
    err => this.alert.error(err.message));    


    // change the dropdown to show the selection according to the saved settings
     this.settingsService.get().subscribe( response => {
       console.log("Got the settings:");       console.log(response);
       if (response.htmlFile) {
        this.optionSelected = response.htmlFile;
        this.onSelectHtml(response.htmlFile);
       } else {
        this.onSelectHtml(this.htmlFiles[0].id);
       }
     },
     err => this.alert.error(err.message));
  }

  onSelectHtml(htmlFileName: string) {
    this.saving = true;
    console.log("Selection changed to: "+ htmlFileName);
    let htmlFilepath: string = 'assets/' + htmlFileName;
    if (htmlFilepath.endsWith(".html")) {
      this.http.get(htmlFilepath, { responseType: 'application' as 'json'}).subscribe(data => {
        console.log("Load: "+ htmlFilepath);
        this.html = data.toString();
        this.runHtml();
      })
    } else {
      this.configService.get().subscribe( response => {
        console.log("Got the config:");        console.log(response);
        if (response.customHtmls){
          let settingsHtml = response.customHtmls.filter((html: any) => html.name === htmlFileName);
          this.html = settingsHtml[0].html;
          this.runHtml();
        }
      },
      err => {console.log(err.message);this.saving = false});    
    }
  }

  runHtml() {
    this.changeCss();
    this.formattedRecord = Constants.HTML_BODY;
    this.saving = false;
  }

  onSaveBtnClicked(newVal: string) {
    console.log("Saving settings: "+ newVal);
    this.saving=true;
    var toSave = { "htmlFile": newVal };
    this.settingsService.set(toSave).pipe(finalize(() => this.saving = false)).subscribe( response => {
      console.log("Saved");
    },
    err => this.alert.error(err.message));
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


}