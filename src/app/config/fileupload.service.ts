import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpErrorResponse, HttpEventType} from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FileuploadService {
  SERVER_URL: string = "http://127.0.0.1/psisservice/";
  constructor(private http: HttpClient) { }
  public upload(data) {
    let uploadURL = `${this.SERVER_URL}/upload.php`;
    console.log(data);
    return this.http.post<any>(uploadURL, data);
  }
  
}

