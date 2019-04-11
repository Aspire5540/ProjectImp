import { Component, OnInit,ViewChild } from '@angular/core';
import {NgForm} from '@angular/forms';
import { ConfigService } from '../config/config.service';
import 'rxjs/add/observable/of';
import {MatTableDataSource,MatPaginator} from '@angular/material';
import { wbsdata  } from '../model/user.model';
import { AuthService } from '../config/auth.service';
import { Router } from '@angular/router';

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
    id: string;
    show: boolean = false;
    //dataSource = new UserDataSource(this.userService);
    public dataSource = new MatTableDataSource<wbsdata>();
    //displayedColumns = ['name', 'email', 'phone', 'company'];
    displayedColumns = ['wbs', 'jobName', 'causeName', 'solveMet','note','status','del'];
    notes =  ['1.งานร้องเรียน','2.PM/PS','3.งานเร่งด่วน','4.งานปกติ']
    @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private configService :ConfigService,private router: Router,public authService: AuthService) {}
  ngOnInit() {
    this.id = localStorage.getItem('token');
    if (this.id==null){
      this.router.navigate(['/login']);
    }
    this.getAllOwners();
    this.dataSource.paginator = this.paginator; 
    
    console.log(this.id);
  }
  public getAllOwners = () => {
    this.configService.getUser()
    .subscribe(res => {
      this.dataSource.data = res as wbsdata[];
    })
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onSubmit() {
    console.log(this.registerForm.value);  // { first: '', last: '' }
    this.configService.postdata('wrimjob.php',this.registerForm.value).subscribe((data=>{
      if(data.status==1){
          this.registerForm.resetForm();
          this.getAllOwners();
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

selProject() {
    console.log(this.registerForm.value["project"]);
}
delWbs(wbsdata){
  console.log(wbsdata.wbs);
  this.configService.postdata('delimjob.php',wbsdata).subscribe((data=>{
    if(data.status==1){
        this.registerForm.resetForm();
        this.getAllOwners();
        alert("ลบข้อมูลแล้วเสร็จ");
    }else{
      alert(data.data);
    }

  }))
} 

}
