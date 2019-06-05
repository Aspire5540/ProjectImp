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
import { ConfigService } from '../config/config.service';
import 'rxjs/add/observable/of';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { AuthService } from '../config/auth.service';
import { HttpClient } from '@angular/common/http';
import { FileuploadService } from '../config/fileupload.service';
import { MatSort } from '@angular/material/sort';
var JobapproveComponent = /** @class */ (function () {
    function JobapproveComponent(configService, authService, http, uploadService) {
        var _this = this;
        this.configService = configService;
        this.authService = authService;
        this.http = http;
        this.uploadService = uploadService;
        this.dataSource = new MatTableDataSource();
        this.WorkCost = 0;
        this.WorkCostPercent = 0;
        this.nwbs = 0;
        this.peaname = [];
        this.budjets = [
            { value: ['PTDD01.4', ''], viewValue: 'คพจ.1.4' },
            { value: ['I-62-B', '.BY.'], viewValue: 'I62.BY' },
            { value: ['I-62-B', '.41.1'], viewValue: 'I62.41' },
            { value: ['I-62-B', '.MR.1'], viewValue: 'I62.MR' }
        ];
        this.selPea = '';
        this.selBudjet = ['', ''];
        this.URL = "http://127.0.0.1/psisservice/uploads/";
        this.nWbs = 0;
        this.displayedColumns = ['wbs', 'jobName', 'causeName', 'solveMet', 'note', 'workCostPln', 'user', 'del'];
        this.getData = function (pea, data) {
            _this.configService.getJob('rdimjobview.php?peaCode=' + pea + '&filter1=' + data[0] + '&filter2=' + data[1])
                .subscribe(function (res) {
                _this.dataSource.data = res;
            });
        };
    }
    JobapproveComponent.prototype.ngOnInit = function () {
        this.getData(this.selPea, this.selBudjet);
        //this.rdsumcost();
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.getpeaList();
        //this.getJobProgress();
        //console.log(this.id);
    };
    JobapproveComponent.prototype.applyFilter = function (filterValue) {
        console.log((filterValue + " " + localStorage.getItem('peaEng')).trim().toLowerCase());
        this.dataSource.filter = (filterValue).trim().toLowerCase();
    };
    JobapproveComponent.prototype.selWbs = function (wbsdata) {
        var _this = this;
        this.configService.postdata('addjob.php', { wbs: wbsdata.wbs, status: 1 }).subscribe((function (data) {
            if (data.status == 1) {
                _this.getData(_this.selPea, _this.selBudjet);
                _this.rdsumcost();
                //alert("ลบข้อมูลแล้วเสร็จ");
            }
            else {
                alert(data.data);
            }
        }));
    };
    JobapproveComponent.prototype.getpeaList = function () {
        var _this = this;
        this.configService.postdata('rdpeaall.php', {}).subscribe((function (data) {
            if (data.status == 1) {
                //console.log(data.data);
                _this.peaname = data.data;
                //console.log(this.peaname);
            }
            else {
                alert(data.data);
            }
        }));
    };
    JobapproveComponent.prototype.getJobProgress = function () {
        var _this = this;
        this.configService.postdata('rdprogress.php', { peaEng: this.selPea, filter1: this.selBudjet[0], filter2: this.selBudjet[1] }).subscribe((function (data) {
            if (data.status == 1) {
                console.log(data.data.nwbs);
                _this.nwbs = data.data.nwbs;
                _this.WorkCostPercent = Number(data.data.workCostAct) / Number(data.data.workCostPln * 0.8) * 100;
                //console.log(this.peaname);
            }
            else {
                alert(data.data);
            }
        }));
    };
    JobapproveComponent.prototype.delWbs = function (wbsdata) {
        var _this = this;
        //console.log(wbsdata);
        this.configService.postdata('addjob.php', { wbs: wbsdata.wbs, status: 0 }).subscribe((function (data) {
            if (data.status == 1) {
                _this.getData(_this.selPea, _this.selBudjet);
                _this.rdsumcost();
                //alert("ลบข้อมูลแล้วเสร็จ");
            }
            else {
                alert(data.data);
            }
        }));
    };
    JobapproveComponent.prototype.rdsumcost = function () {
        var _this = this;
        this.configService.postdata('rdsummary.php', { peaEng: this.selPea, filter1: this.selBudjet[0], filter2: this.selBudjet[1] }).subscribe((function (data) {
            _this.getData(_this.selPea, _this.selBudjet);
            _this.nWbs = Number(data.nWbs);
            _this.WorkCost = Number(data.sumWorkCostPln);
        }));
    };
    JobapproveComponent.prototype.selectBudget = function (event) {
        var _this = this;
        this.selBudjet = event.value;
        this.getData(this.selPea, this.selBudjet);
        this.getJobProgress();
        this.configService.postdata('rdsummary.php', { peaEng: this.selPea, filter1: this.selBudjet[0], filter2: this.selBudjet[1] }).subscribe((function (data) {
            _this.nWbs = Number(data.nWbs);
            _this.WorkCost = Number(data.sumWorkCostPln);
        }));
    };
    JobapproveComponent.prototype.selectPea = function (event) {
        var _this = this;
        this.selPea = event.value;
        this.getJobProgress();
        this.getData(this.selPea, this.selBudjet);
        this.configService.postdata('rdsummary.php', { peaEng: this.selPea, filter1: this.selBudjet[0], filter2: this.selBudjet[1] }).subscribe((function (data) {
            _this.nWbs = Number(data.nWbs);
            _this.WorkCost = Number(data.sumWorkCostPln);
        }));
    };
    __decorate([
        ViewChild(MatPaginator),
        __metadata("design:type", MatPaginator)
    ], JobapproveComponent.prototype, "paginator", void 0);
    __decorate([
        ViewChild(MatSort),
        __metadata("design:type", MatSort)
    ], JobapproveComponent.prototype, "sort", void 0);
    JobapproveComponent = __decorate([
        Component({
            selector: 'app-jobapprove',
            templateUrl: './jobapprove.component.html',
            styleUrls: ['./jobapprove.component.scss']
        }),
        __metadata("design:paramtypes", [ConfigService, AuthService, HttpClient, FileuploadService])
    ], JobapproveComponent);
    return JobapproveComponent;
}());
export { JobapproveComponent };
//# sourceMappingURL=jobapprove.component.js.map