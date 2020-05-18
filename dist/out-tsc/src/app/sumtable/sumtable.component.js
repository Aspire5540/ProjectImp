import * as tslib_1 from "tslib";
import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConfigService } from '../config/config.service';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { FileuploadService } from '../config/fileupload.service';
import { Chart } from 'chart.js';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialog } from './confirmation-dialog.component';
let SumtableComponent = class SumtableComponent {
    //,public authService: AuthService,private http: HttpClient
    constructor(configService, uploadService, dialog) {
        this.configService = configService;
        this.uploadService = uploadService;
        this.dialog = dialog;
        this.chgWbs = 0;
        this.Doc = 'doc';
        this.projects = [];
        this.causeNames = [];
        this.solveMets = [];
        this.userPeaCode = localStorage.getItem('peaCode');
        //id: string;
        this.show = false;
        this.wdata = [];
        this.budjets = [];
        this.filter = ['', ''];
        this.causeNamesPole = ['กีดขว้างงานสร้างถนน (งานราชการ)',
            'อยู่ในที่ผู้ใช้ไฟฟ้า (งานผู้ใช้ไฟ)',
            'งานเสริมความมั่นคง',
        ];
        this.causeNamesIm = ['แรงดันตก',
            'หม้อแปลงโหลดเกินพิกัด',
            'แรงดันตกและโหลดเกินพิกัด',
            'งานเสริมความมั่นคง',
        ];
        this.solveMetsIm = ['ตัดจ่ายใหม่',
            'แยกจ่ายหม้อแปลง',
            'เพิ่มขนาดหม้อแปลง',
            'ปรับปรุง 1 เฟส 2 สาย เป็น 3 สาย',
            'ปรับปรุงหม้อแปลง 1 เฟส เป็น 3 เฟส',
            'เพิ่มขนาดสาย',
            'ติดตั้ง/สับเปลี่ยนวัสดุ'];
        this.appStatus = [
            { value: 0, viewValue: 'ยังไม่อนุมัติ' },
            { value: 1, viewValue: 'อยู่ระหว่างขออนุมัติฯ' },
            { value: '', viewValue: 'ทั้งหมด' },
        ];
        this.selectAppChoice = '';
        //file upload
        this.URL = "http://172.18.226.19/psisservice/uploads/";
        //URL = "http://127.0.0.1/psisservice/uploads/";
        this.file = null;
        this.userId = 1;
        this.uploadResponse = '';
        this.uploadDocResponse = '';
        //dataSource = new UserDataSource(this.userService);
        this.dataSource = new MatTableDataSource();
        this.dataSource1 = new MatTableDataSource();
        //displayedColumns = ['name', 'email', 'phone', 'company'];
        this.displayedColumns = ['wbs', 'jobName', 'causeName', 'solveMet', 'note', 'status', 'rename', 'reTr', 'del'];
        this.displayedColumns1 = ['wbs', 'jobName', 'mv', 'lv', 'tr', 'totalcost', 'matCostInPln', 'workCostPln', 'appNo'];
        this.notes = ['1.งานร้องเรียน', '2.PM/PS', '3.งานเร่งด่วน', '4.งานปกติ'];
        this.getData = () => {
            this.configService.getWbs('rdimjob.php?peaCode=' + localStorage.getItem('peaCode') + '&filter1=' + this.filter[0] + '&filter2=' + this.filter[1] + '&status=' + this.selectAppChoice)
                .subscribe(res => {
                this.dataSource.data = res;
            });
        };
        this.getAppData = (filter) => {
            this.configService.getAppJob('rdAppJob.php?peaCode=' + localStorage.getItem('peaCode') + '&filter1=' + filter[0] + '&filter2=' + filter[1])
                .subscribe(res => {
                this.dataSource1.data = res;
            });
        };
    }
    ngOnInit() {
        if (this.userPeaCode.slice(-1) == '1' || this.userPeaCode.slice(-1) == '0') {
            this.userPeaCode = this.userPeaCode.substr(0, 4);
        }
        else {
            this.userPeaCode = 'B999';
        }
        this.getData();
        this.getAppData(['', '']);
        this.getJobProgress();
        this.getFilter();
        this.dataSource.paginator = this.paginator;
        this.dataSource1.paginator = this.paginator1;
        this.dataSource.sort = this.sort;
        this.dataSource1.sort = this.sort1;
        //console.log(this.id);
    }
    exportAsXLSX() {
        this.configService.exportAsExcelFile(this.dataSource1.data, 'งานที่อนุมัติ');
    }
    exportAsXLSX2() {
        this.configService.exportAsExcelFile(this.dataSource.data, 'งานที่ขออนุมัติ');
    }
    selectBudget(event) {
        this.getAppData(event.value);
    }
    selectBudget2(event) {
        this.filter = event.value;
        this.getData();
    }
    getFilter() {
        this.configService.postdata2('rdfilter.php', {}).subscribe((data => {
            if (data['status'] == 1) {
                data['data'].forEach(element => {
                    this.budjets.push({ value: [element.filter1, element.filter2], viewValue: element.project });
                });
            }
            else {
                alert(data['data']);
            }
        }));
    }
    applyFilter(filterValue) {
        this.dataSource.filter = (filterValue).trim().toLowerCase();
    }
    applyFilter1(filterValue) {
        this.dataSource1.filter = (filterValue).trim().toLowerCase();
    }
    onSubmit() {
        this.wdata = this.registerForm.value;
        this.wdata["user"] = localStorage.getItem('name');
        this.wdata["peaCode"] = localStorage.getItem('peaCode');
        //console.log(this.wdata);
        this.configService.postdata2('wrimjob.php', this.registerForm.value).subscribe((data => {
            if (data['status'] == 1) {
                this.registerForm.resetForm();
                this.getData();
                alert("เก็บข้อมูลแล้วเสร็จ");
            }
            else {
                alert(data['data']);
            }
        }));
    }
    selectStatus1(event) {
        this.configService.postdata2('wriCause.php', { wbs: event.value[1], changeVal: event.value[0], choice: 1 }).subscribe((data => {
            if (data['status'] == 1) {
                console.log(data['data']);
                this.getData();
                //console.log(this.peaname);
            }
            else {
                alert(data['data']);
            }
        }));
    }
    selectStatus2(event) {
        this.configService.postdata2('wriCause.php', { wbs: event.value[1], changeVal: event.value[0], choice: 2 }).subscribe((data => {
            if (data['status'] == 1) {
                console.log(data['data']);
                this.getData();
                //console.log(this.peaname);
            }
            else {
                alert(data['data']);
            }
        }));
    }
    selectStatus3(event) {
        this.configService.postdata2('wriCause.php', { wbs: event.value[1], changeVal: event.value[0], choice: 3 }).subscribe((data => {
            if (data['status'] == 1) {
                console.log(data['data']);
                this.getData();
                //console.log(this.peaname);
            }
            else {
                alert(data['data']);
            }
        }));
    }
    chgProject() {
        if (this.registerForm.value["projectType"] == "movePole") {
            this.projects = ['I-62-B.MR',
                'I-59-B.41',
                'I-60-B.41',
                'I-60-B.MR',
                'I-61-B.MR',
            ];
            this.causeNames = ['กีดขว้างงานสร้างถนน (งานราชการ)',
                'อยู่ในที่ผู้ใช้ไฟฟ้า (งานผู้ใช้ไฟ)',
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
                'แรงดันตกและโหลดเกินพิกัด',
                'งานเสริมความมั่นคง',
            ];
            this.solveMets = ['ตัดจ่ายใหม่',
                'แยกจ่ายหม้อแปลง',
                'เพิ่มขนาดหม้อแปลง',
                'ปรับปรุง 1 เฟส 2 สาย เป็น 3 สาย',
                'ปรับปรุงหม้อแปลง 1 เฟส เป็น 3 เฟส',
                'เพิ่มขนาดสาย',
                'ติดตั้ง/สับเปลี่ยนวัสดุ'];
            this.show = true;
        }
    }
    /*
    selProject() {
        console.log(this.registerForm.value["project"]);
    }
    */
    delWbs(wbsdata) {
        //console.log(wbsdata.wbs);
        this.configService.postdata2('delimjob.php', wbsdata).subscribe((data => {
            if (data['status'] == 1) {
                this.registerForm.resetForm();
                this.getData();
                alert("ลบข้อมูลแล้วเสร็จ");
            }
            else {
                alert(data['data']);
            }
        }));
    }
    renameWbs(wbsdata) {
        //console.log(wbsdata.wbs);
        this.configService.postdata2('renameWBS.php', wbsdata).subscribe((data => {
            if (data['status'] == 1) {
                this.getData();
                alert("แก้ไขข้อมูลแล้วเสร็จ");
            }
            else {
                alert(data['data']);
            }
        }));
    }
    handleFileInput(event) {
        //console.log(event.target.files[0]);
        const formData = new FormData();
        formData.append('avatar', event.target.files[0]);
        formData.append('wbs', this.registerForm.value["wbs"]);
        this.uploadService.upload(formData).subscribe((res) => {
            this.uploadResponse = res.status;
            //console.log(res);
        }, (err) => {
            //console.log(err);
        });
    }
    wbsChange() {
        this.chgWbs = 1;
    }
    handleFileDoc(event) {
        //console.log(event.target.files[0]);
        const formData = new FormData();
        formData.append('avatar', event.target.files[0]);
        formData.append('wbs', this.registerForm.value["wbs"]);
        this.uploadService.uploadDoc(formData).subscribe((res) => {
            this.uploadDocResponse = res.status;
            console.log(res);
        }, (err) => {
            console.log(err);
        });
    }
    getJobProgress() {
        this.configService.postdata2('rdprogress.php', { peaEng: localStorage.getItem('peaEng') }).subscribe((data => {
            if (data['status'] == 1) {
                this.nwbsPTDD = data['data'].PTDD.nwbs;
                this.workCostPerPTDD = Number(data['data'].PTDD.workCostAct) / Number(data['data'].PTDD.workCostPln) * 100;
                this.nwbsMR = data['data'].MR.nwbs;
                this.workCostPerMR = Number(data['data'].MR.workCostAct) / Number(data['data'].MR.workCostPln) * 100;
                this.nwbsBY = data['data'].BY.nwbs;
                this.workCostPerBY = Number(data['data'].BY.workCostAct) / Number(data['data'].BY.workCostPln) * 100;
                this.nwbsAll = data['data'].BY.All;
                this.workCostPerAll = Number(data['data'].All.workCostAct) / Number(data['data'].All.workCostPln) * 100;
                //this.nwbs=data['data'].nwbs;
                //this.WorkCostPercent=Number(data['data'].workCostAct)/Number(data['data'].workCostPln*0.8)*100;
                if (this.myDonut)
                    this.myDonut.destroy();
                this.myDonut = new Chart('myDonut', {
                    type: 'doughnut',
                    data: {
                        datasets: [{
                                data: [this.workCostPerAll.toFixed(2), (100 - this.workCostPerAll).toFixed(2)
                                ],
                                backgroundColor: [
                                    "#FFC300", "#E8F6F5",
                                ],
                            }],
                        labels: [
                            '%เบิกจ่าย คชจ.หน้างาน',
                            '',
                        ]
                    },
                    plugins: [{
                            beforeDraw: function (chart) {
                                var width = chart.chart.width, height = chart.chart.height, ctx = chart.chart.ctx;
                                //text =chart.config.data['data']set[0].data[0];
                                ctx.restore();
                                var fontSize = (height / 114).toFixed(2);
                                ctx.font = fontSize + "em sans-serif";
                                ctx.textBaseline = "middle";
                                ctx.fillStyle = "#FFFEFF";
                                var text = chart.config.data['data'].sets[0].data[0] + "%", textX = Math.round((width - ctx.measureText(text).width) / 2), textY = height / 2;
                                ctx.fillText(text, textX, textY);
                                ctx.save();
                            }
                        }],
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
                        },
                        tooltips: {
                            callbacks: {
                                label: function (tooltipItem, data) {
                                    var label = data['data'].sets[tooltipItem.datasetIndex].data[tooltipItem.index] + '%';
                                    return label;
                                }
                            }
                        }
                    }
                });
                /*
                Chart.pluginService.register({
                  beforeDraw: function(chart) {
                    var width = chart.chart.width,
                        height = chart.chart.height,
                        ctx = chart.chart.ctx;
                        //text =chart.config.data['data']set[0].data[0];
                    console.log(chart.config.data['data']sets[0].data[0]);
                    ctx.restore();
                    var fontSize = (height / 114).toFixed(2);
                    ctx.font = fontSize + "em sans-serif";
                    ctx.textBaseline = "middle";
                
                    var text = chart.config.data['data']sets[0].data[0]+"%",
                        textX = Math.round((width - ctx.measureText(text).width) / 2),
                        textY = height / 2;
                
                    ctx.fillText(text, textX, textY);
                    ctx.save();
                  }
                });
            */
            }
            else {
                alert(data['data']);
            }
        }));
    }
    trChange(value) {
        this.configService.postdata2('rdtr.php', { PEA_TR: value }).subscribe((data => {
            if (data['status'] == 1) {
                if (data['data']) {
                    this.trLoad = data['data'].PLoadTOT;
                    this.minV = data['data'].minV;
                    this.ftr = true;
                }
                else {
                    this.ftr = false;
                }
            }
            else {
                alert(data['data']);
            }
        }));
    }
    selectApprove(event) {
        this.selectAppChoice = event.value;
        this.getData();
    }
    reTr(wbsdata) {
        //console.log(wbsdata.wbs);
        this.configService.postdata2('reTR.php', wbsdata).subscribe((data => {
            if (data['status'] == 1) {
                this.getData();
                alert("แก้ไขข้อมูลแล้วเสร็จ");
            }
            else {
                alert(data['data']);
            }
        }));
    }
    openDialog(wbs, choice) {
        this.choice = choice;
        const dialogRef = this.dialog.open(ConfirmationDialog, {
            width: '300px',
            data: { wbs: wbs, choice: choice }
        });
        dialogRef.afterClosed().subscribe((wbsdata) => {
            //console.log('Choice :' + this.choice);
            if (wbsdata) {
                if (this.choice == 1) {
                    this.delWbs(wbsdata);
                }
                if (this.choice == 2) {
                    this.renameWbs(wbsdata);
                }
                if (this.choice == 3) {
                    this.reTr(wbsdata);
                }
            }
        });
    }
};
tslib_1.__decorate([
    ViewChild('f', { static: true }),
    tslib_1.__metadata("design:type", NgForm)
], SumtableComponent.prototype, "registerForm", void 0);
tslib_1.__decorate([
    ViewChild('paginator', { static: true }),
    tslib_1.__metadata("design:type", MatPaginator)
], SumtableComponent.prototype, "paginator", void 0);
tslib_1.__decorate([
    ViewChild('paginator1', { static: true }),
    tslib_1.__metadata("design:type", MatPaginator)
], SumtableComponent.prototype, "paginator1", void 0);
tslib_1.__decorate([
    ViewChild('sort', { static: true }),
    tslib_1.__metadata("design:type", MatSort)
], SumtableComponent.prototype, "sort", void 0);
tslib_1.__decorate([
    ViewChild('sort1', { static: true }),
    tslib_1.__metadata("design:type", MatSort)
], SumtableComponent.prototype, "sort1", void 0);
SumtableComponent = tslib_1.__decorate([
    Component({
        selector: 'app-sumtable',
        templateUrl: './sumtable.component.html',
        styleUrls: ['./sumtable.component.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [ConfigService, FileuploadService, MatDialog])
], SumtableComponent);
export { SumtableComponent };
//# sourceMappingURL=sumtable.component.js.map