import * as tslib_1 from "tslib";
import { Component, ViewChild } from '@angular/core';
import { ConfigService } from '../config/config.service';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { Chart } from 'chart.js';
let PsimdashboardComponent = class PsimdashboardComponent {
    constructor(configService) {
        this.configService = configService;
        this.dataSource = new MatTableDataSource();
        this.displayedColumns = ['wbs', 'jobName', 'workCostM1', 'workCostM2', 'workCostM3', 'matCostM1', 'matCostM2', 'matCostM3'];
        this.peaname = [];
        this.selBudjetType = 1;
        this.budjets = [
            { value: ['I-60-B', '.BY.'], viewValue: 'I60.BY' },
            { value: ['I-62-B', '.BY.'], viewValue: 'I62.BY' },
        ];
        this.budjetsType = [
            { value: 1, viewValue: 'งานปรับปรุงระบบจำหน่าย' },
            { value: 2, viewValue: 'งานย้ายแนวระบบจำหน่าย' },
        ];
        this.projectArr = [];
        this.porjectRemArr = [];
        this.workCostArr1 = [];
        this.workCostArr2 = [];
        this.workCostArr3 = [];
        this.matCostArr1 = [];
        this.matCostArr2 = [];
        this.matCostArr3 = [];
        this.selPea = '';
        this.selPeaName = 'กฟน.2';
        this.WorkCost = 0;
        this.WorkCostPercent = 0;
        this.WorkCostApp = 0;
        this.projectBudget = 0;
        this.nwbs = 0;
        this.nwbsArr = [];
        this.nwbsApp = [];
        this.selPeapeaCode = 'B000';
        this.WorkCostPercentPea = [];
        this.matCostPercentPea = [];
        this.WorkCostPea = [];
        this.dataTypes = [
            { value: 0, viewValue: 'จำนวนงานคงค้าง' },
            { value: 1, viewValue: '% เบิกจ่าย' },
        ];
        this.totalWbs = 0;
        this.selBudjet = ['', ''];
        this.selBudjet2 = ['', ''];
        this.selected = 0;
        this.nWbs = 0;
        this.I1 = { project: 'I-60-B.BY', CRTD: 100, REL: 0, TECO: 0, CLSD: 0 };
        this.I2 = { project: 'I-62-B.BY', CRTD: 100, REL: 0, TECO: 0, CLSD: 0 };
        this.I3 = { project: 'I-60-B.MR', CRTD: 100, REL: 0, TECO: 0, CLSD: 0 };
        this.I4 = { project: 'I-61-B.MR', CRTD: 100, REL: 0, TECO: 0, CLSD: 0 };
        this.I5 = { project: 'I-62-B.MR', CRTD: 100, REL: 0, TECO: 0, CLSD: 0 };
        this.getJobProgress = () => {
            this.configService.getJobProgress('rdprogressmntAll.php?peaCode=' + this.selPeapeaCode + '&filter1=' + this.selBudjet2[0] + '&filter2=' + this.selBudjet2[1])
                .subscribe(res => {
                this.dataSource.data = res;
            });
        };
    }
    ngOnInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.getpeaList();
        this.rdproject();
        this.getJobProgress();
        //this.getJobProgressPea();
        this.getClsd();
    }
    applyFilter(filterValue) {
        this.dataSource.filter = (filterValue).trim().toLowerCase();
    }
    getpeaList() {
        this.configService.postdata2('rdpeaall.php', {}).subscribe((data => {
            if (data['status'] == 1) {
                //console.log(data['data']);
                this.peaname = data['data'];
                //console.log(this.peaname);
            }
            else {
                alert(data['data']);
            }
        }));
    }
    getClsd() {
        //Progress Bar
        this.configService.postdata2('rdclsd.php', { peaEng: this.selPea, filter1: 'I-60-B', filter2: '.BY.' }).subscribe((data => {
            this.I1.CRTD = Number(data['CRTD']) / (Number(data['REL']) + Number(data['TECO']) + Number(data['CLSD']) + Number(data['CRTD'])) * 100;
            this.I1.REL = Number(data['REL']) / (Number(data['REL']) + Number(data['TECO']) + Number(data['CLSD']) + Number(data['CRTD'])) * 100;
            this.I1.TECO = Number(data['TECO']) / (Number(data['REL']) + Number(data['TECO']) + Number(data['CLSD']) + Number(data['CRTD'])) * 100;
            this.I1.CLSD = Number(data['CLSD']) / (Number(data['REL']) + Number(data['TECO']) + Number(data['CLSD']) + Number(data['CRTD'])) * 100;
        }));
        this.configService.postdata2('rdclsd.php', { peaEng: this.selPea, filter1: 'I-62-B', filter2: '.BY.' }).subscribe((data => {
            this.I2.CRTD = Number(data['CRTD']) / (Number(data['REL']) + Number(data['TECO']) + Number(data['CLSD']) + Number(data['CRTD'])) * 100;
            this.I2.REL = Number(data['REL']) / (Number(data['REL']) + Number(data['TECO']) + Number(data['CLSD']) + Number(data['CRTD'])) * 100;
            this.I2.TECO = Number(data['TECO']) / (Number(data['REL']) + Number(data['TECO']) + Number(data['CLSD']) + Number(data['CRTD'])) * 100;
            this.I2.CLSD = Number(data['CLSD']) / (Number(data['REL']) + Number(data['TECO']) + Number(data['CLSD']) + Number(data['CRTD'])) * 100;
        }));
        this.configService.postdata2('rdclsd.php', { peaEng: this.selPea, filter1: 'I-60-B', filter2: '.MR.1' }).subscribe((data => {
            this.I3.CRTD = Number(data['CRTD']) / (Number(data['REL']) + Number(data['TECO']) + Number(data['CLSD']) + Number(data['CRTD'])) * 100;
            this.I3.REL = Number(data['REL']) / (Number(data['REL']) + Number(data['TECO']) + Number(data['CLSD']) + Number(data['CRTD'])) * 100;
            this.I3.TECO = Number(data['TECO']) / (Number(data['REL']) + Number(data['TECO']) + Number(data['CLSD']) + Number(data['CRTD'])) * 100;
            this.I3.CLSD = Number(data['CLSD']) / (Number(data['REL']) + Number(data['TECO']) + Number(data['CLSD']) + Number(data['CRTD'])) * 100;
        }));
        this.configService.postdata2('rdclsd.php', { peaEng: this.selPea, filter1: 'I-61-B', filter2: '.MR.1' }).subscribe((data => {
            this.I4.CRTD = Number(data['CRTD']) / (Number(data['REL']) + Number(data['TECO']) + Number(data['CLSD']) + Number(data['CRTD'])) * 100;
            this.I4.REL = Number(data['REL']) / (Number(data['REL']) + Number(data['TECO']) + Number(data['CLSD']) + Number(data['CRTD'])) * 100;
            this.I4.TECO = Number(data['TECO']) / (Number(data['REL']) + Number(data['TECO']) + Number(data['CLSD']) + Number(data['CRTD'])) * 100;
            this.I4.CLSD = Number(data['CLSD']) / (Number(data['REL']) + Number(data['TECO']) + Number(data['CLSD']) + Number(data['CRTD'])) * 100;
        }));
        this.configService.postdata2('rdclsd.php', { peaEng: this.selPea, filter1: 'I-62-B', filter2: '.MR.1' }).subscribe((data => {
            this.I5.CRTD = Number(data['CRTD']) / (Number(data['REL']) + Number(data['TECO']) + Number(data['CLSD']) + Number(data['CRTD'])) * 100;
            this.I5.REL = Number(data['REL']) / (Number(data['REL']) + Number(data['TECO']) + Number(data['CLSD']) + Number(data['CRTD'])) * 100;
            this.I5.TECO = Number(data['TECO']) / (Number(data['REL']) + Number(data['TECO']) + Number(data['CLSD']) + Number(data['CRTD'])) * 100;
            this.I5.CLSD = Number(data['CLSD']) / (Number(data['REL']) + Number(data['TECO']) + Number(data['CLSD']) + Number(data['CRTD'])) * 100;
        }));
    }
    crtLineChart() {
        //กราฟเส้นรายเดือน
        this.configService.postdata2('rd048.php', { peaCode: this.selPeapeaCode, filter1: this.selBudjet[0], filter2: this.selBudjet[1] }).subscribe((data => {
            var label = [];
            var pworkCost = [];
            var pmatCost = [];
            data['data'].forEach(element => {
                label.push(element.mnt);
                pworkCost.push((Number(element.workCostAct) / Number(element.workCostPln) * 100).toFixed(2));
                pmatCost.push((Number(element.matCostAct) / Number(element.matCostPln) * 100).toFixed(2));
            });
            if (this.myLine1)
                this.myLine1.destroy();
            var chartData = {
                labels: label,
                datasets: [{
                        type: 'line',
                        label: 'ค่าใช้จ่ายหน้างาน',
                        borderColor: "#5689ff",
                        borderWidth: 2,
                        fill: false,
                        data: pworkCost
                    }, {
                        type: 'line',
                        label: 'ค่าพัสดุ',
                        borderColor: "#ff5689",
                        borderWidth: 2,
                        fill: false,
                        data: pmatCost
                    }]
            };
            if (this.myLine1)
                this.myLine1.destroy();
            this.myLine1 = new Chart('myLine1', {
                type: 'line',
                data: chartData,
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
                        display: true,
                    },
                    scales: {
                        xAxes: [{
                                stacked: true,
                            }],
                        yAxes: [{
                                stacked: false,
                                ticks: {
                                    beginAtZero: true
                                },
                            }]
                    },
                    title: {
                        display: true,
                        text: "%เบิกจ่าย คชจ.หน้างาน และค่าพัสดุสะสมรายเดือน " + this.selPeaName
                    }
                }
            });
        }));
    }
    rdproject() {
        //กราฟวงกลม
        this.configService.postdata2('rdprogressmnt.php', { peaCode: this.selPeapeaCode, selBudjetType: this.selBudjetType }).subscribe((data => {
            this.projectArr = [];
            this.porjectRemArr = [];
            this.workCostArr1 = [];
            this.matCostArr1 = [];
            this.totalwbs = 0;
            data['data'].forEach(element => {
                this.projectArr.push(element.projectName); //ชื่อโครงการ
                this.porjectRemArr.push(element.nwbs); //จำนวนงานคงค้าง
                this.workCostArr1.push((Number(element.workCostAct3) / Number(element.workCostPln) * 100).toFixed(2));
                this.matCostArr1.push((Number(element.matCostAct3) / Number(element.matCostPln) * 100).toFixed(2));
            });
            this.porjectRemArr.forEach(element => {
                this.totalwbs += Number(element);
            });
            if (this.myDonut)
                this.myDonut.destroy();
            this.myDonut = new Chart('myDonut', {
                type: 'doughnut',
                data: {
                    datasets: [{
                            data: this.porjectRemArr,
                            backgroundColor: ["#ff5687", "#ffce56", "#56ffce", "#5687ff", "#ce56ff"],
                        }],
                    labels: this.projectArr
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
                        position: 'right',
                        display: true,
                    },
                    title: {
                        display: true,
                        text: "จำนวนงานคงค้างแยกตามโครงการ"
                    }
                }
            });
            this.chartData = {
                labels: this.projectArr,
                datasets: [
                    {
                        label: '%เบิกจ่าย คชจ.หน้างาน',
                        data: this.workCostArr1,
                        backgroundColor: ["#ff5687", "#ffce56", "#56ffce", "#5687ff", "#ce56ff"],
                    }
                ]
            };
            if (this.myBar)
                this.myBar.destroy();
            this.myBar = new Chart('myBar', {
                type: 'bar',
                data: this.chartData,
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
                    scales: {
                        xAxes: [{
                                stacked: true,
                            }],
                        yAxes: [{
                                stacked: false,
                                ticks: {
                                    beginAtZero: true
                                },
                            }]
                    },
                    title: {
                        display: true,
                        text: "%เบิกจ่าย คชจ.หน้างาน แยกตามโครงการ " + this.selPeaName
                    }
                }
            });
            this.chartData = {
                labels: this.projectArr,
                datasets: [
                    {
                        label: '%เบิกจ่ายค่าวัสดุ',
                        data: this.matCostArr1,
                        backgroundColor: ["#ff5687", "#ffce56", "#56ffce", "#5687ff", "#ce56ff"],
                    }
                ]
            };
            if (this.myBar2)
                this.myBar2.destroy();
            this.myBar2 = new Chart('myBar2', {
                type: 'bar',
                data: this.chartData,
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
                    scales: {
                        xAxes: [{
                                stacked: true,
                            }],
                        yAxes: [{
                                stacked: false,
                                ticks: {
                                    beginAtZero: true
                                },
                            }]
                    },
                    title: {
                        display: true,
                        text: "%เบิกจ่ายค่าวัสดุ แยกตามโครงการ" + this.selPeaName
                    }
                }
            });
        }));
    }
    selectPea(event) {
        this.selPea = event.value[0];
        this.selPeaName = event.value[2];
        this.selPeapeaCode = event.value[1];
        this.rdproject();
        this.getJobProgressPea();
        this.getJobProgress();
        this.getClsd();
        this.crtLineChart();
        /*
        //this.getJobProgress();
        this.getData(this.selPea,this.selBudjet);
        this.rdsumcost();
        this.getJobProgressPea();
        */
    }
    selectProject(event) {
        this.selBudjetType = event.value;
        if (this.selBudjetType == 2) {
            this.budjets = [
                { value: ['I-60-B', '.MR.1'], viewValue: 'I60.MR' },
                { value: ['I-61-B', '.MR.1'], viewValue: 'I61.MR' },
                { value: ['I-62-B', '.MR.1'], viewValue: 'I62.MR' }
            ];
        }
        else {
            this.budjets = [
                { value: ['I-60-B', '.BY.'], viewValue: 'I60.BY' },
                { value: ['I-62-B', '.BY.'], viewValue: 'I62.BY' },
            ];
        }
        this.rdproject();
        this.getJobProgressPea();
    }
    getJobProgressPea() {
        //จำนวนงานคงค้าง %เบิกจ่าย
        var pClsd = [];
        this.configService.postdata2('rdJobProgressPea.php', { peaCode: this.selPeapeaCode, filter1: this.selBudjet[0], filter2: this.selBudjet[1], selBudjetType: this.selBudjetType }).subscribe((data => {
            if (data['status'] == 1) {
                this.WorkCostPea = [];
                this.WorkCostPercentPea = [];
                this.nwbsArr = [];
                this.matCostPercentPea = [];
                data['data'].forEach(element => {
                    this.nwbsArr.push(element.nWBS);
                    pClsd.push((Number(element.nWBS) / Number(element.totalWbs) * 100).toFixed(2));
                    this.WorkCostPea.push(element.Pea);
                    this.WorkCostPercentPea.push((Number(element.workCostAct) / Number(element.workCostPln) * 100).toFixed(2));
                    this.matCostPercentPea.push((Number(element.matCostAct) / Number(element.matCostPln) * 100).toFixed(2));
                });
                //แสดงงานคงค้าง
                this.chartData = {
                    labels: this.WorkCostPea,
                    datasets: [{
                            label: 'จำนวนงานคงค้าง',
                            data: this.nwbsArr,
                            backgroundColor: '#07CCD6',
                        }]
                };
                this.chartTitle = 'จำนวนงานคงค้าง';
                if (this.myBar3)
                    this.myBar3.destroy();
                this.myBar3 = new Chart('myBar3', {
                    type: 'bar',
                    data: this.chartData,
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
                            display: true,
                        },
                        title: {
                            display: true,
                            text: this.chartTitle
                        },
                        scales: {
                            yAxes: [{
                                    ticks: {
                                        beginAtZero: true
                                    }
                                }]
                        }
                    },
                });
                //Percent Clsd
                this.chartData = {
                    labels: this.WorkCostPea,
                    datasets: [
                        {
                            label: 'เปอร์เซนต์งานคงค้าง',
                            data: pClsd,
                            backgroundColor: '#DAF7A6',
                        }
                    ]
                };
                if (this.myBarClsd)
                    this.myBarClsd.destroy();
                this.myBarClsd = new Chart('myBarClsd', {
                    type: 'bar',
                    data: this.chartData,
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
                            display: true,
                        },
                        title: {
                            display: true,
                            text: this.chartTitle
                        },
                        scales: {
                            yAxes: [{
                                    ticks: {
                                        beginAtZero: true
                                    }
                                }]
                        }
                    },
                });
                this.chartData = {
                    labels: this.WorkCostPea,
                    datasets: [
                        {
                            label: 'คชจ.หน้างาน',
                            data: this.WorkCostPercentPea,
                            backgroundColor: '#07CCD6',
                        },
                        {
                            label: 'ค่าพัสดุ',
                            data: this.matCostPercentPea,
                            backgroundColor: '#DAF7A6',
                        }
                    ]
                };
                this.chartTitle = '% การเบิกจ่าย';
                if (this.myBar4)
                    this.myBar4.destroy();
                this.myBar4 = new Chart('myBar4', {
                    type: 'bar',
                    data: this.chartData,
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
                            display: true,
                        },
                        title: {
                            display: true,
                            text: this.chartTitle
                        },
                        scales: {
                            yAxes: [{
                                    ticks: {
                                        beginAtZero: true
                                    }
                                }]
                        }
                    },
                });
                //this.nwbs=data['data'].nwbs;
                //this.WorkCostPercent=Number(data['data'].workCostAct)/Number(data['data'].workCostPln*0.8)*100;
            }
            else {
                alert(data['data']);
            }
        }));
    }
    /*
      selectDataType(event){
        this.selected=event.value;
        this.getJobProgressPea();
      }
    */
    selectBudget(event) {
        this.selBudjet = event.value;
        this.getJobProgressPea();
        this.crtLineChart();
    }
    selectBudget2(event) {
        this.selBudjet2 = event.value;
        this.getJobProgress();
    }
};
tslib_1.__decorate([
    ViewChild('paginator', { static: true }),
    tslib_1.__metadata("design:type", MatPaginator)
], PsimdashboardComponent.prototype, "paginator", void 0);
tslib_1.__decorate([
    ViewChild('sort', { static: true }),
    tslib_1.__metadata("design:type", MatSort)
], PsimdashboardComponent.prototype, "sort", void 0);
PsimdashboardComponent = tslib_1.__decorate([
    Component({
        selector: 'app-psimdashboard',
        templateUrl: './psimdashboard.component.html',
        styleUrls: ['./psimdashboard.component.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [ConfigService])
], PsimdashboardComponent);
export { PsimdashboardComponent };
//# sourceMappingURL=psimdashboard.component.js.map