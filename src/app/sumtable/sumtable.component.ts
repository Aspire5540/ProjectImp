import { Component, OnInit,ViewChild } from '@angular/core';
import {NgForm} from '@angular/forms';
import { ConfigService } from '../config/config.service';
import 'rxjs/add/observable/of';
import {MatTableDataSource,MatPaginator} from '@angular/material';
import { User  } from '../model/user.model';


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
    show: boolean = false;
    //dataSource = new UserDataSource(this.userService);
    public dataSource = new MatTableDataSource<User>();
    displayedColumns = ['name', 'email', 'phone', 'company'];
    @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private configService :ConfigService) {}
  ngOnInit() {
    this.getAllOwners();
    this.dataSource.paginator = this.paginator; 
  }
  public getAllOwners = () => {
    this.configService.getUser()
    .subscribe(res => {
      this.dataSource.data = res as User[];
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
}
