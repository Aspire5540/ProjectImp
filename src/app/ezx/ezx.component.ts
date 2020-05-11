import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ConfigService } from '../config/config.service';
import {Observable} from 'rxjs';
import {startWith, map} from 'rxjs/operators';
import {MatTableDataSource, MatPaginator } from '@angular/material';
import {ezxdevice} from '../model/user.model';
import { MatSort } from '@angular/material/sort';


@Component({
  selector: 'app-ezx',
  templateUrl: './ezx.component.html',
  styleUrls: ['./ezx.component.scss'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'th-TH' },]

})
export class EzxComponent implements OnInit {
  @ViewChild('f', { static: true }) registerForm: NgForm;
  @ViewChild('fdevice', { static: true }) deviceForm: NgForm;
  control = new FormControl();
  filteredDevice: Observable<string[]>;
  deviceType=[{value: "new", viewValue:"รื้อถอน-ติดตั้งใหม่"},{value: "reuse", viewValue:"ซ่อมแชม"}]
  checked = true;
  police = "";
  onOpen=false;
  debt = "";
  DateDamge = "";
  IdNum = "";
  InsCom = "";
  Name = "";
  PlaceDamage = "";
  PlateNum = "";
  TimeDamge = "";
  address = "";
  carOwnName = "";
  district = "";
  orderN = "";
  peaCode = "";
  post = "";
  tambol = "";
  tel1 = "";
  tel2 = "";
  tel3 = "";
  teleHigh = "";
  teleName = "";
  indexKey="";
  joblist=[];
  deviceList=[];
  selectType="";
  displayedColumns = ['DeviceID', 'deviceName',  'DeviceQ','unit', 'unitPrice', 'total'];
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild('sort', { static: true }) sort: MatSort;
  public dataSource = new MatTableDataSource<ezxdevice>();

  constructor(private _adapter: DateAdapter<any>, private configService: ConfigService) { 
    this._adapter.setLocale('th'); 
    this.getJobList();
    this.getDeviceList();
    }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.filteredDevice = this.control.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }
  private _filter(value: string): string[] {
    const filterValue = this._normalizeValue(value);
    return this.deviceList.filter(street => this._normalizeValue(street).includes(filterValue));
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }
  SelectType(){
    this.getProjectDevice();

  }
  getProjectDevice() {

    this.configService.getezxdevice('ezx/rdezxdevice.php?indexKey=' + this.indexKey+'&selectType='+this.selectType)
      //this.configService.getTr('TR.php?condition='+this.condition+'&peaCode0='+'B00000')
      .subscribe(res => {
        this.dataSource.data = res as ezxdevice[];
      })
  }
  newdevice(){
    
    var wdata = this.deviceForm.value;
    wdata["indexKey"] = this.indexKey;
    wdata["DeviceID"] = this.control.value.split(":")[0];
    this.configService.postdata2('ezx/wrDevice.php', wdata).subscribe((data => {
      if (data['status'] == 1) {
        //alert("บันทึกแล้วเสร็จ");
        this.getProjectDevice();
      } else {
        alert(data['data']);
      }

    }))

  }
  onSubmit() {
    
    var wdata = this.registerForm.value;
    wdata["user"] = localStorage.getItem('name');
    wdata["peaCode"] = localStorage.getItem('peaCode');
    wdata["indexKey"] = this.indexKey;

    this.configService.postdata2('ezx/wrJob.php', wdata).subscribe((data => {
      if (data['status'] == 1) {
        this.getJobList();
        this.registerForm.resetForm();
        alert("บันทึกแล้วเสร็จ");
      } else {
        alert(data['data']);
      }

    }))

  }
  selectJob(event){
    this.configService.postdata2('ezx/selectjob.php', {indexKey:event.value}).subscribe((data => {
      console.log(data["data"][0]);     
      if (data["status"] == 1) {
        this.indexKey=data["data"][0].indexKey;
        this.DateDamge=data["data"][0].DateDamge;
        this.IdNum=data["data"][0].IdNum;
        this.InsCom=data["data"][0].InsCom;
        this.Name=data["data"][0].Name;
        this.PlaceDamage=data["data"][0].PlaceDamage;
        this.PlateNum=data["data"][0].PlateNum;
        this.TimeDamge=data["data"][0].TimeDamge;
        this.address=data["data"][0].address;
        this.carOwnName=data["data"][0].carOwnName;
        this.debt=data["data"][0].debt;
        this.orderN=data["data"][0].orderN;
        this.peaCode=data["data"][0].peaCode;
        this.police=data["data"][0].police;
        this.tel1=data["data"][0].tel1;
        this.tel2=data["data"][0].tel2;
        this.tel3=data["data"][0].tel3;
        this.teleHigh=data["data"][0].teleHigh;
        this.teleName=data["data"][0].teleName;
        this.getProjectDevice();
        this.onOpen=true;
      } else {
        alert(data["data"]);
      }
      
    }))
    
  }
  newJob(){
    this.registerForm.resetForm();
    this.indexKey='';
  }
  getDeviceList(){
    this.configService.postdata2('ezx/rddevice.php', {}).subscribe((data => {
      this.deviceList=[];    
      if (data["status"] == 1) {
        data["data"].forEach(element => {
          this.deviceList.push(element.DeviceID+":"+element.DeviceName);

        });


      } else {
        alert(data["data"]);
      }
      
    }))



  }
  getJobList() {
   
    this.configService.postdata2('ezx/rdjob.php', {}).subscribe((data => {
      this.joblist=[];    
      if (data["status"] == 1) {
        data["data"].forEach(element => {
          this.joblist.push({value: element.indexKey, viewValue: element.DateDamge+" "+element.PlaceDamage});

        });


      } else {
        alert(data["data"]);
      }
      
    }))


  }
}
