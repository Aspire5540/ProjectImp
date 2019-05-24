import { Component, OnInit,ViewChild } from '@angular/core';
import {NgForm} from '@angular/forms';
import { ConfigService } from '../config/config.service';
import 'rxjs/add/observable/of';
import {MatTableDataSource,MatPaginator} from '@angular/material';
import { wbsdata  } from '../model/user.model';
import { AuthService } from '../config/auth.service';
import { HttpClient} from '@angular/common/http';
import {FileuploadService} from '../config/fileupload.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  @ViewChild('f') registerForm: NgForm;

  URL ="http://127.0.0.1/psisservice/uploadssap/";

  constructor(private configService :ConfigService,public authService: AuthService,private http: HttpClient,private uploadService : FileuploadService) { }

  ngOnInit() {


    
  }

}
