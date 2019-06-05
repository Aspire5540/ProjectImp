var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConfigService } from '../config/config.service';
import 'rxjs/add/observable/of';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { AuthService } from '../config/auth.service';
import { HttpClient } from '@angular/common/http';
import { FileuploadService } from '../config/fileupload.service';
var SumtableComponent = /** @class */ (function () {
    function SumtableComponent(configService, authService, http, uploadService) {
        var _this = this;
        this.configService = configService;
        this.authService = authService;
        this.http = http;
        this.uploadService = uploadService;
        //Select option
        this.projects = [];
        this.causeNames = [];
        this.solveMets = [];
        //id: string;
        this.show = false;
        this.wdata = [];
        //file upload
        this.URL = "http://127.0.0.1/psisservice/uploads/";
        this.file = null;
        this.userId = 1;
        this.uploadResponse = { status: '', message: '', filePath: '' };
        //dataSource = new UserDataSource(this.userService);
        this.dataSource = new MatTableDataSource();
        //displayedColumns = ['name', 'email', 'phone', 'company'];
        this.displayedColumns = ['wbs', 'jobName', 'causeName', 'solveMet', 'note', 'status', 'download', 'del'];
        this.notes = ['1.งานร้องเรียน', '2.PM/PS', '3.งานเร่งด่วน', '4.งานปกติ'];
        this.getData = function () {
            _this.configService.getWbs('rdimjob.php?peaCode=' + localStorage.getItem('peaEng'))
                .subscribe(function (res) {
                _this.dataSource.data = res;
            });
        };
    }
    SumtableComponent.prototype.ngOnInit = function () {
        this.getData();
        this.dataSource.paginator = this.paginator;
        //console.log(this.id);
    };
    SumtableComponent.prototype.applyFilter = function (filterValue) {
        console.log((filterValue + " " + localStorage.getItem('peaEng')).trim().toLowerCase());
        this.dataSource.filter = (filterValue).trim().toLowerCase();
    };
    SumtableComponent.prototype.onSubmit = function () {
        var _this = this;
        //console.log(this.registerForm.value);  // { first: '', last: '' }
        this.wdata = this.registerForm.value;
        this.wdata["user"] = localStorage.getItem('name');
        this.wdata["peaCode"] = localStorage.getItem('peaCode');
        console.log(this.wdata);
        this.configService.postdata('wrimjob.php', this.registerForm.value).subscribe((function (data) {
            if (data.status == 1) {
                _this.registerForm.resetForm();
                _this.getData();
                alert("เก็บข้อมูลแล้วเสร็จ");
            }
            else {
                alert(data.data);
            }
        }));
    };
    SumtableComponent.prototype.chgProject = function () {
        if (this.registerForm.value["projectType"] == "movePole") {
            this.projects = ['I-62-B.MR',
                'I-59-B.41',
                'I-60-B.41',
                'I-60-B.MR',
                'I-61-B.MR',
            ];
            this.causeNames = ['กีดขว้างงานสร้างถนน',
                'อยู่ในที่ผู้ใช้ไฟฟ้า',
                'งานเสริมความมั่นคง',
            ];
            this.solveMets = [];
            this.show = false;
        }
        else {
            this.projects = ['I-62-B.BY',
                'PDD01.4',
                'I-60-B.BY',
            ];
            this.causeNames = ['แรงดันตก',
                'หม้อแปลงโหลดเกินพิกัด',
                'งานเสริมความมั่นคง',
            ];
            this.solveMets = ['ตัดจ่ายใหม่',
                'เพิ่มขนาดหม้อแปลง',
                'เพิ่มเฟส',
                'เพิ่มขนาดสาย'];
            this.show = true;
        }
    };
    /*
    selProject() {
        console.log(this.registerForm.value["project"]);
    }
    */
    SumtableComponent.prototype.delWbs = function (wbsdata) {
        var _this = this;
        //console.log(wbsdata.wbs);
        this.configService.postdata('delimjob.php', wbsdata).subscribe((function (data) {
            if (data.status == 1) {
                _this.registerForm.resetForm();
                _this.getData();
                alert("ลบข้อมูลแล้วเสร็จ");
            }
            else {
                alert(data.data);
            }
        }));
    };
    SumtableComponent.prototype.handleFileInput = function (event) {
        //console.log(event.target.files[0]);
        var _this = this;
        var formData = new FormData();
        formData.append('avatar', event.target.files[0]);
        formData.append('wbs', this.registerForm.value["wbs"]);
        this.uploadService.upload(formData).subscribe(function (res) {
            _this.uploadResponse = res;
            console.log(res);
        }, function (err) {
            console.log(err);
        });
        //console.log(this.uploadResponse);
    };
    __decorate([
        ViewChild('f'),
        __metadata("design:type", NgForm)
    ], SumtableComponent.prototype, "registerForm", void 0);
    __decorate([
        ViewChild(MatPaginator),
        __metadata("design:type", MatPaginator)
    ], SumtableComponent.prototype, "paginator", void 0);
    SumtableComponent = __decorate([
        Component({
            selector: 'app-sumtable',
            templateUrl: './sumtable.component.html',
            styleUrls: ['./sumtable.component.scss']
        }),
        __metadata("design:paramtypes", [ConfigService, AuthService, HttpClient, FileuploadService])
    ], SumtableComponent);
    return SumtableComponent;
}());
export { SumtableComponent };
//# sourceMappingURL=sumtable.component.js.map