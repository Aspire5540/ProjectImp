var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs';
var ConfigService = /** @class */ (function () {
    function ConfigService(http, http2) {
        this.http = http;
        this.http2 = http2;
        this.messageSource = new BehaviorSubject('');
        this.currentMessage = this.messageSource.asObservable();
        //private serviceUrl = 'https://jsonplaceholder.typicode.com/users';
        this.hostUrl = 'http://127.0.0.1/psisservice/';
        //hostUrllogin ='http://172.18.226.19/logins/';
        this.headers = new Headers();
        this.options = new RequestOptions();
        this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
        this.options.headers = this.headers;
    }
    ConfigService.prototype.getWbs = function (endpoint) {
        return this.http.get(this.hostUrl + endpoint);
    };
    ConfigService.prototype.getJob = function (endpoint) {
        return this.http.get(this.hostUrl + endpoint);
    };
    ConfigService.prototype.postdata = function (endpoint, params) {
        return this.http2.post(this.hostUrl + endpoint, JSON.stringify(params), this.options).map(function (res) { return res.json(); });
    };
    /*
    postdata2 (endpoint,params){
      return this.http2.post(this.hostUrl+endpoint,JSON.stringify(params),this.options).map((response: Response) => response.json());
    }
    getdata(endpoint){
      return this.http2.get(this.hostUrl+endpoint,this.options).map(res=>res.json());
    }
    */
    ConfigService.prototype.changeMessage = function () {
        this.messageSource.next(localStorage.getItem('name'));
    };
    ConfigService = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [HttpClient, Http])
    ], ConfigService);
    return ConfigService;
}());
export { ConfigService };
//# sourceMappingURL=config.service.js.map