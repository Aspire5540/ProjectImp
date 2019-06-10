import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class FileuploadService {
  SERVER_URL: string = "http://127.0.0.1/psisservice/";
  constructor(private http: HttpClient) { }

  public upload(data) {
    let uploadURL = `${this.SERVER_URL}/upload.php`;
  
    return this.http.post<any>(uploadURL, data);
  }
  public uploadDoc(data) {
    let uploadURL = `${this.SERVER_URL}/uploadDoc.php`;
    
    return this.http.post<any>(uploadURL, data);
  }
  
}

