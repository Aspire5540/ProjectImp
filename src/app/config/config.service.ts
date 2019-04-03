import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable }   from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { User  } from '../model/user.model';





@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  
  private serviceUrl = 'https://jsonplaceholder.typicode.com/users';
  
  constructor(private http: HttpClient) { }
  
  getUser(): Observable<User[]> {
    return this.http.get<User[]>(this.serviceUrl);
  }
}

