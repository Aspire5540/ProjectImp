import { Component, OnInit,ViewChild } from '@angular/core';
import {NgForm} from '@angular/forms';
import { ConfigService } from '../config/config.service';
import 'rxjs/add/observable/of';
import {MatTableDataSource,MatPaginator} from '@angular/material';
import { trdata,meterdata,meterdata2} from '../model/user.model';
import { AuthService } from '../config/auth.service';
import { HttpClient} from '@angular/common/http';
import {FileuploadService} from '../config/fileupload.service';
import {Chart} from 'chart.js';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-lvpro',
  templateUrl: './lvpro.component.html',
  styleUrls: ['./lvpro.component.scss']
})
export class LVProComponent implements OnInit {

  displayedColumns = ['PEA_TR','Location','PLoadTOT', 'minV', 'WBS','Note','RLoad','RVoltage','PEA_Meter'];
  displayedColumns1 = ['Feeder','PEA_Meter','CustName','SUBTYPECOD', 'kWh','rate','rateMeter','Voltage','Line_Type'];
  displayedColumns2 = ['PEA_TR','Feeder','PEA_Meter','CustName','SUBTYPECOD', 'kWh','rate','rateMeter','Voltage','Line_Type'];
  //TRNo = "00-050333";
  @ViewChild('f') registerForm: NgForm;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator1') paginator1: MatPaginator;
  @ViewChild('sort1') sort1: MatSort;
  @ViewChild('paginator2') paginator2: MatPaginator;
  @ViewChild('sort2') sort2: MatSort;
  condition = 0;
  peaCode = ""; 
  myDonut: Chart;
  myDonut200: Chart;
  myDonut80: Chart;
  myDonutWBS4: Chart;
  myDonutWBS5: Chart;
  myDonutWBS6: Chart;
  PEA_TR0:number;
  PEA_TR1:number;
  PEA_TR2:number;
  PEA_TR3:number;
  WBS4:number;
  WBS5:number;
  WBS6:number;
  PEA_TR1perPEA_TR0:number;
  PEA_TR2perPEA_TR0:number;
  PEA_TR3perPEA_TR0:number;
  WBS4perPEA_TR1:number;
  WBS5perPEA_TR2:number;
  WBS6perPEA_TR3:number;
  meterdata=[];


  Statuss= [
    {value: '-'},
    {value: 'อยู่ระหว่างตรวจสอบ'},
    {value: 'อยู่ระหว่างสำรวจประมาณการ'},
    {value: 'อยู่ระหว่างแก้ไขข้อมูล GIS'},
    {value: 'ไม่พบปัญหา'}
  ];

  
  Conditions= [
    //{value: 0,viewvalue: 'หม้อแปลงทั้งหมด'},
    {value: 1,viewvalue: 'แรงดันต่ำกว่า 200 Volt และโหลดเกิน 80%'},
    {value: 2,viewvalue: 'แรงดันต่ำกว่า 200 Volt'},
    {value: 3,viewvalue: 'โหลดเกิน 80%'}
    
  ];
  
  public dataSource = new MatTableDataSource<trdata>();
  public dataSource1 = new MatTableDataSource<meterdata>();
  public dataSource2 = new MatTableDataSource<meterdata2>();



  constructor(private configService :ConfigService,public authService: AuthService,private http: HttpClient,private uploadService : FileuploadService) {}
  ngOnInit() {
  this.peaCode = localStorage.getItem('peaCode');
  this.getTrData();
  this.getStatus();
  //this.getMeterData();
  
  this.dataSource.paginator = this.paginator; 
  this.dataSource1.paginator = this.paginator1; 
  this.dataSource2.paginator = this.paginator2; 
  this.dataSource.sort = this.sort;
  this.dataSource1.sort = this.sort1;
  this.dataSource2.sort = this.sort2;
  }
  public getTrData = () => {
    
    this.configService.getTr('TR.php?condition='+this.condition+'&peaCode0='+this.peaCode)
    //this.configService.getTr('TR.php?condition='+this.condition+'&peaCode0='+'B00000')
    .subscribe(res => {
      this.dataSource.data = res as trdata[];
    })
  }


