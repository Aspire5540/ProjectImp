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
  displayedColumns = ['PEA_TR','Location','PLoadTOT', 'minV', 'WBS','Note'];
  TRNo = "00-050333";
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  Statuss= [
    {value: 'อยู่ระหว่างตรวจสอบ'},
    {value: 'อยู่ระหว่างสำรวจประมาณการ'},
    {value: 'อยู่ระหว่างแก้ไขข้อมูล GIS'},
    {value: 'ไม่พบปัญหา'}
  ];
  
  public dataSource = new MatTableDataSource<trdata>();
  constructor(private configService :ConfigService,public authService: AuthService,private http: HttpClient,private uploadService : FileuploadService) {}
  ngOnInit() {
  this.getTrData();
  this.dataSource.paginator = this.paginator; 
  this.dataSource.sort = this.sort;
  }
  public getTrData = () => {
    
    this.configService.getTr('TR.php?TRNumber='+this.TRNo)
    .subscribe(res => {
      this.dataSource.data = res as trdata[];
    })
  }
  applyFilter(filterValue: string) {
    console.log((filterValue+" "+localStorage.getItem('peaEng')).trim().toLowerCase());
    this.dataSource.filter = (filterValue).trim().toLowerCase();
  }
  selectStatus(event){
    console.log(event);
    this.configService.postdata('wristatus.php',{TRNumber:event.value[1].PEA_TR,status :event.value[0]}).subscribe((data=>{
      if(data.status==1){
         console.log(data.data);
         this.getTrData();
        //console.log(this.peaname);
      }else{
        alert(data.data);
      }
  
    }))
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


