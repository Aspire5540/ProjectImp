import { Injectable } from '@angular/core';
import { HttpClient,HttpHandler } from '@angular/common/http';
import {Http,Headers,RequestOptions,Response} from '@angular/http';
import { Observable }   from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { User  } from '../model/user.model';





@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  
  private serviceUrl = 'https://jsonplaceholder.typicode.com/users';
  hostUrl = 'http://127.0.0.1/psisservice/';

  headers = new Headers();
  options = new RequestOptions()

  constructor(private http: HttpClient, private http2: Http) {
    this.headers.append('Content-Type','application/x-www-form-urlencoded');
    this.options.headers = this.headers;
   }
  
  getUser(): Observable<User[]> {
    return this.http.get<User[]>(this.serviceUrl);
  }

  postdata (endpoint,params){
    return this.http2.post(this.hostUrl+endpoint,params,this.options).map(res=>res.json());
  }




}