  public getMtData = (PEA_TR) => {
    
    this.configService.getMeter('Meter.php?PEA_TR='+PEA_TR)
    //this.configService.getTr('TR.php?condition='+this.condition+'&peaCode0='+'B00000')
    .subscribe(res => {
      this.dataSource1.data = res as meterdata[];
    })
  }
  applyFilter(filterValue: string) {
    console.log((filterValue+" "+localStorage.getItem('peaEng')).trim().toLowerCase());
    this.dataSource.filter = (filterValue).trim().toLowerCase();
  }
  applyFilter1(filterValue: string) {
    
    this.dataSource1.filter = (filterValue).trim().toLowerCase();
  }
  applyWBS(event) {
    console.log(event);
    this.configService.postdata('wriWBS.php',{TRNumber:event[1].PEA_TR,WBS :event[0]}).subscribe((data=>{
      if(data.status==1){
         console.log(data.data);
         this.getTrData();
         this.getStatus();
        //console.log(this.peaname);
      }else{
        alert(data.data);
      }
  
    }))  
  }

  applyRLoad(event) {
    console.log(event);
    this.configService.postdata('wriRLoad.php',{TRNumber:event[1].PEA_TR,RLoad :event[0]}).subscribe((data=>{
      if(data.status==1){
         console.log(data.data);
         this.getTrData();
        //console.log(this.peaname);
      }else{
        alert(data.data);
      }
  
    }))  
  }

  applyRVoltage(event) {
    console.log(event);
    this.configService.postdata('wriRVoltage.php',{TRNumber:event[1].PEA_TR,RVoltage :event[0]}).subscribe((data=>{
      if(data.status==1){
         console.log(data.data);
         this.getTrData();
        //console.log(this.peaname);
      }else{
        alert(data.data);
      }
  
    }))  
  }

  selectStatus(event){
    console.log(event);
    this.configService.postdata('wristatus.php',{TRNumber:event.value[1].PEA_TR,status :event.value[0]}).subscribe((data=>{
      if(data.status==1){
         console.log(data.data);
         this.getTrData();
        //console.log(this.peaname);
      }else{
        alert(data.data);
      }
  
    }))
  }

  selectCondition(event){
    this.condition=event.value[0];
    this.getTrData();

  }


  onSubmit() {

    /*if(data.status==1){
      this.registerForm.resetForm();
      this.getData();
      alert("เก็บข้อมูลแล้วเสร็จ");
    }else{
    alert(data.data);
    }*/

    this.configService.getmeterdata2('serchmeter.php?PEA_Meter='+this.registerForm.value.PEAMeter)
    //this.configService.getTr('TR.php?condition='+this.condition+'&peaCode0='+'B00000')
    .subscribe(res => {
      this.registerForm.resetForm();  
      this.dataSource2.data = res as meterdata2[];
      
    })
  }

