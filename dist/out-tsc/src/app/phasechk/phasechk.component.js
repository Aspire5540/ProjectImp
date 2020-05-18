import * as tslib_1 from "tslib";
import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConfigService } from '../config/config.service';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { AuthService } from '../config/auth.service';
import { HttpClient } from '@angular/common/http';
import { FileuploadService } from '../config/fileupload.service';
import { Chart } from 'chart.js';
import { MatSort } from '@angular/material/sort';
let PhasechkComponent = class PhasechkComponent {
    constructor(configService, authService, http, uploadService) {
        this.configService = configService;
        this.authService = authService;
        this.http = http;
        this.uploadService = uploadService;
        this.displayedColumns = ['PEA_TR', 'SUBTYPECOD', 'Kva', 'location', 'Feeder', 'nMeter', 'nSMRT', 'status', 'peaName', 'PEA_Meter'];
        this.displayedColumns1 = ['PEA_Meter', 'PhaseMeterGis', 'LOCATION'];
        this.condition = 0;
        this.peaCode = "";
        this.peaname = {};
        this.peaname2 = [];
        this.meterdata = [];
        this.currentPea = "";
        this.currentMatherPea = "";
        this.Statuss = [
            { value: '-' },
            { value: 'ปรับปรุงระบบจำหน่ายแรงต่ำใน GIS แล้ว' },
            { value: 'สำรวจแล้วเสร็จรอนำเข้า GIS' },
            { value: 'นำเข้าเฟสมิเตอร์ใน GIS แล้ว' },
        ];
        this.selDataType = 1;
        this.selDataType2 = 1;
        this.dataLabel = 'หม้อแปลง';
        this.selPea = '';
        this.selPeaName = 'กฟน.2';
        this.selPeapeaCode = '';
        this.DataType = [
            { value: 1, viewValue: '%หม้อแปลง' },
            { value: 2, viewValue: '%มิเตอร์' },
            { value: 3, viewValue: 'จำนวนหม้อแปลง' },
            { value: 4, viewValue: 'จำนวนมิเตอร์' },
        ];
        this.DataType2 = [
            { value: 1, viewValue: 'ข้อมูลหม้อแปลง' },
            { value: 2, viewValue: 'ข้อมูลมิเตอร์' },
        ];
        this.dataSource = new MatTableDataSource();
        this.dataSource1 = new MatTableDataSource();
        this.dataSource2 = new MatTableDataSource();
        this.getTrData = () => {
            this.configService.getTr2('phase/TR.php?peaCode0=' + this.peaCode)
                //this.configService.getTr('TR.php?condition='+this.condition+'&peaCode0='+'B00000')
                .subscribe(res => {
                this.dataSource.data = res;
            });
        };
        this.getMtData = (PEA_TR) => {
            this.configService.getmeterdata3('phase/Meter.php?PEA_TR=' + PEA_TR)
                //this.configService.getTr('TR.php?condition='+this.condition+'&peaCode0='+'B00000')
                .subscribe(res => {
                this.dataSource1.data = res;
            });
        };
    }
    ngOnInit() {
        this.peaCode = localStorage.getItem('peaCode');
        this.peaNum = this.peaCode.substr(1, 5);
        this.selPeapeaCode = this.peaCode.substr(0, 4);
        this.getpeaList();
        this.getpeaList2();
        this.callData();
        this.getinfo();
        //this.getMeterData();
        this.dataSource.paginator = this.paginator;
        this.dataSource1.paginator = this.paginator1;
        this.dataSource2.paginator = this.paginator2;
        this.dataSource.sort = this.sort;
        this.dataSource1.sort = this.sort1;
        this.dataSource2.sort = this.sort2;
    }
    callData() {
        this.getTrData();
        this.getStatus();
        this.getJobProgressPea2();
        this.getProgreesMnt();
    }
    getinfo() {
        this.configService.postdata2('phase/rdInfo.php', {}).subscribe((data => {
            if (data['status'] == 1) {
                this.dataDate = data['data'][0].info;
                console.log(data);
            }
            else {
                alert(data['data']);
            }
        }));
    }
    applyFilter(filterValue) {
        this.dataSource.filter = (filterValue).trim().toLowerCase();
    }
    selectStatus(event) {
        this.configService.postdata2('phase/wristatus.php', { TRNumber: event.value[1].PEA_TR, status: event.value[0], user: localStorage.getItem('name') }).subscribe((data => {
            if (data['status'] == 1) {
                this.callData();
            }
            else {
                alert(data['data']);
            }
        }));
    }
    getpeaList() {
        this.configService.postdata2('phase/rdpeaall.php', {}).subscribe((data => {
            if (data['status'] == 1) {
                data['data'].forEach(element => {
                    this.peaname[element.peaCode] = element.peaName;
                });
                this.currentPea = this.peaname[this.peaCode.substring(0, 6)];
                if (this.peaCode == "B00000") {
                    this.currentMatherPea = this.peaname[this.peaCode.substring(0, 6)];
                }
                else {
                    this.currentMatherPea = this.peaname[this.peaCode.substring(0, 4)];
                }
            }
            else {
                alert(data['data']);
            }
        }));
    }
    getpeaList2() {
        this.configService.postdata2('phase/rdpeaall2.php', {}).subscribe((data => {
            if (data['status'] == 1) {
                //console.log(data['data']);
                this.peaname2 = data['data'];
                //console.log(this.peaname);
            }
            else {
                alert(data['data']);
            }
        }));
    }
    onSubmit() {
        this.configService.getmeterdata2('serchmeter.php?PEA_Meter=' + this.registerForm.value.PEAMeter)
            //this.configService.getTr('TR.php?condition='+this.condition+'&peaCode0='+'B00000')
            .subscribe(res => {
            this.registerForm.resetForm();
            this.dataSource2.data = res;
        });
    }
    getProgreesMnt() {
        this.configService.postdata2('phase/rdJobProgressPea3.php', { peaCode: this.selPeapeaCode }).subscribe((data => {
            var totalTr = 0;
            var totalMeter = 0;
            var mnt = ['11/62', '12/62', '1/63', '2/63', '3/63', '4/63', '5/63', '6/63', '7/63', '8/63', '9/63'];
            var i;
            var pltLabel = '';
            var trPln = [];
            var trAcc = 0;
            var trDone = [];
            var meterDone = [];
            var NtrDone = [];
            var NmeterDone = [];
            var meterAcc = 0;
            var lastMnt = 0;
            var peaTitle = '';
            var dataPlt = [];
            var plnLabel = '';
            if (this.selPeapeaCode == 'B000') {
                peaTitle = "กฟน.2 และ กฟฟ.ในสังกัด";
            }
            else {
                peaTitle = this.peaname[this.selPeapeaCode.substring(0, 4)] + "และ กฟฟ.ในสังกัด";
            }
            data['data'].forEach(element => {
                totalTr = totalTr + Number(element.totalTr);
                totalMeter = totalMeter + Number(element.totalMeter);
            });
            if (this.selDataType < 3) {
                plnLabel = '%แผนงาน';
                for (i = 1; i < 12; i++) {
                    trAcc = trAcc + 100 / 11;
                    trPln.push((trAcc / 100 * 100).toFixed(2));
                }
            }
            else if (this.selDataType == 3) {
                plnLabel = 'แผนงาน';
                for (i = 1; i < 12; i++) {
                    trAcc = trAcc + totalTr / 11;
                    trPln.push((trAcc / 100 * 100).toFixed(0));
                }
            }
            else if (this.selDataType == 4) {
                plnLabel = 'แผนงาน';
                for (i = 1; i < 12; i++) {
                    trAcc = trAcc + totalMeter / 11;
                    trPln.push((trAcc / 100 * 100).toFixed(0));
                }
            }
            trAcc = 0;
            meterAcc = 0;
            data['data'].forEach(element => {
                if (Number(element.mnt) - lastMnt > 1) {
                    for (i = 0; i < Number(element.mnt) - lastMnt - 1; i++) {
                        trDone.push((trAcc / totalTr * 100).toFixed(2));
                        meterDone.push((meterAcc / totalMeter * 100).toFixed(2));
                        NtrDone.push((trAcc).toFixed(2));
                        NmeterDone.push((meterAcc).toFixed(2));
                    }
                }
                if (element.mnt != "0") {
                    trAcc = trAcc + Number(element.nComp);
                    trDone.push((trAcc / totalTr * 100).toFixed(2));
                    NtrDone.push(trAcc);
                    meterAcc = meterAcc + Number(element.nMeter);
                    meterDone.push((meterAcc / totalMeter * 100).toFixed(2));
                    NmeterDone.push(meterAcc);
                }
                lastMnt = Number(element.mnt);
            });
            if (this.selDataType == 1) {
                dataPlt = trDone;
                pltLabel = '%หม้อแปลง';
            }
            else if (this.selDataType == 2) {
                dataPlt = meterDone;
                pltLabel = '%มิเตอร์';
            }
            else if (this.selDataType == 3) {
                dataPlt = NtrDone;
                pltLabel = 'จำนวนหม้อแปลง';
            }
            else if (this.selDataType == 4) {
                dataPlt = NmeterDone;
                pltLabel = 'จำนวนมิเตอร์';
            }
            var chartData = {
                labels: mnt,
                datasets: [{
                        type: 'line',
                        label: plnLabel,
                        borderColor: "#5689ff",
                        borderWidth: 2,
                        fill: false,
                        data: trPln
                    }, {
                        type: 'line',
                        label: pltLabel,
                        borderColor: "#ff5689",
                        borderWidth: 2,
                        fill: false,
                        data: dataPlt
                    },
                ]
            };
            if (this.progressLine)
                this.progressLine.destroy();
            this.progressLine = new Chart('progressLine', {
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
                                    beginAtZero: true,
                                    userCallback: function (value, index, values) {
                                        value = value.toString();
                                        value = value.split(/(?=(?:...)*$)/);
                                        value = value.join(',');
                                        return value;
                                    }
                                },
                            }]
                    },
                    title: {
                        display: true,
                        text: "ความก้าวหน้านำเข้าเฟสมิเตอร์ใน GIS ของ " + peaTitle
                    }
                }
            });
        }));
    }
    getStatus() {
        this.configService.postdata2('phase/rdstat.php', { peaCode: localStorage.getItem('peaCode'), selDataType: this.selDataType2 }).subscribe((data => {
            if (data['status'] == 1) {
                this.PEA_TR0 = Number(data['data'][0]);
                this.PEA_TR1 = Number(data['data'][1]);
                this.PEA_TR2 = Number(data['data'][2]);
                this.PEA_TR3 = Number(data['data'][3]);
                this.PEA_TR6 = Number(data['data'][4]);
                this.PEA_TR7 = Number(data['data'][5]);
                this.PEA_TR4 = Number(data['data'][0]) + Number(data['data'][2]); //Total TR
                this.PEA_TR5 = Number(data['data'][3]) + Number(data['data'][1]); // Survey
                this.PEA_TR1perPEA_TR0 = Number(data['data'][1]) / Number(data['data'][0]) * 100;
                this.PEA_TR3perPEA_TR0 = Number(data['data'][3]) / Number(data['data'][2]) * 100;
                this.PEA_TR2perPEA_TR0 = this.PEA_TR5 / this.PEA_TR4 * 100;
                if (this.myDonut1)
                    this.myDonut1.destroy();
                this.myDonut1 = new Chart('myDonut1', {
                    type: 'doughnut',
                    data: {
                        datasets: [{
                                data: [this.PEA_TR1perPEA_TR0.toFixed(2), (100 - this.PEA_TR1perPEA_TR0).toFixed(2)
                                ],
                                backgroundColor: [
                                    "#FFC300", "#a68fe8",
                                ],
                            }],
                        labels: [
                            ' ผลการนำเข้าเฟสมิเตอร์หม้อแปลง 1 เฟส : ' + [this.PEA_TR1perPEA_TR0.toFixed(2)] + ' %',
                            ' ' + [(100 - this.PEA_TR1perPEA_TR0).toFixed(2)] + ' %',
                        ]
                    }, plugins: [{
                            beforeDraw: function (chart) {
                                var width = chart.chart.width, height = chart.chart.height, ctx = chart.chart.ctx;
                                //text =chart.config.data['data']set[0].data[0];
                                ctx.restore();
                                var fontSize = (height / 120).toFixed(2);
                                ctx.font = fontSize + "em sans-serif";
                                ctx.textBaseline = "middle";
                                ctx.fillStyle = "#FFFEFF";
                                var text = chart.config.data.datasets[0].data[0] + "%", textX = Math.round((width - ctx.measureText(text).width) / 2), textY = height / 2;
                                ctx.fillText(text, textX, textY);
                                ctx.save();
                            }
                        }],
                    options: {
                        // Elements options apply to all of the options unless overridden in a dataset
                        // In this case, we are setting the border of each horizontal bar to be 2px wide
                        tooltips: {
                            enabled: true,
                            mode: 'single',
                            callbacks: {
                                label: function (tooltipItems, data) {
                                    return data.labels[tooltipItems.index];
                                }
                            }
                        },
                        elements: {
                            rectangle: {
                                borderWidth: 2,
                            }
                        },
                        responsive: false,
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
                if (this.myDonut2)
                    this.myDonut2.destroy();
                this.myDonut2 = new Chart('myDonut2', {
                    type: 'doughnut',
                    data: {
                        datasets: [{
                                data: [this.PEA_TR2perPEA_TR0.toFixed(2), (100 - this.PEA_TR2perPEA_TR0).toFixed(2)
                                ],
                                backgroundColor: [
                                    "#FFC300", "#a68fe8",
                                ],
                            }],
                        labels: [
                            ' ผลการนำเข้าเฟสมิเตอร์หม้อแปลงรวม : ' + [this.PEA_TR2perPEA_TR0.toFixed(2)] + ' %',
                            ' ' + [(100 - this.PEA_TR2perPEA_TR0).toFixed(2)] + ' %',
                        ]
                    }, plugins: [{
                            beforeDraw: function (chart) {
                                var width = chart.chart.width, height = chart.chart.height, ctx = chart.chart.ctx;
                                //text =chart.config.data['data']set[0].data[0];
                                ctx.restore();
                                var fontSize = (height / 120).toFixed(2);
                                ctx.font = fontSize + "em sans-serif";
                                ctx.textBaseline = "middle";
                                ctx.fillStyle = "#FFFEFF";
                                var text = chart.config.data.datasets[0].data[0] + "%", textX = Math.round((width - ctx.measureText(text).width) / 2), textY = height / 2;
                                ctx.fillText(text, textX, textY);
                                ctx.save();
                            }
                        }],
                    options: {
                        // Elements options apply to all of the options unless overridden in a dataset
                        // In this case, we are setting the border of each horizontal bar to be 2px wide
                        tooltips: {
                            enabled: true,
                            mode: 'single',
                            callbacks: {
                                label: function (tooltipItems, data) {
                                    return data.labels[tooltipItems.index];
                                }
                            }
                        },
                        elements: {
                            rectangle: {
                                borderWidth: 2,
                            }
                        },
                        responsive: false,
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
                if (this.myDonut3)
                    this.myDonut3.destroy();
                this.myDonut3 = new Chart('myDonut3', {
                    type: 'doughnut',
                    data: {
                        datasets: [{
                                data: [this.PEA_TR3perPEA_TR0.toFixed(2), (100 - this.PEA_TR3perPEA_TR0).toFixed(2)
                                ],
                                backgroundColor: [
                                    "#FFC300", "#ea73b2",
                                ],
                            }],
                        labels: [
                            ' ผลการนำเข้าเฟสมิเตอร์หม้อแปลง 3 เฟส : ' + [this.PEA_TR3perPEA_TR0.toFixed(2)] + ' %',
                            ' ' + [(100 - this.PEA_TR3perPEA_TR0).toFixed(2)] + ' %',
                        ]
                    }, plugins: [{
                            beforeDraw: function (chart) {
                                var width = chart.chart.width, height = chart.chart.height, ctx = chart.chart.ctx;
                                //text =chart.config.data['data']set[0].data[0];
                                ctx.restore();
                                var fontSize = (height / 120).toFixed(2);
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
                        tooltips: {
                            enabled: true,
                            mode: 'single',
                            callbacks: {
                                label: function (tooltipItems, data) {
                                    return data.labels[tooltipItems.index];
                                }
                            }
                        },
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
            }
            else {
                alert(data['data']);
            }
        }));
    }
    exportAsXLSX() {
        this.configService.exportAsExcelFile(this.dataSource.data, 'TRdata');
    }
    exportAsXLSX2() {
        this.configService.exportAsExcelFile(this.dataSource1.data, 'MeterData');
    }
    getJobProgressPea2() {
        //จำนวนงานคงค้าง %เบิกจ่าย
        var selData2;
        if (this.selDataType == 1 || this.selDataType == 3) {
            selData2 = 1;
        }
        else {
            selData2 = 2;
        }
        //rdJobProgressPea2
        this.configService.postdata2('phase/loadGis.php', { peaCode: this.selPeapeaCode, selDataType: selData2 }).subscribe((data => {
            if (data['status'] == 1) {
                var Pea = [];
                var pComp = [];
                //var pComp2 = [];
                var chartData;
                var pIn = [];
                var pIn2 = [];
                var trgArry = [];
                var peaTitle = '';
                var mntList = [11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9];
                var d = new Date();
                var n = d.getMonth();
                var trg;
                if (this.selPeapeaCode == 'B000') {
                    peaTitle = "กฟน.2 และ กฟฟ.ในสังกัด";
                }
                else {
                    peaTitle = this.peaname[this.selPeapeaCode.substring(0, 4)] + "และ กฟฟ.ในสังกัด";
                }
                var chartTitle;
                var AccNComp = 0;
                var AccNIn = 0;
                var AccNIn2 = 0;
                var AccTotal = 0;
                var dataName = '';
                var progressNow = {};
                var TargetNow = {};
                data['data2'].forEach(element => {
                    progressNow[element.Pea] = Number(element.nComp);
                    TargetNow[element.Pea] = Number(element.totalTr);
                });
                data['data'].forEach(element => {
                    AccNComp = AccNComp + progressNow[element.Pea];
                    AccNIn = AccNIn + Number(element.nInp);
                    AccNIn2 = AccNIn2 + Number(element.nInp2);
                    Pea.push(this.peaname["B" + element.Pea]);
                    AccTotal = AccTotal + TargetNow[element.Pea];
                    if (this.selDataType < 3) {
                        //trg = 100 / 11 * (mntList.indexOf(n + 1) + 1);
                        trg = 36.36 + ((mntList.indexOf(n + 1) + 1) - 4) * 10.61;
                        trgArry.push(trg.toFixed(2));
                        pComp.push((progressNow[element.Pea] / TargetNow[element.Pea] * 100).toFixed(2));
                        pIn.push((Number(element.nInp) / TargetNow[element.Pea] * 100).toFixed(2));
                        pIn2.push((Number(element.nInp2) / TargetNow[element.Pea] * 100).toFixed(2));
                    }
                    else {
                        pComp.push(progressNow[element.Pea]);
                        pIn.push((Number(element.nInp)));
                        pIn2.push((Number(element.nInp2)));
                        //trg = 100 / 11 * (mntList.indexOf(n + 1) + 1);
                        trg = TargetNow[element.Pea] * (36.36 + ((mntList.indexOf(n + 1) + 1) - 4) * 10.61) / 100;
                        trgArry.push(trg.toFixed(0));
                    }
                });
                /*
                if (this.selDataType <3) {
                  trg = 100 / 11 * (mntList.indexOf(n + 1) + 1);
                  trgArry.push(trg.toFixed(2));
                  pComp.push((Number(AccNComp) / Number(AccTotal) * 100).toFixed(2));
                  pIn.push((Number(AccNIn) / Number(AccTotal) * 100).toFixed(2));
                  pIn2.push((Number(AccNIn2) / Number(AccTotal) * 100).toFixed(2));
                }else{
                  trg = AccTotal / 11 * (mntList.indexOf(n + 1) + 1);
                  trgArry.push(trg.toFixed(0));
                  pComp.push(Number(AccNComp));
                  pIn.push(Number(AccNIn));
                  pIn2.push(Number(AccNIn2));
                }
                */
                //Pea.push("รวม");
                if (this.selDataType == 1) {
                    dataName = '%หม้อแปลง';
                    chartTitle = '%ผลการดำเนินการด้านหม้อแปลง ' + peaTitle;
                }
                else if (this.selDataType == 2) {
                    dataName = '%มิเตอร์';
                    chartTitle = '%ผลการดำเนินการด้านมิเตอร์ ' + peaTitle;
                }
                else if (this.selDataType == 3) {
                    dataName = 'จำนวนหม้อแปลง';
                    chartTitle = 'ผลการดำเนินการด้านหม้อแปลง ' + peaTitle;
                }
                else if (this.selDataType == 4) {
                    dataName = 'จำนวนมิเตอร์';
                    chartTitle = 'ผลการดำเนินการด้านมิเตอร์ ' + peaTitle;
                }
                this.Pln = AccTotal;
                this.result = AccNComp;
                this.inpro = AccNIn;
                if (this.selDataType == 1) {
                    chartData = {
                        type: 'bar',
                        labels: Pea,
                        datasets: [
                            {
                                label: dataName + '-แรงต่ำนำเข้า GIS',
                                data: pIn2,
                                backgroundColor: '#f8328b',
                            },
                            {
                                label: dataName + '-มิเตอร์รอนำเข้า GIS',
                                data: pIn,
                                backgroundColor: '#07CCD6',
                            },
                            {
                                type: 'bar',
                                label: dataName + '-มิเตอร์นำเข้า GIS',
                                data: pComp,
                                backgroundColor: '#DAF7A6',
                            },
                            {
                                type: 'line',
                                label: '%แผนงาน',
                                data: trgArry,
                                //steppedLine: true,
                                //backgroundColor: '#07CCD6',
                                borderColor: '#5689ff',
                                borderWidth: 2,
                                fill: false,
                            }
                        ]
                    };
                }
                else if (this.selDataType == 2) {
                    chartData = {
                        type: 'bar',
                        labels: Pea,
                        datasets: [
                            {
                                label: dataName + 'รอนำเข้า GIS',
                                data: pIn,
                                backgroundColor: '#07CCD6',
                            },
                            {
                                type: 'bar',
                                label: dataName + 'นำเข้า GIS',
                                data: pComp,
                                backgroundColor: '#DAF7A6',
                            },
                            {
                                type: 'line',
                                label: '%แผนงาน',
                                data: trgArry,
                                //steppedLine: true,
                                //backgroundColor: '#07CCD6',
                                borderColor: '#5689ff',
                                borderWidth: 2,
                                fill: false,
                            }
                        ]
                    };
                }
                else if (this.selDataType == 3) {
                    chartData = {
                        type: 'bar',
                        labels: Pea,
                        datasets: [
                            {
                                label: dataName + '-แรงต่ำนำเข้า GIS',
                                data: pIn2,
                                backgroundColor: '#f8328b',
                            },
                            {
                                label: dataName + '-มิเตอร์รอนำเข้า GIS',
                                data: pIn,
                                backgroundColor: '#07CCD6',
                            },
                            {
                                type: 'bar',
                                label: dataName + '-มิเตอร์นำเข้า GIS',
                                data: pComp,
                                backgroundColor: '#DAF7A6',
                            },
                            {
                                type: 'bar',
                                label: 'แผนงาน',
                                data: trgArry,
                                //steppedLine: true,
                                backgroundColor: '#5689ff',
                                //borderColor: '#5689ff',
                                borderWidth: 2,
                                fill: false,
                            }
                        ]
                    };
                }
                else {
                    chartData = {
                        type: 'bar',
                        labels: Pea,
                        datasets: [
                            {
                                label: dataName + 'รอนำเข้า GIS',
                                data: pIn,
                                backgroundColor: '#07CCD6',
                            },
                            {
                                type: 'bar',
                                label: dataName + 'นำเข้า GIS',
                                data: pComp,
                                backgroundColor: '#DAF7A6',
                            },
                            {
                                type: 'bar',
                                label: 'แผนงาน',
                                data: trgArry,
                                //steppedLine: true,
                                backgroundColor: '#5689ff',
                                //borderColor: '#5689ff',
                                borderWidth: 2,
                                fill: false,
                            }
                        ]
                    };
                }
                if (this.progressBar)
                    this.progressBar.destroy();
                this.progressBar = new Chart('progressBar', {
                    type: 'bar',
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
                        title: {
                            display: true,
                            text: chartTitle
                        },
                        scales: {
                            yAxes: [{
                                    ticks: {
                                        beginAtZero: true,
                                        userCallback: function (value, index, values) {
                                            value = value.toString();
                                            value = value.split(/(?=(?:...)*$)/);
                                            value = value.join(',');
                                            return value;
                                        }
                                    },
                                }]
                        }
                    },
                });
            }
            else {
                alert(data['data']);
            }
        }));
    }
    selectPea(event) {
        this.selPea = event.value[0];
        this.selPeaName = event.value[2];
        this.selPeapeaCode = event.value[1];
        this.getJobProgressPea2();
        this.getProgreesMnt();
        this.currentMatherPea = this.peaname[this.selPeapeaCode];
    }
    selectData(event) {
        this.selDataType = event.value;
        this.getJobProgressPea2();
        this.getProgreesMnt();
        if (this.selDataType == 1 || this.selDataType == 3) {
            this.dataLabel = 'หม้อแปลง';
        }
        else {
            this.dataLabel = 'มิเตอร์';
        }
    }
    selectData2(event) {
        if (this.selDataType2 != event.value) {
            this.selDataType2 = event.value;
            if (this.selDataType2 == 1) {
                this.dataLabel = 'หม้อแปลง';
            }
            else {
                this.dataLabel = 'มิเตอร์';
            }
            this.getStatus();
        }
    }
};
tslib_1.__decorate([
    ViewChild('f', { static: false }),
    tslib_1.__metadata("design:type", NgForm)
], PhasechkComponent.prototype, "registerForm", void 0);
tslib_1.__decorate([
    ViewChild(MatPaginator, { static: true }),
    tslib_1.__metadata("design:type", MatPaginator)
], PhasechkComponent.prototype, "paginator", void 0);
tslib_1.__decorate([
    ViewChild(MatSort, { static: true }),
    tslib_1.__metadata("design:type", MatSort)
], PhasechkComponent.prototype, "sort", void 0);
tslib_1.__decorate([
    ViewChild('paginator1', { static: true }),
    tslib_1.__metadata("design:type", MatPaginator)
], PhasechkComponent.prototype, "paginator1", void 0);
tslib_1.__decorate([
    ViewChild('sort1', { static: true }),
    tslib_1.__metadata("design:type", MatSort)
], PhasechkComponent.prototype, "sort1", void 0);
tslib_1.__decorate([
    ViewChild('paginator2', { static: false }),
    tslib_1.__metadata("design:type", MatPaginator)
], PhasechkComponent.prototype, "paginator2", void 0);
tslib_1.__decorate([
    ViewChild('sort2', { static: false }),
    tslib_1.__metadata("design:type", MatSort)
], PhasechkComponent.prototype, "sort2", void 0);
PhasechkComponent = tslib_1.__decorate([
    Component({
        selector: 'app-phasechk',
        templateUrl: './phasechk.component.html',
        styleUrls: ['./phasechk.component.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [ConfigService, AuthService, HttpClient, FileuploadService])
], PhasechkComponent);
export { PhasechkComponent };
//# sourceMappingURL=phasechk.component.js.map