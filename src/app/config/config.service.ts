import { Injectable } from '@angular/core';
import { HttpClient,HttpHandler } from '@angular/common/http';
import {Http,Headers,RequestOptions,Response} from '@angular/http';
import { Observable }   from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { wbsdata  } from '../model/user.model';
import { BehaviorSubject } from 'rxjs';




@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private messageSource = new BehaviorSubject('');
  currentMessage = this.messageSource.asObservable();
  //private serviceUrl = 'https://jsonplaceholder.typicode.com/users';

  hostUrl = 'http://127.0.0.1/psisservice/';
  hostUrllogin ='http://172.18.226.19/logins/';
  headers = new Headers();
  options = new RequestOptions()

  constructor(private http: HttpClient, private http2: Http) {
    this.headers.append('Content-Type','application/x-www-form-urlencoded');
    this.options.headers = this.headers;
   }
  
  getWbs(endpoint): Observable<wbsdata[]> {
    return this.http.get<wbsdata[]>(endpoint);
  }



  postdata (endpoint,params){
    return this.http2.post(this.hostUrl+endpoint,JSON.stringify(params),this.options).map(res=>res.json());
  }

  
  postdata2 (endpoint,params){
    return this.http2.post(this.hostUrl+endpoint,JSON.stringify(params),this.options).map((response: Response) => response.json());
  }
  getdata(endpoint){
    return this.http2.get(this.hostUrl+endpoint,this.options).map(res=>res.json());
  }
  changeMessage() {
    this.messageSource.next(localStorage.getItem('name'))
  }
  


}