  getStatus(){
    this.configService.postdata('rdstat.php',{peaCode : localStorage.getItem('peaCode')}).subscribe((data=>{
      if(data.status==1){
        this.PEA_TR0 =data.data[0];
        this.PEA_TR1 =data.data[1];
        this.PEA_TR2 =data.data[2];
        this.PEA_TR3 =data.data[3];
        this.WBS4 =data.data[4];
        this.WBS5 =data.data[5];
        this.WBS6 =data.data[6];
        this.PEA_TR1perPEA_TR0=Number(data.data[1])/Number(data.data[0])*100;
        this.PEA_TR2perPEA_TR0=Number(data.data[2])/Number(data.data[0])*100;
        this.PEA_TR3perPEA_TR0=Number(data.data[3])/Number(data.data[0])*100;
        this.WBS4perPEA_TR1=Number(data.data[4])/Number(data.data[1])*100;
        this.WBS5perPEA_TR2=Number(data.data[5])/Number(data.data[2])*100;
        this.WBS6perPEA_TR3=Number(data.data[6])/Number(data.data[3])*100;

        console.log (this.PEA_TR0);

        //this.nwbsMR =data.data.MR.nwbs;
        //this.workCostPerMR=Number(data.data.MR.workCostAct)/Number(data.data.MR.workCostPln)*100;
        //this.nwbsBY =data.data.BY.nwbs;
        //this.workCostPerBY=Number(data.data.BY.workCostAct)/Number(data.data.BY.workCostPln)*100;
        //this.nwbsAll =data.data.BY.All;
        //this.workCostPerAll=Number(data.data.All.workCostAct)/Number(data.data.All.workCostPln)*100;
        //this.nwbs=data.data.nwbs;
        //this.WorkCostPercent=Number(data.data.workCostAct)/Number(data.data.workCostPln*0.8)*100;
        if (this.myDonut) this.myDonut.destroy();
  
        this.myDonut = new Chart('myDonut', {
          type: 'doughnut',
          data:  {
            datasets: [{
              data: [this.PEA_TR1perPEA_TR0.toFixed(2),(100-this.PEA_TR1perPEA_TR0).toFixed(2)
              ],
              backgroundColor: [
                "#FFC300","#a68fe8",
              ],
            }],
            labels: [
              ' แรงดันต่ำกว่า 200 Volt และโหลดเกิน 80% : '+ [this.PEA_TR1perPEA_TR0.toFixed(2)]+' %',
              ' '+[(100-this.PEA_TR1perPEA_TR0).toFixed(2)]+' %',]
          },plugins: [{
            beforeDraw: function(chart) {
              var width = chart.chart.width,
                  height = chart.chart.height,
                  ctx = chart.chart.ctx;
                  //text =chart.config.data.dataset[0].data[0];
              
              ctx.restore();
              var fontSize = (height / 120).toFixed(2);
              ctx.font = fontSize + "em sans-serif";
              ctx.textBaseline = "middle";
              ctx.fillStyle = "#FFFEFF";
              var text = chart.config.data.datasets[0].data[0]+"%",
                  textX = Math.round((width - ctx.measureText(text).width) / 2),
                  textY = height / 2;
          
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
              label: function(tooltipItems, data) {
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

      if (this.myDonut200) this.myDonut200.destroy();
  
        this.myDonut200 = new Chart('myDonut200', {
          type: 'doughnut',
          data:  {
            datasets: [{
              data: [this.PEA_TR2perPEA_TR0.toFixed(2),(100-this.PEA_TR2perPEA_TR0).toFixed(2)
              ],
              backgroundColor: [
                "#FFC300","#ea73b2",
              ],
            }],
            labels: [
              ' แรงดันต่ำกว่า 200 Volt : '+ [this.PEA_TR2perPEA_TR0.toFixed(2)]+' %',
              ' '+[(100-this.PEA_TR2perPEA_TR0).toFixed(2)]+' %',]
          },plugins: [{
            beforeDraw: function(chart) {
              var width = chart.chart.width,
                  height = chart.chart.height,
                  ctx = chart.chart.ctx;
                  //text =chart.config.data.dataset[0].data[0];
              
              ctx.restore();
              var fontSize = (height / 120).toFixed(2);
              ctx.font = fontSize + "em sans-serif";
              ctx.textBaseline = "middle";
              ctx.fillStyle = "#FFFEFF";
              var text = chart.config.data.datasets[0].data[0]+"%",
                  textX = Math.round((width - ctx.measureText(text).width) / 2),
                  textY = height / 2;
          
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
              label: function(tooltipItems, data) {
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

      if (this.myDonut80) this.myDonut80.destroy();
  
        this.myDonut80 = new Chart('myDonut80', {
          type: 'doughnut',
          data:  {
            datasets: [{
              data: [this.PEA_TR3perPEA_TR0.toFixed(2),(100-this.PEA_TR3perPEA_TR0).toFixed(2)
              ],
              backgroundColor: [
                "#FFC300","#55bae0",
              ],
            }],
            labels: [
              'โหลดเกิน 80% : '+ [this.PEA_TR3perPEA_TR0.toFixed(2)]+' %',
              ' '+[(100-this.PEA_TR3perPEA_TR0).toFixed(2)]+' %',]
          },
          plugins: [{
            beforeDraw: function(chart) {
              var width = chart.chart.width,
                  height = chart.chart.height,
                  ctx = chart.chart.ctx;
                  //text =chart.config.data.dataset[0].data[0];
              
              ctx.restore();
              var fontSize = (height / 120).toFixed(2);
              ctx.font = fontSize + "em sans-serif";
              ctx.textBaseline = "middle";
              ctx.fillStyle = "#FFFEFF";
              var text = chart.config.data.datasets[0].data[0]+"%",
                  textX = Math.round((width - ctx.measureText(text).width) / 2),
                  textY = height / 2;
          
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
              label: function(tooltipItems, data) {
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

      if (this.myDonutWBS4) this.myDonutWBS4.destroy();
  
        this.myDonutWBS4 = new Chart('myDonutWBS4', {
          type: 'doughnut',
          data:  {
            datasets: [{
              data: [this.WBS4perPEA_TR1.toFixed(2),(100-this.WBS4perPEA_TR1).toFixed(2)
              ],
              backgroundColor: [
                "#FFC300","#a68fe8",
              ],
            }],
            labels: [
              'WBS จาก แรงดันต่ำกว่า 200 Volt และโหลดเกิน 80% : '+ [this.WBS4perPEA_TR1.toFixed(2)] + '%',
              ' '+ [(100-this.WBS4perPEA_TR1).toFixed(2)]+ '%',]
          },plugins: [{
            beforeDraw: function(chart) {
              var width = chart.chart.width,
                  height = chart.chart.height,
                  ctx = chart.chart.ctx;
                  //text =chart.config.data.dataset[0].data[0];
              
              ctx.restore();
              var fontSize = (height / 120).toFixed(2);
              ctx.font = fontSize + "em sans-serif";
              ctx.textBaseline = "middle";
              ctx.fillStyle = "#FFFEFF";
              var text = chart.config.data.datasets[0].data[0]+"%",
                  textX = Math.round((width - ctx.measureText(text).width) / 2),
                  textY = height / 2;
          
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
              label: function(tooltipItems, data) {
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

      if (this.myDonutWBS5) this.myDonutWBS5.destroy();
  
        this.myDonutWBS5 = new Chart('myDonutWBS5', {
          type: 'doughnut',
          data:  {
            datasets: [{
              data: [this.WBS5perPEA_TR2.toFixed(2),(100-this.WBS5perPEA_TR2).toFixed(2)
              ],
              backgroundColor: [
               "#FFC300", "#ea73b2",
              ],
            }],
            labels: [
              'WBS จาก แรงดันต่ำกว่า 200 Volt : '+ [this.WBS5perPEA_TR2.toFixed(2)] + '%',
              ' '+ [(100-this.WBS5perPEA_TR2).toFixed(2)]+ '%',]
          },plugins: [{
            beforeDraw: function(chart) {
              var width = chart.chart.width,
                  height = chart.chart.height,
                  ctx = chart.chart.ctx;
                  //text =chart.config.data.dataset[0].data[0];
              
              ctx.restore();
              var fontSize = (height / 120).toFixed(2);
              ctx.font = fontSize + "em sans-serif";
              ctx.textBaseline = "middle";
              ctx.fillStyle = "#FFFEFF";
              var text = chart.config.data.datasets[0].data[0]+"%",
                  textX = Math.round((width - ctx.measureText(text).width) / 2),
                  textY = height / 2;
          
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
              label: function(tooltipItems, data) {
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

      if (this.myDonutWBS6) this.myDonutWBS6.destroy();
  
        this.myDonutWBS6 = new Chart('myDonutWBS6', {
          type: 'doughnut',
          data:  {
            datasets: [{
              data: [this.WBS6perPEA_TR3.toFixed(2),(100-this.WBS6perPEA_TR3).toFixed(2)
              ],
              backgroundColor: [
                "#FFC300","#55bae0",
              ],
            }],
            labels: [
              'WBS จาก โหลดเกิน 80% : '+ [this.WBS6perPEA_TR3.toFixed(2)] + '%',
              ' '+ [(100-this.WBS6perPEA_TR3).toFixed(2)]+ '%',]
          },plugins: [{
            beforeDraw: function(chart) {
              var width = chart.chart.width,
                  height = chart.chart.height,
                  ctx = chart.chart.ctx;
                  //text =chart.config.data.dataset[0].data[0];
              
              ctx.restore();
              var fontSize = (height / 120).toFixed(2);
              ctx.font = fontSize + "em sans-serif";
              ctx.textBaseline = "middle";
              ctx.fillStyle = "#FFFEFF";
              var text = chart.config.data.datasets[0].data[0]+"%",
                  textX = Math.round((width - ctx.measureText(text).width) / 2),
                  textY = height / 2;
          
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
              label: function(tooltipItems, data) {
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


    
      }else{
        alert(data.data);
      }

      
  
    }));
    
    
  
  }
  exportAsXLSX():void {
    this.configService.exportAsExcelFile(this.dataSource.data, 'TRdata');
 }
 exportAsXLSX2():void {
  this.configService.exportAsExcelFile(this.dataSource1.data, 'MeterData');
}
  /*
  getTrData(){ 
    this.configService.postdata('TR.php',{TRNumber:this.TRNo}).subscribe((data=>{
      if(data.status==1){
         console.log(data.data);
        
        //console.log(this.peaname);
      }else{
        alert(data.data);
      }
  
    }))
    
  } 
*/
}


