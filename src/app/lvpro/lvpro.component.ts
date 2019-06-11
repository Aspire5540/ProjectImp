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
  @ViewChild('f') registerForm: NgForm;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  condition = 0;
  peaCode = "";

  Statuss= [
    {value: '-'},
    {value: 'อยู่ระหว่างตรวจสอบ'},
    {value: 'อยู่ระหว่างสำรวจประมาณการ'},
    {value: 'อยู่ระหว่างแก้ไขข้อมูล GIS'},
    {value: 'ไม่พบปัญหา'}
  ];

  
  Conditions= [
    {value: 1,viewvalue: 'แรงดันต่ำกว่า 200 Volt และโหลดเกิน 80%'},
    {value: 2,viewvalue: 'แรงดันต่ำกว่า 200 Volt'},
    {value: 3,viewvalue: 'โหลดเกิน 80%'}
  ];
  
  public dataSource = new MatTableDataSource<trdata>();
  constructor(private configService :ConfigService,public authService: AuthService,private http: HttpClient,private uploadService : FileuploadService) {}
  ngOnInit() {
  this.peaCode = localStorage.getItem('peaCode');
  this.getTrData();
  this.dataSource.paginator = this.paginator; 
  this.dataSource.sort = this.sort;
  }
  public getTrData = () => {
    
    this.configService.getTr('TR.php?condition='+this.condition+'&peaCode='+this.peaCode)
    .subscribe(res => {
      this.dataSource.data = res as trdata[];
    })
  }
  applyFilter(filterValue: string) {
    console.log((filterValue+" "+localStorage.getItem('peaEng')).trim().toLowerCase());
    this.dataSource.filter = (filterValue).trim().toLowerCase();
  }

  applyWBS(event) {
    console.log(event);
    this.configService.postdata('wriWBS.php',{TRNumber:event[1].PEA_TR,WBS :event[0]}).subscribe((data=>{
      if(data.status==1){
         console.log(data.data);
         this.getTrData();
        //console.log(this.peaname);
      }else{
        alert(data.data);
      }
  
    }))
    
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

  selectCondition(event){
    this.condition=event.value[0];
    this.getTrData();

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


