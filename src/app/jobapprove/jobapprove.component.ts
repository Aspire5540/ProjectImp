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
  selector: 'app-jobapprove',
  templateUrl: './jobapprove.component.html',
  styleUrls: ['./jobapprove.component.scss']
})
export class JobapproveComponent implements OnInit {
  public dataSource = new MatTableDataSource<jobreq>();
  @ViewChild('f') registerForm: NgForm;
  WorkCost =0 ;
  WorkCostPercent=0;
  WorkCostApp=0;
  projectBudget=0;
  nwbs=0;
  peaname = [];
  
  budjets= [
    {value: ['I-62-B','.BY.'], viewValue: 'I62.BY'},
    {value: ['I-62-B','.41.11'], viewValue: 'I62.41.1100'},
    {value: ['I-62-B','.41.12'], viewValue: 'I62.41.1200'},
    {value: ['I-62-B','.MR.1'], viewValue: 'I62.MR'}
  ];
  selected :any;
  selPea='';
  selBudjet=['',''];
  URL ="http://127.0.0.1/psisservice/uploads/";
  nWbs =0;
  displayedColumns = ['wbs', 'jobName', 'causeName', 'solveMet','note','workCostPln','user','del'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private configService :ConfigService,public authService: AuthService,private http: HttpClient,private uploadService : FileuploadService) {}
  ngOnInit() {
    
    this.getData(this.selPea,this.selBudjet);
    //this.rdsumcost();
    this.dataSource.paginator = this.paginator; 
    this.dataSource.sort = this.sort;
    this.getpeaList();
    //this.getJobProgress();

    //console.log(this.id);
  }

  public getData = (pea,data) => {
    
    this.configService.getJob('rdimjobview.php?peaCode='+pea+'&filter1='+data[0]+'&filter2='+data[1])
    .subscribe(res => {
      this.dataSource.data = res as jobreq[];
    })
  }
  applyFilter(filterValue: string) {
    console.log((filterValue+" "+localStorage.getItem('peaEng')).trim().toLowerCase());
    this.dataSource.filter = (filterValue).trim().toLowerCase();
  }

  selWbs(wbsdata){ 
    this.configService.postdata('addjob.php',{ wbs: wbsdata.wbs, status : 1 }).subscribe((data=>{
      if(data.status==1){
          this.getData(this.selPea,this.selBudjet);
          this.rdsumcost();
          //alert("ลบข้อมูลแล้วเสร็จ");
      }else{
        alert(data.data);
      }
  
    }))
    
  } 
  getpeaList(){ 
    this.configService.postdata('rdpeaall.php',{}).subscribe((data=>{
      if(data.status==1){
        //console.log(data.data);
        this.peaname=data.data;
        //console.log(this.peaname);
      }else{
        alert(data.data);
      }
  
    }))
    
  } 
  getApproved(){ 
    this.configService.postdata('rdapproved.php',{peaEng : this.selPea,filter1: this.selBudjet[0],filter2: this.selBudjet[1]}).subscribe((data=>{
      if(data.status==1){
        
        this.WorkCostApp=Number(data.data.sumWorkCostPln);
        this.projectBudget=Number(data.data.budget);
        //console.log(this.peaname);
      }else{
        alert(data.data);
      }
  
    }))
    
  } 
  getJobProgress(){

    this.configService.postdata('rdprogress.php',{peaEng : this.selPea,filter1: this.selBudjet[0],filter2: this.selBudjet[1]}).subscribe((data=>{
      if(data.status==1){
        console.log(data.data.nwbs);
        this.nwbs=data.data.nwbs;
        this.WorkCostPercent=Number(data.data.workCostAct)/Number(data.data.workCostPln*0.8)*100;
        //console.log(this.peaname);
      }else{
        alert(data.data);
      }
  
    }))


  }
  delWbs(wbsdata){
    //console.log(wbsdata);
    this.configService.postdata('addjob.php',{ wbs: wbsdata.wbs, status : 0 }).subscribe((data=>{
      if(data.status==1){
          this.getData(this.selPea,this.selBudjet);
          this.rdsumcost();
          //alert("ลบข้อมูลแล้วเสร็จ");
      }else{
        alert(data.data);
      }
  
    }))
    
  } 
  rdsumcost(){
    this.configService.postdata('rdsummary.php',{ peaEng : this.selPea,filter1: this.selBudjet[0],filter2: this.selBudjet[1]}).subscribe((data=>{
  
      this.getData(this.selPea,this.selBudjet);
      this.nWbs=Number(data.nWbs);
      this.WorkCost=Number(data.sumWorkCostPln)*0.8;
    }))
  }
  selectBudget(event){

    this.selBudjet=event.value;
    
    this.getApproved();
    this.getData(this.selPea,this.selBudjet);
    this.getJobProgress();
    this.configService.postdata('rdsummary.php',{ peaEng : this.selPea,filter1: this.selBudjet[0],filter2: this.selBudjet[1]}).subscribe((data=>{
      this.nWbs=Number(data.nWbs);
      this.WorkCost=Number(data.sumWorkCostPln);
    }))
  }
  selectPea(event){
    this.selPea=event.value;
    this.getJobProgress();
    this.getData(this.selPea,this.selBudjet);
    this.configService.postdata('rdsummary.php',{peaEng : this.selPea, filter1: this.selBudjet[0],filter2: this.selBudjet[1]}).subscribe((data=>{
  
      this.nWbs=Number(data.nWbs);
      this.WorkCost=Number(data.sumWorkCostPln);
    }))
  }
  onSubmit(){
    console.log(this.registerForm.value);
    this.configService.postdata('wrAppJob.php',this.registerForm.value).subscribe((data=>{
      if(data.status==1){
          this.getData(this.selPea,this.selBudjet);
          this.rdsumcost();
          //alert("ลบข้อมูลแล้วเสร็จ");
      }else{
        alert(data.data);
      }
  
    }))
  }
}
