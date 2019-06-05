import { Component, OnInit,ViewChild } from '@angular/core';
import {NgForm} from '@angular/forms';
import { ConfigService } from '../config/config.service';
import 'rxjs/add/observable/of';
import {MatTableDataSource,MatPaginator} from '@angular/material';
import { jobreq  } from '../model/user.model';
import { AuthService } from '../config/auth.service';
import { HttpClient} from '@angular/common/http';
import {FileuploadService} from '../config/fileupload.service';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-lvpro',
  templateUrl: './lvpro.component.html',
  styleUrls: ['./lvpro.component.scss']
})
export class LVProComponent implements OnInit {

  constructor(private configService :ConfigService,public authService: AuthService,private http: HttpClient,private uploadService : FileuploadService) {}
  ngOnInit() {this.getData(this.TRNo);
  }
  public getData = (TRNo) => {
    
    this.configService.getJob('rdimjobview.php?peaCode='+pea+'&filter1='+data[0]+'&filter2='+data[1])
    .subscribe(res => {
      this.dataSource.data = res as jobreq[];
    })
  }
 

}
