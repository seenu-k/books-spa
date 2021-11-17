import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';

import { MatSnackBar } from '@angular/material/snack-bar';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';

import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild(JsonEditorComponent, { static: false }) editor!: JsonEditorComponent;

  title = 'REST API Development using Django | Frontend SPA | ED17B015';
  baseURL = new FormControl('https://booksed17b015.herokuapp.com/api/');
  responseData = {};
  externalBookName = new FormControl('A Game Of Thrones')
  apiType = new FormControl('external');
  externalRequestType = new FormControl('GET');
  internalRequestType = new FormControl('GET');
  spinner = true;
  internalBookID = new FormControl(1);
  inputObject = {
    'name': 'Sample Book',
    'isbn': '20056',
    'country': 'India',
    'number_of_pages': 257,
    'publisher': 'ABC',
    'release_date': '2020-05-21',
    'authors': [
      'John Snow'
    ]
  }
  editorOptions: JsonEditorOptions;
  filterGroup = new FormGroup({
    name: new FormControl(''),
    country: new FormControl(''),
    publisher: new FormControl(''),
    year: new FormControl('')
  });

  constructor(
    private dataService: DataService,
    private _snackBar: MatSnackBar,
    private titleService: Title,
  ) {
    this.titleService.setTitle(this.title);
    this.editorOptions = new JsonEditorOptions();
    this.editorOptions.mode = 'code';
    this.editorOptions.mainMenuBar = false;
    this.editorOptions.navigationBar = false;
  }

  ngOnInit() {
    this.sendRequest();
    this.baseURL.valueChanges.subscribe(url => {
      this.dataService.setBaseURL(url);
    });
  }
  
  assignResponseData(data: object) {
    this.responseData = data;
    this.spinner = false;
  }

  handleErrors(error: any) {
    console.log(error);
    this._snackBar.open('Error processing the request. Please check console.', 'Close', {duration: 5000});
    this.spinner = false;
  }

  handleInvalidJSON() {
    this._snackBar.open("Invalid Input JSON", 'Close', {duration: 5000});
    this.spinner = false;
  }

  sendRequest() {
    this.spinner = true;
    this.responseData = {};
    if(this.apiType.value=='external') {
      this.dataService.getExternalBooks(this.externalBookName.value).subscribe(this.assignResponseData.bind(this), this.handleErrors.bind(this));
    }
    else {
      if(this.internalRequestType.value=='GET') {
        this.dataService.getAllBooks(this.filterGroup.value).subscribe(this.assignResponseData.bind(this), this.handleErrors.bind(this));
      }
      else if(this.internalRequestType.value=='GETID') {
        this.dataService.getBookByID(this.internalBookID.value).subscribe(this.assignResponseData.bind(this), this.handleErrors.bind(this));
      }
      else if(this.internalRequestType.value=='PATCH') {
        if(!this.editor.isValidJson()) {
          return this.handleInvalidJSON();
        }
        this.dataService.patchBook(this.internalBookID.value, JSON.parse(this.editor.getText())).subscribe(this.assignResponseData.bind(this), this.handleErrors.bind(this));
      }
      else if(this.internalRequestType.value=='DELETE') {
        this.dataService.deleteBook(this.internalBookID.value).subscribe(this.assignResponseData.bind(this), this.handleErrors.bind(this));
      }
      else {
        if(!this.editor.isValidJson()) {
          return this.handleInvalidJSON();
        }
        this.dataService.postBook(JSON.parse(this.editor.getText())).subscribe(this.assignResponseData.bind(this), this.handleErrors.bind(this));
      }
    }
  }


}
