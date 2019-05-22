import { Component, OnInit,ViewChild } from '@angular/core';
import {NgForm} from '@angular/forms';
import { ConfigService } from '../config/config.service';
import 'rxjs/add/observable/of';
import {MatTableDataSource,MatPaginator} from '@angular/material';
import { wbsdata  } from '../model/user.model';
import { AuthService } from '../config/auth.service';
import { Router } from '@angular/router';
import { HttpClient} from '@angular/common/http';
import {FileuploadService} from '../config/fileupload.service';

@Component({
  selector: 'app-sumtable',
  templateUrl: './sumtable.component.html',
  styleUrls: ['./sumtable.component.scss']
})
export class SumtableComponent implements OnInit {
    @ViewChild('f') registerForm: NgForm;

    //Select option
    projects = [];
    causeNames = [];
    solveMets = [];
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
    //displayedColumns = ['name', 'email', 'phone', 'company'];
    displayedColumns = ['wbs', 'jobName', 'causeName', 'solveMet','note','status','download','del'];
    notes =  ['1.งานร้องเรียน','2.PM/PS','3.งานเร่งด่วน','4.งานปกติ']
    @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private configService :ConfigService,private router: Router,public authService: AuthService,private http: HttpClient,private uploadService : FileuploadService) {}
  ngOnInit() {
    /*
    this.id = localStorage.getItem('token');
    if (this.id==null){
      this.router.navigate(['/login']);
    }
    */
    this.getData();
    
    this.dataSource.paginator = this.paginator; 
    
    //console.log(this.id);
  }
  public getData = () => {
    this.configService.getWbs('http://127.0.0.1/psisservice/rdimjob.php?peaCode='+localStorage.getItem('peaEng'))
    .subscribe(res => {
      this.dataSource.data = res as wbsdata[];
    })
  }

  applyFilter(filterValue: string) {
    console.log((filterValue+" "+localStorage.getItem('peaEng')).trim().toLowerCase());
    this.dataSource.filter = (filterValue).trim().toLowerCase();
  }

  onSubmit() {

    //console.log(this.registerForm.value);  // { first: '', last: '' }
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
  console.log(wbsdata.wbs);
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
        console.log(res);
    },
    (err) => {  
      console.log(err);
    }
  );
  //console.log(this.uploadResponse);
 
}





}
