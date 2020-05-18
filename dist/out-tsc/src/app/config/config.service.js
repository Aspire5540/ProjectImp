import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
let ConfigService = class ConfigService {
    //hostUrl = 'http://127.0.0.1/psisservice/';
    //headers = new Headers();
    //options = new RequestOptions()
    constructor(http) {
        this.http = http;
        this.messageSource = new BehaviorSubject('');
        this.currentMessage = this.messageSource.asObservable();
        //private serviceUrl = 'https://jsonplaceholder.typicode.com/users';
        this.hostUrl = 'http://172.18.226.19/psisservice/';
        //this.headers.append('Content-Type','application/x-www-form-urlencoded');
        //this.options.headers = this.headers;
    }
    getWbs(endpoint) {
        return this.http.get(this.hostUrl + endpoint);
    }
    getezxdevice(endpoint) {
        return this.http.get(this.hostUrl + endpoint);
    }
    getJobRemain(endpoint) {
        return this.http.get(this.hostUrl + endpoint);
    }
    getBYRemain(endpoint) {
        return this.http.get(this.hostUrl + endpoint);
    }
    getJob(endpoint) {
        return this.http.get(this.hostUrl + endpoint);
    }
    getTr(endpoint) {
        return this.http.get(this.hostUrl + endpoint);
    }
    getTr2(endpoint) {
        return this.http.get(this.hostUrl + endpoint);
    }
    getmeterdata2(endpoint) {
        return this.http.get(this.hostUrl + endpoint);
    }
    getmeterdata3(endpoint) {
        return this.http.get(this.hostUrl + endpoint);
    }
    getMeter(endpoint) {
        return this.http.get(this.hostUrl + endpoint);
    }
    getAppJob(endpoint) {
        return this.http.get(this.hostUrl + endpoint);
    }
    getJobProgress(endpoint) {
        return this.http.get(this.hostUrl + endpoint);
    }
    getStatus(endpoint, params) {
        return this.http.post(this.hostUrl + endpoint, JSON.stringify(params));
    }
    /*
    postdata (endpoint,params){
      return this.http2.post(this.hostUrl+endpoint,JSON.stringify(params),this.options).pipe(map(res=>res.json()));
    }
    */
    postdata2(endpoint, params) {
        return this.http.post(this.hostUrl + endpoint, JSON.stringify(params));
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
        this.messageSource.next(localStorage.getItem('name'));
    }
    exportAsExcelFile(json, excelFileName) {
        const worksheet = XLSX.utils.json_to_sheet(json);
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, excelFileName);
    }
    saveAsExcelFile(buffer, fileName) {
        const data = new Blob([buffer], { type: EXCEL_TYPE });
        FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    }
};
ConfigService = tslib_1.__decorate([
    Injectable({
        providedIn: 'root'
    }),
    tslib_1.__metadata("design:paramtypes", [HttpClient])
], ConfigService);
export { ConfigService };
//# sourceMappingURL=config.service.js.map