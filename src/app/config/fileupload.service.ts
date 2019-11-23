import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class FileuploadService {
  SERVER_URL: string = "http://172.18.226.19/psisservice/";
  SERVER_URL2: string = "http://127.0.0.1/psisservice/";
  //SERVER_URL3: string = "http://127.0.0.1/psisservice/phase";
  

  constructor(private http: HttpClient) { }

  public upload(data) {
    let uploadURL = `${this.SERVER_URL}/upload.php`;
  
    return this.http.post<any>(uploadURL, data);
  }
  public uploadDoc(data) {
    let uploadURL = `${this.SERVER_URL}/uploadDoc.php`;
    
    return this.http.post<any>(uploadURL, data);
  }

  public uploadZap048(data) {
    let uploadURL = `${this.SERVER_URL2}/uploadZap048.php`; 
    return this.http.post<any>(uploadURL, data);
  } 
  public uploadGIS(data) {
    let uploadURL = `${this.SERVER_URL2}/uploadGIS.php`; 
    return this.http.post<any>(uploadURL, data);
  } 
}

