import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfigService } from '../config/config.service';
import { Chart } from 'chart.js';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { jobRemain, jobRemain2 } from '../model/user.model';
import {
  ApexNonAxisChartSeries,
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexStroke,
  ApexGrid,
  ApexYAxis,
  ApexXAxis,
  ApexPlotOptions,
  ApexTooltip,
  ApexFill
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  grid: ApexGrid;
  colors: string[];
  tooltip: ApexTooltip;
  title: ApexTitleSubtitle;

};
export type ChartOptions2 = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  stroke: ApexStroke;
};
@Component({
  selector: 'app-roic',
  templateUrl: './roic.component.html',
  styleUrls: ['./roic.component.scss']
})
export class RoicComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions1: Partial<ChartOptions2>;
  public chartOptions2: Partial<ChartOptions>;

  budjets = [
    { value: ['', ''], viewValue: 'ทั้งหมด' },
    { value: ['I-60-B', '.BY.'], viewValue: 'I60.BY' },
    { value: ['I-62-B', '.BY.'], viewValue: 'I62.BY' },
    { value: ['I-62-B', '.TR.'], viewValue: 'I62.TR' },
  ];
  myBarClsd: Chart;
  myBar3: Chart;
  peaname = {};
  peaname2 = [];
  selBudjet = ['', ''];
  selPea = '';
  selPeaName = 'กฟน.2';
  selPeapeaCode = '';
  selPeapeaCode2 = 'B000';
  currentMatherPea = "";
  currentPea = "";
  peaCode = "";
  peaNum: string;
  progressBar: Chart;
  progressBarN2: Chart;
  progressWorkCostBar: Chart;
  progressMatCostBar: Chart;
  trBar: Chart;
  trBarN2: Chart;
  roicp = {};
  kvaPlnTotal = 0;
  kvaTotal = 0;
  kvaD1Total = 0;
  workCostActTRTotal: number;
  workCostActBYTotal: number;
  workCostActTotal: number;
  workCostPlnTotal: number;
  matCostActTotal: number;
  matCostPlnTotal: number;
  roicdate: string;
  displayedColumns = ['wbs', 'jobName', 'workCostPln', 'workCostAct', 'percent', 'jobStatus', 'userStatus'];
  displayedColumns2 = ['wbs', 'jobName', 'workCostPln', 'workCostAct', 'percent', 'jobStatus', 'userStatus'];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginator2') paginator2: MatPaginator;
  @ViewChild('sort') sort: MatSort;
  @ViewChild('sort2') sort2: MatSort;

  public dataSource = new MatTableDataSource<jobRemain>();
  public dataSource2 = new MatTableDataSource<jobRemain2>();

  constructor(private configService: ConfigService) {



  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource2.paginator = this.paginator2;

    this.dataSource.sort = this.sort;
    this.dataSource2.sort = this.sort2;

    this.peaCode = localStorage.getItem('peaCode');
    this.peaNum = this.peaCode.substr(1, 5);
    this.selPeapeaCode = this.peaCode.substr(0, 4);
    this.getpeaList();
    this.getpeaList2();
    this.getinfo();
    this.getRemianBY();
    this.getJobClsdPea();
    this.dataSource.paginator = this.paginator;

  }
  getinfo() {
    this.configService.postdata('roic/rdInfo.php', { data: 'roicdate' }).subscribe((data => {
      if (data.status == 1) {
        this.roicdate = data.data[0].info;
      } else {
        alert(data.data);
      }

    }));

  }
  getRemianData() {

    this.configService.getJobRemain('roic/rdJobRemain.php?filter1=' + this.selBudjet[0] + '&filter2=' + this.selBudjet[1] + '&peaCode=' + this.selPeapeaCode)
      //this.configService.getTr('TR.php?condition='+this.condition+'&peaCode0='+'B00000')
      .subscribe(res => {
        this.dataSource.data = res as jobRemain[];
      })
  }
  getRemianBY() {

    this.configService.getBYRemain('roic/rdBYRemain.php?filter1=' + this.selBudjet[0] + '&filter2=' + this.selBudjet[1] + '&peaCode=' + this.selPeapeaCode2)
      //this.configService.getTr('TR.php?condition='+this.condition+'&peaCode0='+'B00000')
      .subscribe(res => {
        this.dataSource2.data = res as jobRemain2[];
      })
  }
  applyFilter(filterValue: string) {

    this.dataSource.filter = (filterValue).trim().toLowerCase();
  }
  applyFilter2(filterValue: string) {

    this.dataSource2.filter = (filterValue).trim().toLowerCase();
  }
  callData() {
    this.getJobProgressPea();
    //this.getTrPea();
    //this.getBudgetPea();
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
    this.configService.postdata('roic/rdpeaall.php', {}).subscribe((data => {
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
    this.getJobClsdPea();
    this.getJobProgressPea();

  }
  selectPea2(event) {
    this.selPeapeaCode2 = event.value[1];
    this.getRemianBY();
    //this.getTrPea();
  }
  getJobProgressPea() {
    //จำนวนงานคงค้าง %เบิกจ่าย
    this.getRoicP();
    this.configService.postdata('roic/rdRoicProgress.php', { peaCode: this.selPeapeaCode, filter1: this.selBudjet[0], filter2: this.selBudjet[1] }).subscribe((data => {
      if (data.status == 1) {
        var Pea = [];
        var kva = [];
        this.kvaTotal = 0;
        var kvaPln = [];
        var kvaPercent = [];
        this.kvaPlnTotal = 0;
        data.dataP.forEach(element => {
          this.roicp[element.Pea] = Number(element.totaltr);
          this.kvaPlnTotal = this.kvaPlnTotal + Number(element.totaltr);

        });
        console.log(this.kvaPlnTotal);
        data.data.forEach(element => {
          this.kvaTotal = this.kvaTotal + Number(element.totaltr);
          Pea.push(this.peaname["B" + element.Pea]);
          kva.push(Number(element.totaltr));
          kvaPln.push(this.roicp[element.Pea]);
          kvaPercent.push((Number(element.totaltr) / this.roicp[element.Pea] * 100).toFixed(2));
        });
        //APEX CHART
        console.log(kva);
        this.chartOptions1 = {
          series: [this.kvaTotal / this.kvaPlnTotal * 100],
          chart: {
            height: 300,
            type: "radialBar",
            toolbar: {
              show: false
            }
          },
          plotOptions: {
            radialBar: {
              startAngle: 0,
              endAngle: 360,
              hollow: {
                margin: 0,
                size: "70%",
                background: "#fff",
                image: undefined,
                position: "front",
                dropShadow: {
                  enabled: true,
                  top: 3,
                  left: 0,
                  blur: 4,
                  opacity: 0.24
                }
              },
              track: {
                background: "#fff",
                strokeWidth: "67%",
                margin: 0, // margin is in pixels
                dropShadow: {
                  enabled: true,
                  top: -3,
                  left: 0,
                  blur: 4,
                  opacity: 0.35
                }
              },

              dataLabels: {
                show: true,
                name: {
                  offsetY: -10,
                  show: true,
                  color: "#888",
                  fontSize: "17px"
                },
                value: {
                  formatter: function (val) {
                    return parseInt(val.toString(), 10).toString() + "%";
                  },
                  color: "#111",
                  fontSize: "36px",
                  show: true
                }
              }
            }
          },
          fill: {
            type: "gradient",
            gradient: {
              shade: "dark",
              type: "horizontal",
              shadeIntensity: 0.5,
              gradientToColors: ["#ABE5A1"],
              inverseColors: true,
              opacityFrom: 1,
              opacityTo: 1,
              stops: [0, 100]
            }
          },
          stroke: {
            lineCap: "round"
          },
          labels: ["ผลการดำเนินการ"]
        };
        //กราฟแท่ง ราย กฟฟ
        this.chartOptions2 = {
          series: [
            {
              name: "CLSD",
              data: kvaPercent
            },
          ],
          chart: {
            type: "bar",
            height: 500,
            toolbar: {
              show: false
            },
          },
          plotOptions: {
            bar: {
              horizontal: true
            }
          },
          dataLabels: {
            enabled: false
          },
          tooltip: {
            x: {
              formatter: function (val) {
                return val.toString();
              }
            },
            y: {
              formatter: function (val, index) {
                //console.log(index);
                return Math.abs(kva[index.dataPointIndex]) + " kVA";
              }
            }
          },
          xaxis: {
            categories: Pea,
            labels: {
              formatter: function (val) {
                return Math.abs(Math.round(parseInt(val, 10))) + "%";
              }
            }

          },

        };
        //===================================================================
        /*
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
                         userCallback: function (value, index, values) {
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
                       label: function (tooltipItem, data) {
                         return tooltipItem.yLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                       },
                     },
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
                     data: [this.kvaTotal - this.kvaD1Total],
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
                         userCallback: function (value, index, values) {
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
                       label: function (tooltipItem, data) {
                         return tooltipItem.yLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                       },
                     },
                   },
       
                 },
       
               });
       */
      } else {
        alert(data.data);
      }

    }));

  }
  /*
  getTrPea() {
    //จำนวนงานคงค้าง %เบิกจ่าย
    this.getRoicP();
    this.configService.postdata('roic/rdTrProgress.php', { peaCode: this.selPeapeaCode2 }).subscribe((data => {
      if (data.status == 1) {
        var Pea = [];
        var workCostActTR = [];
        var workCostPlnTR = [];
        var workCostActBY = [];
        this.workCostActTRTotal = 0;
        this.workCostActBYTotal = 0;
        var chartData: any;
        var chartTitle: string;



        data.data.forEach(element => {
          this.workCostActTRTotal = this.workCostActTRTotal + Number(element.workCostActTR);
          this.workCostActBYTotal = this.workCostActBYTotal + Number(element.workCostActBY);
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
            onClick: function (event, value) {
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
                  userCallback: function (value, index, values) {
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
                label: function (tooltipItem, data) {
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
                  userCallback: function (value, index, values) {
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
                label: function (tooltipItem, data) {
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
 */
  getJobClsdPea() {
    //จำนวนงานคงค้าง %เบิกจ่าย
    var pClsd = [];
    this.configService.postdata('rdJobProgressPea.php', { peaCode: this.selPeapeaCode, filter1: this.selBudjet[0], filter2: this.selBudjet[1] }).subscribe((data => {
      if (data.status == 1) {
        var WorkCostPea = [];
        var WorkCostPercentPea = [];

        var nwbsArr = [];
        var matCostPercentPea = [];
        data.data.forEach(element => {
          nwbsArr.push(element.nWBS);
          pClsd.push((Number(element.nWBS) / Number(element.totalWbs) * 100).toFixed(2));
          WorkCostPea.push(this.peaname[element.Pea]);
          WorkCostPercentPea.push((Number(element.workCostAct) / Number(element.workCostPln) * 100).toFixed(2));
          matCostPercentPea.push((Number(element.matCostAct) / Number(element.matCostPln) * 100).toFixed(2));


        });
        //แสดงงานคงค้าง
        var chartData = {
          labels: WorkCostPea,
          datasets: [{
            label: 'จำนวนงานคงค้าง',
            data: nwbsArr,
            backgroundColor: '#07CCD6',
          }]
        };



        var chartTitle = 'จำนวนงานคงค้าง';

        if (this.myBar3) this.myBar3.destroy();

        this.myBar3 = new Chart('myBar3', {
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
                  beginAtZero: true
                }
              }]
            }
          },

        });

        //Percent Clsd
        chartData = {
          labels: WorkCostPea,
          datasets: [

            {
              label: 'เปอร์เซนต์คงค้าง',
              data: pClsd,
              backgroundColor: '#DAF7A6',
            }]
        };



        if (this.myBarClsd) this.myBarClsd.destroy();

        this.myBarClsd = new Chart('myBarClsd', {
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
                  beginAtZero: true
                }
              }]
            }
          },

        });


        //this.nwbs=data.data.nwbs;
        //this.WorkCostPercent=Number(data.data.workCostAct)/Number(data.data.workCostPln*0.8)*100;

      } else {
        alert(data.data);
      }

    }));



  }
  /*
 getBudgetPea() {
   //จำนวนงานคงค้าง %เบิกจ่าย
   this.getRoicP();
   this.configService.postdata('roic/rdBudgetProgress.php', { peaCode: 'B000' }).subscribe((data => {
     if (data.status == 1) {
       var Pea = [];
       var workCostAct = [];
       var workCostPln = [];
       var matCostAct = [];
       var matCostPln = [];
       var chartData: any;
       var chartTitle: string;
       this.workCostActTotal = 0;
       this.workCostPlnTotal = 0;
       this.matCostActTotal = 0;
       this.matCostPlnTotal = 0;


       data.data.forEach(element => {
         Pea.push(this.peaname["B" + element.Pea]);
         workCostAct.push(Number(element.workCostAct));
         workCostPln.push(Number(element.workCostPln));
         matCostAct.push(Number(element.matCostAct) + Number(element.matCostInAct));
         matCostPln.push(Number(element.matCostPln) + Number(element.matCostInPln));
         this.workCostActTotal = this.workCostActTotal + Number(element.workCostAct);
         this.workCostPlnTotal = this.workCostPlnTotal + Number(element.workCostPln);
         this.matCostActTotal = this.matCostActTotal + Number(element.matCostAct) + Number(element.matCostInAct);
         this.matCostPlnTotal = this.matCostPlnTotal + Number(element.matCostPln) + Number(element.matCostInPln);

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
           },
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
           onClick: function (event, value) {
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
                 userCallback: function (value, index, values) {
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
               label: function (tooltipItem, data) {
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
           onClick: function (event, value) {
             console.log(value[0]._view.label);
             console.log("6666");
             this.Test();
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
               scaleLabel: {
                 display: true,
                 labelString: 'บาท'
               },

             }]
           },
           tooltips: {
             callbacks: {
               label: function (tooltipItem, data) {
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
*/
  getRoicP() {
    //จำนวนงานคงค้าง %เบิกจ่าย

    this.configService.postdata('roic/rdRoicPln.php', { peaCode: 'B000' }).subscribe((data => {

      if (data.status == 1) {
        this.kvaPlnTotal -= 0;
        data.data.forEach(element => {
          this.roicp[element.Pea] = Number(element.totaltr);
          this.kvaPlnTotal = this.kvaPlnTotal + Number(element.totaltr);

        });


      } else {
        alert(data.data);
      }

    }));
  }

  selectBudget(event) {
    this.selBudjet = event.value;
    this.getRemianData();
    this.getJobClsdPea();
    this.getJobProgressPea();
  }
  exportAsXLSX(): void {
    this.configService.exportAsExcelFile(this.dataSource.data, 'งานคงค้าง');
  }
}
