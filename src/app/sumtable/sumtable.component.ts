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
    causeNames = [
      {name: 'แรงดันตก'},
      {name: 'หม้อแปลงโหลดเกินพิกัด'},
      {name: 'งานเสริมความมั่นคง'},
    ];
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
    console.log(this.registerForm);  // { first: '', last: '' }
    this.registerForm.setValue({membershipRadios: "option2",
                                name: "1111",
                                project: "",
                                wbs: "111123"});
    
  }
  chgRmProject(){
    this.projects = [
      {name: 'I-59-B.41'},
      {name: 'I-60-B.41'},
      {name: 'I-60-B.MR'},
      {name: 'I-61-B.MR'},
      {name: 'I-62-B.MR'},
    ];
  }

  chgImProject(){
    this.projects = [
        {name: 'คพจ.1 แผน 4'},
        {name: 'I-60-B.BY'},
        {name: 'I-62-B.BY'},
      ];
    }
}
