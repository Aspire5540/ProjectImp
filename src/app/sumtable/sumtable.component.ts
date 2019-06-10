import { Component, OnInit,ViewChild } from '@angular/core';
import {NgForm} from '@angular/forms';
import { ConfigService } from '../config/config.service';
import 'rxjs/add/observable/of';
import {MatTableDataSource,MatPaginator} from '@angular/material';
import { wbsdata,appJob  } from '../model/user.model';
import {FileuploadService} from '../config/fileupload.service';
import {Chart} from 'chart.js';
import {MatSort} from '@angular/material/sort';
@Component({
  selector: 'app-sumtable',
  templateUrl: './sumtable.component.html',
  styleUrls: ['./sumtable.component.scss']
})
export class SumtableComponent implements OnInit {
    @ViewChild('f') registerForm: NgForm;

    
    //Select option
    myDonut: Chart;
    chgWbs=0;
    Doc='doc';
    projects = [];
    causeNames = [];
    solveMets = [];
    nwbsPTDD : number;
    workCostPerPTDD:number;
    nwbsMR : number;
    workCostPerMR:number;
    nwbsBY : number;
    workCostPerBY:number;
    nwbsAll : number;
    workCostPerAll:number;
    //id: string;
    show: boolean = false;
    wdata=[];
    //file upload
    URL ="http://127.0.0.1/psisservice/uploads/";
    private file: File | null = null;
    error: string;
    userId: number = 1;
    uploadResponse = { status: '', message: '', filePath: '' };
    //dataSource = new UserDataSource(this.userService);
    public dataSource = new MatTableDataSource<wbsdata>();
    public dataSource1 = new MatTableDataSource<appJob>();
    //displayedColumns = ['name', 'email', 'phone', 'company'];
    displayedColumns = ['wbs', 'jobName', 'causeName', 'solveMet','note','status','del'];
    displayedColumns1 = ['wbs', 'jobName', 'mv','lv','tr','totalcost','matCostInPln','workCostPln','appNo'];
    notes =  ['1.งานร้องเรียน','2.PM/PS','3.งานเร่งด่วน','4.งานปกติ']
    @ViewChild('paginator') paginator: MatPaginator;
    @ViewChild('paginator1') paginator1: MatPaginator;
    @ViewChild('sort') sort: MatSort;
    @ViewChild('sort1') sort1: MatSort;
//,public authService: AuthService,private http: HttpClient
  constructor(private configService :ConfigService,private uploadService : FileuploadService) {}
  ngOnInit() {
    localStorage.setItem('peaEng', '');
    this.getData();
    this.getAppData();
    this.getJobProgress();
    this.dataSource.paginator = this.paginator; 
    this.dataSource1.paginator = this.paginator1; 
    
    this.dataSource.sort = this.sort;
    this.dataSource1.sort = this.sort1;
    //console.log(this.id);
  }
  getData = () => {
    this.configService.getWbs('rdimjob.php?peaCode='+localStorage.getItem('peaEng')) 
    .subscribe(res => {
      this.dataSource.data = res as wbsdata[];
    })
  }
  getAppData = () => {
    this.configService.getAppJob('rdAppJob.php?peaCode='+localStorage.getItem('peaEng')) 
    .subscribe(res => {
      this.dataSource1.data = res as appJob[];
    })
  }
  applyFilter(filterValue: string) {
    
    this.dataSource.filter = (filterValue).trim().toLowerCase();
  }
  applyFilter1(filterValue: string) {
    
    this.dataSource1.filter = (filterValue).trim().toLowerCase();
  }
  onSubmit() {
    console.log(this.registerForm);
    
    this.wdata=this.registerForm.value;
    this.wdata["user"]=localStorage.getItem('name');
    this.wdata["peaCode"]=localStorage.getItem('peaCode');
    console.log(this.wdata);


    this.configService.postdata('wrimjob.php',this.registerForm.value).subscribe((data=>{
      if(data.status==1){
          this.registerForm.resetForm();
          this.getData();
          alert("เก็บข้อมูลแล้วเสร็จ");
      }else{
        alert(data.data);
      }

    }))
 
    
  }
  chgProject(){

    if(this.registerForm.value["projectType"]=="movePole"){
        this.projects = [ 'I-62-B.MR',
          'I-59-B.41',
          'I-60-B.41',
          'I-60-B.MR',
          'I-61-B.MR',
         
        ];
        this.causeNames = ['กีดขว้างงานสร้างถนน',
          'อยู่ในที่ผู้ใช้ไฟฟ้า',
          'งานเสริมความมั่นคง',
        ];
        this.solveMets=[];
        this.show=false;
      }
    else{
      this.projects = ['I-62-B.BY',
        'PDD01.4',
        'I-60-B.BY',
        
      ];
      this.causeNames = ['แรงดันตก',
      'หม้อแปลงโหลดเกินพิกัด',
      'งานเสริมความมั่นคง',
    ];
      this.solveMets=['ตัดจ่ายใหม่',
      'เพิ่มขนาดหม้อแปลง',
      'เพิ่มเฟส',
      'เพิ่มขนาดสาย']
      this.show=true;
    }
    
  }

/*
selProject() {
    console.log(this.registerForm.value["project"]);
}
*/
delWbs(wbsdata){
  //console.log(wbsdata.wbs);
  this.configService.postdata('delimjob.php',wbsdata).subscribe((data=>{
    if(data.status==1){
        this.registerForm.resetForm();
        this.getData();
        alert("ลบข้อมูลแล้วเสร็จ");
    }else{
      alert(data.data);
    }

  }))
} 
handleFileInput(event) {
  //console.log(event.target.files[0]);

  const formData = new FormData();
  formData.append('avatar', event.target.files[0]);
  formData.append('wbs', this.registerForm.value["wbs"]);
  this.uploadService.upload(formData).subscribe(
    (res) => {
      this.uploadResponse = res;
        //console.log(res);
    },
    (err) => {  
      //console.log(err);
    }
  );
}
wbsChange(){
  this.chgWbs=1;
  console.log(this.chgWbs);


}
handleFileDoc(event) {
  //console.log(event.target.files[0]);

  const formData = new FormData();
  formData.append('avatar', event.target.files[0]);
  formData.append('wbs', this.registerForm.value["wbs"]);
  this.uploadService.uploadDoc(formData).subscribe(
    (res) => {
      this.uploadResponse = res;
        console.log(res);
    },
    (err) => {  
      console.log(err);
    }
  );
}
getJobProgress(){
  this.configService.postdata('rdprogress.php',{peaEng : localStorage.getItem('peaEng')}).subscribe((data=>{
    if(data.status==1){
      this.nwbsPTDD =data.data.PTDD.nwbs;
      this.workCostPerPTDD=Number(data.data.PTDD.workCostAct)/Number(data.data.PTDD.workCostPln)*100;
      this.nwbsMR =data.data.MR.nwbs;
      this.workCostPerMR=Number(data.data.MR.workCostAct)/Number(data.data.MR.workCostPln)*100;
      this.nwbsBY =data.data.BY.nwbs;
      this.workCostPerBY=Number(data.data.BY.workCostAct)/Number(data.data.BY.workCostPln)*100;
      this.nwbsAll =data.data.BY.All;
      this.workCostPerAll=Number(data.data.All.workCostAct)/Number(data.data.All.workCostPln)*100;
      //this.nwbs=data.data.nwbs;
      //this.WorkCostPercent=Number(data.data.workCostAct)/Number(data.data.workCostPln*0.8)*100;
      if (this.myDonut) this.myDonut.destroy();

      this.myDonut = new Chart('myDonut', {
        type: 'doughnut',
        data:  {
          datasets: [{
            data: [this.workCostPerAll.toFixed(2),100-this.workCostPerAll
            ],
            backgroundColor: [
              "#FFC300","#E8F6F5",
            ],
          }],
          labels: [
            '%เบิกจ่าย คชจ.หน้างาน',
            '',]
        },
      options: {
        // Elements options apply to all of the options unless overridden in a dataset
        // In this case, we are setting the border of each horizontal bar to be 2px wide
        elements: {
          rectangle: {
            borderWidth: 2,
          }
        },
        responsive: true,
        legend: {
          position: 'bottom',
          display: false,
        
        },
        title: {
          display: false,
          text: "tst"
        }
      } 
    });
    }else{
      alert(data.data);
    }

  }));


}



}
