import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfigService } from '../config/config.service';
import { Chart } from 'chart.js';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { jobRemain} from '../model/user.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-roic',
  templateUrl: './roic.component.html',
  styleUrls: ['./roic.component.scss']
})
export class RoicComponent implements OnInit {
  budjets= [
    {value: ['I-60-B','.BY.'], viewValue: 'I60.BY'},
    {value: ['I-62-B','.BY.'], viewValue: 'I62.BY'},
    {value: ['I-62-B','.TR.'], viewValue: 'I62.TR'},
  ];
  peaname = {};
  peaname2 = [];
  selBudjet=['I-62-B','.TR.'];
  selPea = '';
  selPeaName = 'กฟน.2';
  selPeapeaCode = '';
  currentMatherPea = "";
  currentPea = "";
  peaCode = "";
  peaNum: string;
  progressBar: Chart;
  progressBarN2: Chart;
  progressWorkCostBar:Chart;
  progressMatCostBar:Chart;
  trBar: Chart;
  trBarN2: Chart;
  roicp={};
  kvaPlnTotal=0;
  kvaTotal=0;
  kvaD1Total=0;
  workCostActTRTotal:number;
  workCostActBYTotal:number;
  workCostActTotal:number;
  workCostPlnTotal:number;
  matCostActTotal:number;
  matCostPlnTotal:number;  
  displayedColumns = ['wbs', 'jobName', 'workCostPln', 'workCostAct','percent','jobStatus', 'userStatus'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public dataSource = new MatTableDataSource<jobRemain>();

  constructor(private configService: ConfigService, private http: HttpClient, ) {}

  ngOnInit() {
    this.peaCode = localStorage.getItem('peaCode');
    this.peaNum = this.peaCode.substr(1, 5);
    this.selPeapeaCode = this.peaCode.substr(0, 4);
    this.getpeaList();
    this.getpeaList2();
   

    this.dataSource.paginator = this.paginator;

  }
  getRemianData = () => {

    this.configService.getJobRemain('roic/rdJobRemain.php?filter1='+this.selBudjet[0]+'&filter2='+this.selBudjet[1]+'&peaCode='+this.selPeapeaCode)
      //this.configService.getTr('TR.php?condition='+this.condition+'&peaCode0='+'B00000')
      .subscribe(res => {
        this.dataSource.data = res as jobRemain[];
      })
  }
  applyFilter(filterValue: string) {
    
    this.dataSource.filter = (filterValue).trim().toLowerCase();
  }
  callData(){
    this.getJobProgressPea();
    this.getTrPea();
    this.getBudgetPea();
    this.getRemianData();
  }
  getpeaList() {
    this.configService.postdata('phase/rdpeaall.php', {}).subscribe((data => {
      if (data.status == 1) {
        data.data.forEach(element => {
          this.peaname[element.peaCode] = element.peaName;

        });
        this.callData();
        this.currentPea = this.peaname[this.peaCode.substring(0, 6)];
        if (this.peaCode == "B00000") {
          this.currentMatherPea = this.peaname[this.peaCode.substring(0, 6)];
        } else {
          this.currentMatherPea = this.peaname[this.peaCode.substring(0, 4)];
        }

      } else {
        alert(data.data);
      }

    }))

  }
  getpeaList2() {
    this.configService.postdata('phase/rdpeaall2.php', {}).subscribe((data => {
      if (data.status == 1) {
        //console.log(data.data);
        this.peaname2 = data.data;
        //console.log(this.peaname);
      } else {
        alert(data.data);
      }

    }))
    
  }
  selectPea(event) {
    this.selPea = event.value[0];
    this.selPeaName = event.value[2];
    this.selPeapeaCode = event.value[1];
    this.currentMatherPea = this.peaname[this.selPeapeaCode];
    this.getRemianData();

  }
  getJobProgressPea() {
    //จำนวนงานคงค้าง %เบิกจ่าย
    this.getRoicP();
    this.configService.postdata('roic/rdRoicProgress.php', { peaCode: 'B000'}).subscribe((data => {
      if (data.status == 1) {
        var Pea = [];
        var kva = [];
        var kvaD1 = [];
        var chartData: any;
        var chartTitle: string;
        this.kvaTotal=0;
        this.kvaD1Total=0;
        var dataName='';
        var i=0;
        var kva2={};
        var kvaPln=[];
        data.dataD1.forEach(element => {
          this.kvaD1Total=this.kvaTotal+Number(element.totaltr);      
          kva2[element.Pea]=Number(element.totaltr);
        });
        console.log(this.peaname);
        data.data.forEach(element => {
          this.kvaTotal=this.kvaTotal+Number(element.totaltr);      
          Pea.push(this.peaname["B" + element.Pea]);
          console.log("B" + element.Pea);
          console.log(this.peaname["B" + element.Pea]);
          kva.push(Number(element.totaltr));
          if(kva2[element.Pea]){
            kvaD1.push(Number(element.totaltr)-kva2[element.Pea]);
          }else{
            kvaD1.push(Number(element.totaltr));
          }
          kvaPln.push(this.roicp[element.Pea]);
        });

      
        chartTitle = 'ผลการดำเนินการปรับปรุงและติดตั้งหม้อแปลงไฟฟ้าและระบบจำหน่ายแรงต่ำ กฟฟ. ในสังกัด';
          chartData = {
            type: 'bar',
            labels: Pea,
            datasets: [
              {
                type: 'bar',
                label: 'แผนงาน',
                data: kvaPln,
                backgroundColor: '#f7a6da',
              },
              {
                label: 'ผลดำเนินการ(D1-F4)',
                data: kva,
                backgroundColor: '#daf7a6',
              },
              {
                type: 'bar',
                label: 'ผลดำเนินการ(D2-F4)',
                data: kvaD1,
                backgroundColor: '#a6daf7',
              },

            ]
          };




        if (this.progressBar) this.progressBar.destroy();

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
                  userCallback: function(value, index, values) {
                    value = value.toString();
                    value = value.split(/(?=(?:...)*$)/);
                    value = value.join(',');
                    return value;
                }
                },
                scaleLabel: {
                  display: true,
                  labelString: 'kVA'
                },
   
              }]
            },
            tooltips: {
              callbacks: {
                  label: function(tooltipItem, data) {
                      return tooltipItem.yLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); }, },
           },
          },

        });


        chartTitle = 'ผลการดำเนินการปรับปรุงและติดตั้งหม้อแปลงไฟฟ้าและระบบจำหน่ายแรงต่ำ กฟน.2';
        chartData = {
          type: 'bar',
          labels: ['กฟน.2'],
          datasets: [
            {
              type: 'bar',
              label: 'แผนงานรวมปี 62',
              data: [49520],
              backgroundColor: '#f7a6da',
            },
            {
              label: 'ผลดำเนินการ(D1-F4)',
              data: [this.kvaTotal],
              backgroundColor: '#daf7a6',
            },
            {
              type: 'bar',
              label: 'ผลดำเนินการ(D2-F4)',
              data: [this.kvaTotal-this.kvaD1Total],
              backgroundColor: '#a6daf7',
            },

          ]
        };
        if (this.progressBarN2) this.progressBarN2.destroy();

        this.progressBarN2 = new Chart('progressBarN2', {
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
                  userCallback: function(value, index, values) {
                    value = value.toString();
                    value = value.split(/(?=(?:...)*$)/);
                    value = value.join(',');
                    return value;
                }
                },
                scaleLabel: {
                  display: true,
                  labelString: 'kVA'
                },   
              }]
            },
            tooltips: {
              callbacks: {
                  label: function(tooltipItem, data) {
                      return tooltipItem.yLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); }, },
           },
   
          },

        });

      } else {
        alert(data.data);
      }

    }));
  }
  getTrPea() {
    //จำนวนงานคงค้าง %เบิกจ่าย
    this.getRoicP();
    this.configService.postdata('roic/rdTrProgress.php', { peaCode: 'B000'}).subscribe((data => {
      if (data.status == 1) {
        var Pea = [];
        var workCostActTR = [];
        var workCostPlnTR = [];
        var workCostActBY = [];
        this.workCostActTRTotal=0;
        this.workCostActBYTotal=0;
        var chartData: any;
        var chartTitle: string;


       
        data.data.forEach(element => {
          this.workCostActTRTotal=this.workCostActTRTotal+Number(element.workCostActTR);
          this.workCostActBYTotal=this.workCostActBYTotal+Number(element.workCostActBY);     
          Pea.push(this.peaname["B" + element.Pea]);
          workCostActTR.push(Number(element.workCostActTR));
          workCostPlnTR.push(Number(element.workCostPlnTR));
          workCostActBY.push(Number(element.workCostActBY));
  
        });

        chartTitle = 'ผลการเบิกจ่ายค่าใช้จ่ายหน้างานงบ I-62.TR กฟฟ. ในสังกัด';
          chartData = {
            type: 'bar',
            labels: Pea,
            datasets: [
              {
                label: 'คชจ.หน้างานอนุมัติ งบ TR',
                data: workCostPlnTR,
                backgroundColor: '#f7a6da',
              },
              {
                label: 'ผลการเบิกงบ TR',
                data: workCostActTR,
                backgroundColor: '#daf7a6',
              },
              {
                label: 'รอโอนงบจากงาน BY',
                data: workCostActBY,
                backgroundColor: '#a6daf7',
              },

            ]
          };




        if (this.trBar) this.trBar.destroy();

        this.trBar = new Chart('trBar', {
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
            onClick:function(event,value){
                console.log(value[0]._view.label);
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
                  userCallback: function(value, index, values) {
                    value = value.toString();
                    value = value.split(/(?=(?:...)*$)/);
                    value = value.join(',');
                    return value;
                }
                },
                scaleLabel: {
                  display: true,
                  labelString: 'บาท'
                },
   
              }]
            },
            tooltips: {
              callbacks: {
                label: function(tooltipItem, data) {
                    var label = data.datasets[tooltipItem.datasetIndex].label || '';

                    if (label) {
                        label += ': ';
                    }
                    label += Math.round(tooltipItem.yLabel * 100) / 100;
                    return label;
                }
            }
           },
          },

        });


        chartTitle = 'ผลการเบิกจ่ายค่าใช้จ่ายหน้างานงบ I-62.TR กฟน.2';
        chartData = {
          type: 'bar',
          labels: ['กฟน.2'],
          datasets: [
            {
              type: 'bar',
              label: 'เป้าหมายการเบิกจ่าย',
              data: [30e6],
              backgroundColor: '#f7a6da',
            },
            {
              label: 'ผลการเบิกงบ TR',
              data: [this.workCostActTRTotal],
              backgroundColor: '#daf7a6',
            },
            {
              type: 'bar',
              label: 'รอโอนงบจากงาน BY',
              data: [this.workCostActBYTotal],
              backgroundColor: '#a6daf7',
            },

          ]
        };
        if (this.trBarN2) this.trBarN2.destroy();

        this.trBarN2 = new Chart('trBarN2', {
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
                  userCallback: function(value, index, values) {
                    value = value.toString();
                    value = value.split(/(?=(?:...)*$)/);
                    value = value.join(',');
                    return value;
                }
                },
                scaleLabel: {
                  display: true,
                  labelString: 'บาท'
                },   
              }]
            },
            tooltips: {
              callbacks: {
                label: function(tooltipItem, data) {
                    var label = data.datasets[tooltipItem.datasetIndex].label || '';

                    if (label) {
                        label += ': ';
                    }
                    label += Math.round(tooltipItem.yLabel * 100) / 100;
                    return label;
                }
            }
           },
          },

        });

      } else {
        alert(data.data);
      }

    }));
  }
  getBudgetPea() {
    //จำนวนงานคงค้าง %เบิกจ่าย
    this.getRoicP();
    this.configService.postdata('roic/rdBudgetProgress.php', { peaCode: 'B000'}).subscribe((data => {
      if (data.status == 1) {
        var Pea = [];
        var workCostAct = [];
        var workCostPln = [];
        var matCostAct = [];
        var matCostPln = [];
        var chartData: any;
        var chartTitle: string;
        this.workCostActTotal=0;
        this.workCostPlnTotal=0;
        this.matCostActTotal=0;
        this.matCostPlnTotal=0;

       
        data.data.forEach(element => {
          Pea.push(this.peaname["B" + element.Pea]);
          workCostAct.push(Number(element.workCostAct));
          workCostPln.push(Number(element.workCostPln));
          matCostAct.push(Number(element.matCostAct)+Number(element.matCostInAct));
          matCostPln.push(Number(element.matCostPln)+Number(element.matCostInPln));
          this.workCostActTotal=this.workCostActTotal+Number(element.workCostAct);
          this.workCostPlnTotal=this.workCostPlnTotal+Number(element.workCostPln);
          this.matCostActTotal=this.matCostActTotal+Number(element.matCostAct)+Number(element.matCostInAct);
          this.matCostPlnTotal=this.matCostPlnTotal+Number(element.matCostInPln);
  
        });

        chartTitle = 'ผลการเบิกจ่ายค่าใช้จ่ายหน้างาน ROIC กฟฟ. ในสังกัด';
          chartData = {
            type: 'bar',
            labels: Pea,
            datasets: [
              {
                label: 'คชจ.หน้างานอนุมัติ',
                data: workCostPln,
                backgroundColor: '#f7a6da',
              },
              {
                label: 'ผลการเบิกงบ',
                data: workCostAct,
                backgroundColor: '#daf7a6',
              },
              /*
              {
                label: 'รอโอนงบจากงาน BY',
                data: matCostPln,
                backgroundColor: '#a6daf7',
              },
              {
                label: 'รอโอนงบจากงาน BY',
                data: matCostAct,
                backgroundColor: '#a6daf7',
              },*/
            ]
          };




        if (this.progressWorkCostBar) this.progressWorkCostBar.destroy();

        this.progressWorkCostBar = new Chart('progressWorkCostBar', {
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
            onClick:function(event,value){
                console.log(value[0]._view.label);
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
                  userCallback: function(value, index, values) {
                    value = value.toString();
                    value = value.split(/(?=(?:...)*$)/);
                    value = value.join(',');
                    return value;
                }
                },
                scaleLabel: {
                  display: true,
                  labelString: 'บาท'
                },
   
              }]
            },
            tooltips: {
              callbacks: {
                label: function(tooltipItem, data) {
                    var label = data.datasets[tooltipItem.datasetIndex].label || '';

                    if (label) {
                        label += ': ';
                    }
                    label += Math.round(tooltipItem.yLabel * 100) / 100;
                    return label;
                }
            }
           },
          },

        });


        chartTitle = 'ผลการเบิกจ่ายค่าพัสดุ ROIC กฟฟ. ในสังกัด';
          chartData = {
            type: 'bar',
            labels: Pea,
            datasets: [
              {
                label: 'ค่าพัสดุอนุมัติ',
                data: matCostPln,
                backgroundColor: '#f7a6da',
              },
              {
                label: 'ผลการเบิกงบ',
                data: matCostAct,
                backgroundColor: '#daf7a6',
              },
              /*
              {
                label: 'รอโอนงบจากงาน BY',
                data: matCostPln,
                backgroundColor: '#a6daf7',
              },
              {
                label: 'รอโอนงบจากงาน BY',
                data: matCostAct,
                backgroundColor: '#a6daf7',
              },*/
            ]
          };




        if (this.progressMatCostBar) this.progressMatCostBar.destroy();

        this.progressMatCostBar = new Chart('progressMatCostBar', {
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
            onClick:function(event,value){
                console.log(value[0]._view.label);
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
                  userCallback: function(value, index, values) {
                    value = value.toString();
                    value = value.split(/(?=(?:...)*$)/);
                    value = value.join(',');
                    return value;
                }
                },
                scaleLabel: {
                  display: true,
                  labelString: 'บาท'
                },
   
              }]
            },
            tooltips: {
              callbacks: {
                label: function(tooltipItem, data) {
                    var label = data.datasets[tooltipItem.datasetIndex].label || '';

                    if (label) {
                        label += ': ';
                    }
                    label += Math.round(tooltipItem.yLabel * 100) / 100;
                    return label;
                }
            }
           },
          },

        });


      } else {
        alert(data.data);
      }

    }));
  }

  getRoicP() {
    //จำนวนงานคงค้าง %เบิกจ่าย

    this.configService.postdata('roic/rdRoicPln.php', { peaCode: 'B000'}).subscribe((data => {
      
      if (data.status == 1) {
        this.kvaPlnTotal-=0;
        data.data.forEach(element => {
          this.roicp[element.Pea]=Number(element.totaltr);
          this.kvaPlnTotal=this.kvaPlnTotal+Number(element.totaltr);      

        });


      } else {
        alert(data.data);
      }

    }));
  }
  selectBudget(event){
    this.selBudjet=event.value;
    this.getRemianData();
  }
}
