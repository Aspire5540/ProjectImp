import { Component, OnInit,ViewChild } from '@angular/core';
import {NgForm} from '@angular/forms';
import { ConfigService } from '../config/config.service';
import 'rxjs/add/observable/of';
import {MatTableDataSource,MatPaginator} from '@angular/material';
import { trdata  } from '../model/user.model';
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
  TRNo = "00-050333";
  public dataSource = new MatTableDataSource<trdata>();
  constructor(private configService :ConfigService,public authService: AuthService,private http: HttpClient,private uploadService : FileuploadService) {}
  ngOnInit() {this.getTrData();
  }
  public getTrData = () => {
    
    this.configService.getTr('rdimjobview.php?TRNumber='+this.TRNo)
    .subscribe(res => {
      this.dataSource.data = res as trdata[];
    })
  }
  /*
  getTrData(){ 
    this.configService.postdata('TR.php',{TRNumber:this.TRNo}).subscribe((data=>{
      if(data.status==1){
         console.log(data.data);
        
        //console.log(this.peaname);
      }else{
        alert(data.data);
      }
  
    }))
    
  } 
*/
}
