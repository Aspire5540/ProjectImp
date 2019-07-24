import { Injectable } from '@angular/core';
import { HttpClient,HttpHandler } from '@angular/common/http';
import {Http,Headers,RequestOptions,Response} from '@angular/http';
import { Observable }   from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { wbsdata,jobreq,trdata,appJob,jobprogress,meterdata,meterdata2} from '../model/user.model';
import { BehaviorSubject } from 'rxjs';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  [x: string]: any;

  private messageSource = new BehaviorSubject('');
  currentMessage = this.messageSource.asObservable();
  //private serviceUrl = 'https://jsonplaceholder.typicode.com/users';

  hostUrl = 'http://172.18.226.19/psisservice/';
  //hostUrl = 'http://127.0.0.1/psisservice/';
  //hostUrllogin ='http://172.18.226.19/logins/';
  headers = new Headers();
  options = new RequestOptions()

  constructor(private http: HttpClient, private http2: Http) {
    this.headers.append('Content-Type','application/x-www-form-urlencoded');
    this.options.headers = this.headers;
   }
  
  getWbs(endpoint): Observable<wbsdata[]> {
    return this.http.get<wbsdata[]>(this.hostUrl+endpoint);
  }

  getJob(endpoint): Observable<jobreq[]> {
    return this.http.get<jobreq[]>(this.hostUrl+endpoint);
  }

  getTr(endpoint): Observable<trdata[]> {
    return this.http.get<trdata[]>(this.hostUrl+endpoint);
  }
  getmeterdata2(endpoint): Observable<meterdata2[]> {
    return this.http.get<meterdata2[]>(this.hostUrl+endpoint);
  }
  getMeter(endpoint): Observable<meterdata[]> {
    return this.http.get<meterdata[]>(this.hostUrl+endpoint);
  }
  getAppJob(endpoint): Observable<appJob[]> {
    return this.http.get<appJob[]>(this.hostUrl+endpoint);
  }
  getJobProgress(endpoint): Observable<jobprogress[]> {
    return this.http.get<jobprogress[]>(this.hostUrl+endpoint);
  }
  getStatus(endpoint,params){
    return this.http2.post(this.hostUrl+endpoint,JSON.stringify(params),this.options).map(res=>res.json());
  }
  postdata (endpoint,params){
    return this.http2.post(this.hostUrl+endpoint,JSON.stringify(params),this.options).map(res=>res.json());
  }
  
  /*
  postdata2 (endpoint,params){
    return this.http2.post(this.hostUrl+endpoint,JSON.stringify(params),this.options).map((response: Response) => response.json());
  }
  getdata(endpoint){
    return this.http2.get(this.hostUrl+endpoint,this.options).map(res=>res.json());
  }
  */
  changeMessage() {
    this.messageSource.next(localStorage.getItem('name'))
  }
  exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
     const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
     FileSaver.saveAs(data, fileName + '_export_' + new  Date().getTime() + EXCEL_EXTENSION);
  }


}

