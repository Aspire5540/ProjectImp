import { Component, OnInit,ViewChild } from '@angular/core';
import {NgForm} from '@angular/forms';
import { ConfigService } from '../config/config.service';
import 'rxjs/add/observable/of';
import {MatTableDataSource,MatPaginator} from '@angular/material';
import { jobreq  } from '../model/user.model';
import { AuthService } from '../config/auth.service';
import { HttpClient} from '@angular/common/http';
import {FileuploadService} from '../config/fileupload.service';

@Component({
  selector: 'app-jobapprove',
  templateUrl: './jobapprove.component.html',
  styleUrls: ['./jobapprove.component.scss']
})
export class JobapproveComponent implements OnInit {
  public dataSource = new MatTableDataSource<jobreq>();
  WorkCost =0 ;
  
  URL ="http://127.0.0.1/psisservice/uploads/";
  displayedColumns = ['wbs', 'jobName', 'causeName', 'solveMet','note','status','download','user','del'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  constructor(private configService :ConfigService,public authService: AuthService,private http: HttpClient,private uploadService : FileuploadService) {}
  ngOnInit() {
  
    this.getData();
    this.rdsumcost();
    this.dataSource.paginator = this.paginator; 
    
    //console.log(this.id);
  }

  public getData = () => {
    this.configService.getJob('rdimjobview.php?peaCode=')
    .subscribe(res => {
      this.dataSource.data = res as jobreq[];
    })
  }
  applyFilter(filterValue: string) {
    console.log((filterValue+" "+localStorage.getItem('peaEng')).trim().toLowerCase());
    this.dataSource.filter = (filterValue).trim().toLowerCase();
  }

  selWbs(wbsdata){
    //console.log(wbsdata);
    this.WorkCost=this.WorkCost+Number(wbsdata.workCostPln);
   
    
    this.configService.postdata('addjob.php',wbsdata).subscribe((data=>{
      if(data.status==1){
          this.getData();
          this.rdsumcost();
          //alert("ลบข้อมูลแล้วเสร็จ");
      }else{
        alert(data.data);
      }
  
    }))
    
  } 
  rdsumcost(){
    this.configService.postdata('rdsummary.php',[]).subscribe((data=>{
  
        this.getData();
        this.WorkCost=Number(data.sumWorkCostPln);
          //alert("ลบข้อมูลแล้วเสร็จ");

    }))
  }

}
