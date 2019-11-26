import { Component, OnInit,ViewChild } from '@angular/core';
import {NgForm} from '@angular/forms';
import { ConfigService } from '../config/config.service';
import 'rxjs/add/observable/of';
import {MatTableDataSource,MatPaginator} from '@angular/material';
import { trphase,meterdata,meterdata2,meterdata3} from '../model/user.model';
import { AuthService } from '../config/auth.service';
import { HttpClient} from '@angular/common/http';
import {FileuploadService} from '../config/fileupload.service';
import {Chart} from 'chart.js';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-phasechk',
  templateUrl: './phasechk.component.html',
  styleUrls: ['./phasechk.component.scss']
})
export class PhasechkComponent implements OnInit {

  displayedColumns = ['PEA_TR','SUBTYPECOD','Kva','location','Feeder','nMeter','status','peaName','PEA_Meter'];
  displayedColumns1 = ['PEA_Meter','PhaseMeterGis'];
  //displayedColumns2 = ['PEA_TR','Feeder','PEA_Meter','CustName','SUBTYPECOD', 'kWh','rate','rateMeter','Voltage','Line_Type'];
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
  peaNum:string;
  peaname ={};
  peaname2 = [];
  myDonut1: Chart;
  myDonut3: Chart;
  myDonut2: Chart;
  PEA_TR0:number;
  PEA_TR1:number;
  PEA_TR2:number;
  PEA_TR3:number;
  PEA_TR4:number;
  PEA_TR5:number;
  PEA_TR6:number;
  PEA_TR7:number;

  PEA_TR1perPEA_TR0:number;
  PEA_TR3perPEA_TR0:number;
  PEA_TR2perPEA_TR0:number;

  progressBar:Chart;
  progressBar2:Chart;
  progressLine:Chart;
  meterdata=[];
  currentPea="";
  currentMatherPea="";
  Statuss= [
    {value: '-'},
    {value: 'สำรวจแล้วเสร็จรอนำเข้า GIS'},
    {value: 'นำเข้าเฟสมิเตอร์ใน GIS แล้ว'},
  ];
  selDataType=1;
  selPea='';
  selPeaName='กฟน.2';
  selPeapeaCode='';
  DataType=[
    {value: 1, viewValue: 'ข้อมูลหม้อแปลง'},
    {value: 2, viewValue: 'ข้อมูลมิเตอร์'},
  ];
  

  public dataSource = new MatTableDataSource<trphase>();
  public dataSource1 = new MatTableDataSource<meterdata3>();
  public dataSource2 = new MatTableDataSource<meterdata2>();




  constructor(private configService :ConfigService,public authService: AuthService,private http: HttpClient,private uploadService : FileuploadService) {}
  ngOnInit() {
  this.peaCode = localStorage.getItem('peaCode');
  this.peaNum=this.peaCode.substr(1,5);
  this.selPeapeaCode=this.peaCode.substr(0,4);
  this.getpeaList();
  this.getpeaList2();
  this.callData();
  

  //this.getMeterData();
  
  this.dataSource.paginator = this.paginator; 
  this.dataSource1.paginator = this.paginator1; 
  this.dataSource2.paginator = this.paginator2; 
  this.dataSource.sort = this.sort;
  this.dataSource1.sort = this.sort1;
  this.dataSource2.sort = this.sort2;
  }
  callData(){
    this.getTrData();
    this.getStatus();
    this.getJobProgressPea2();
    this.getProgreesMnt();

  }
  public getTrData = () => {
    
    this.configService.getTr2('phase/TR.php?peaCode0='+this.peaCode)
    //this.configService.getTr('TR.php?condition='+this.condition+'&peaCode0='+'B00000')
    .subscribe(res => {
      this.dataSource.data = res as trphase[];
    })
  }

  public getMtData = (PEA_TR) => {
    
    this.configService.getmeterdata3('phase/Meter.php?PEA_TR='+PEA_TR)
    //this.configService.getTr('TR.php?condition='+this.condition+'&peaCode0='+'B00000')
    .subscribe(res => {
      this.dataSource1.data = res as meterdata3[];
    })
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = (filterValue).trim().toLowerCase();
  }

  selectStatus(event){

    this.configService.postdata('phase/wristatus.php',{TRNumber:event.value[1].PEA_TR,status :event.value[0],user:localStorage.getItem('name')}).subscribe((data=>{
      if(data.status==1){        
        this.callData();
      }else{
        alert(data.data);
      }
  
    }))
  }
  getpeaList(){ 
    this.configService.postdata('phase/rdpeaall.php',{}).subscribe((data=>{
      if(data.status==1){
        data.data.forEach(element => {
          this.peaname[element.peaCode]=element.peaName;
          
        });
        this.currentPea=this.peaname[this.peaCode.substring(0,6)];
        if (this.peaCode=="B00000"){
          this.currentMatherPea=this.peaname[this.peaCode.substring(0,6)];
        }else{
          this.currentMatherPea=this.peaname[this.peaCode.substring(0,4)];
        }
        console.log(this.peaCode.substring(0,4));
      }else{
        alert(data.data);
      }
  
    }))
    
  } 
  getpeaList2(){ 
    this.configService.postdata('phase/rdpeaall2.php',{}).subscribe((data=>{
      if(data.status==1){
        //console.log(data.data);
        this.peaname2=data.data;
        //console.log(this.peaname);
      }else{
        alert(data.data);
      }
  
    }))
    
  } 

  onSubmit() {

    this.configService.getmeterdata2('serchmeter.php?PEA_Meter='+this.registerForm.value.PEAMeter)
    //this.configService.getTr('TR.php?condition='+this.condition+'&peaCode0='+'B00000')
    .subscribe(res => {
      this.registerForm.resetForm();  
      this.dataSource2.data = res as meterdata2[];
      
    })
  }

  getProgreesMnt(){
    this.configService.postdata('phase/rdJobProgressPea3.php',{peaCode : this.selPeapeaCode}).subscribe((data=>{
          var totalTr=0;
          var totalMeter=0;
          var mnt=['11/62','12/62','1/63','2/63','3/63','4/63','5/63','6/63','7/63','8/63','9/63'];
          var i;
          var pltLabel='';
          var trPln=[]
          var trAcc=0;
        
          var trDone=[];
          var meterDone=[];
          var meterAcc=0;
          var lastMnt=0;
          var peaTitle='';
          var dataPlt=[];
          for (i=1;i<12;i++){ 
            trAcc=trAcc+100/11;
            trPln.push((trAcc/100*100).toFixed(2));
          }
      
          if (this.selPeapeaCode=='B000'){
            peaTitle="กฟน.2 และ กฟฟ.ในสังกัด"
          }else{
            peaTitle=this.peaname[this.selPeapeaCode.substring(0,4)]+"และ กฟฟ.ในสังกัด";
          }
          
          data.data.forEach(element => {
            totalTr=totalTr+Number(element.totalTr);
            totalMeter=totalMeter+Number(element.totalMeter);
          });
          trAcc=0;
          meterAcc=0;
          data.data.forEach(element => {
            if (Number(element.mnt)-lastMnt>1){
              for (i=0;i<Number(element.mnt)-lastMnt-1;i++){
              trDone.push((trAcc/totalTr*100).toFixed(2));
              meterDone.push((meterAcc/totalMeter*100).toFixed(2));
            }
            }           
            if (element.mnt!="0"){
              trAcc=trAcc+Number(element.nComp);
              trDone.push((trAcc/totalTr*100).toFixed(2));

              meterAcc=meterAcc+Number(element.nMeter);
              meterDone.push((meterAcc/totalMeter*100).toFixed(2));
            }

            lastMnt=Number(element.mnt);
            
          });

          if (this.selDataType==1){
            dataPlt=trDone;
            pltLabel='%หม้อแปลง'
          }else{
            dataPlt=meterDone;
            pltLabel='%หม้อมิเตอร์'
          }
 

          var chartData ={
            labels:mnt,
            datasets: [{
              type: 'line',
              label: '%แผนงาน',
              borderColor: "#5689ff",
              borderWidth: 2,
              fill: false,
              data: trPln
            },{
              type: 'line',
              label: pltLabel,
              borderColor: "#ff5689",
              borderWidth: 2,
              fill: false,
              data: dataPlt
            },
            ]
          };

          if (this.progressLine) this.progressLine.destroy();
          this.progressLine = new Chart('progressLine', {
            type: 'line',
            data:  chartData,
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
              text: "ความก้าวหน้านำเข้าเฟสมิเตอร์ใน GIS ของ "+peaTitle}
          } 
        });
    }));
  }

  getStatus(){

    this.configService.postdata('phase/rdstat.php',{peaCode : localStorage.getItem('peaCode')}).subscribe((data=>{
      if(data.status==1){
        this.PEA_TR0 =Number(data.data[0]);
        this.PEA_TR1 =Number(data.data[1]);
        this.PEA_TR2 =Number(data.data[2]);
        this.PEA_TR3 =Number(data.data[3]);
        this.PEA_TR6 =Number(data.data[4]);
        this.PEA_TR7 =Number(data.data[5]);

        this.PEA_TR4 =Number(data.data[0])+Number(data.data[2])  //Total TR
        this.PEA_TR5 =Number(data.data[3])+Number(data.data[1]) // Survey

        this.PEA_TR1perPEA_TR0=Number(data.data[1])/Number(data.data[0])*100;
        this.PEA_TR3perPEA_TR0=Number(data.data[3])/Number(data.data[2])*100;
        this.PEA_TR2perPEA_TR0=this.PEA_TR5/this.PEA_TR4*100;

       


        if (this.myDonut1) this.myDonut1.destroy();
  
        this.myDonut1 = new Chart('myDonut1', {
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
              ' ผลการนำเข้าเฟสมิเตอร์หม้อแปลง 1 เฟส : '+ [this.PEA_TR1perPEA_TR0.toFixed(2)]+' %',
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
      if (this.myDonut2) this.myDonut2.destroy();
  
      this.myDonut2 = new Chart('myDonut2', {
        type: 'doughnut',
        data:  {
          datasets: [{
            data: [this.PEA_TR2perPEA_TR0.toFixed(2),(100-this.PEA_TR2perPEA_TR0).toFixed(2)
            ],
            backgroundColor: [
              "#FFC300","#a68fe8",
            ],
          }],
          labels: [
            ' ผลการนำเข้าเฟสมิเตอร์หม้อแปลงรวม : '+ [this.PEA_TR2perPEA_TR0.toFixed(2)]+' %',
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

      if (this.myDonut3) this.myDonut3.destroy();
  
        this.myDonut3 = new Chart('myDonut3', {
          type: 'doughnut',
          data:  {
            datasets: [{
              data: [this.PEA_TR3perPEA_TR0.toFixed(2),(100-this.PEA_TR3perPEA_TR0).toFixed(2)
              ],
              backgroundColor: [
                "#FFC300","#ea73b2",
              ],
            }],
            labels: [
              ' ผลการนำเข้าเฟสมิเตอร์หม้อแปลง 3 เฟส : '+ [this.PEA_TR3perPEA_TR0.toFixed(2)]+' %',
              ' '+[(100-this.PEA_TR3perPEA_TR0).toFixed(2)]+' %',]
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
getJobProgressPea2(){ 
  //จำนวนงานคงค้าง %เบิกจ่าย
   this.configService.postdata('phase/rdJobProgressPea2.php',{peaCode : this.selPeapeaCode,selDataType:this.selDataType}).subscribe((data=>{
    if(data.status==1){
      var Pea=[];
      var pComp=[];
      var chartData: any;
      var pIn=[];
      var trgArry=[];
      var peaTitle='';
      var mntList=[11,12,1,2,3,4,5,6,7,8,9];
      var d = new Date();
      var n = d.getMonth();
      var trg=100/11*(mntList.indexOf(n+1)+1);
      if (this.selPeapeaCode=='B000'){
        peaTitle="กฟน.2 และ กฟฟ.ในสังกัด"
      }else{
        peaTitle=this.peaname[this.selPeapeaCode.substring(0,4)]+"และ กฟฟ.ในสังกัด";
      }
      
      var chartTitle:string;

      data.data.forEach(element => { 
  
        Pea.push(this.peaname["B"+element.Pea]);
        trgArry.push(trg.toFixed(2));
        pComp.push((Number(element.nComp)/Number(element.totalTr)*100).toFixed(2));
        pIn.push((Number(element.nInp)/Number(element.totalTr)*100).toFixed(2));
        
        
      });
      

      if (this.selDataType==1){
   
        chartTitle='%ผลการดำเนินการด้านหม้อแปลง '+peaTitle;
      }else{

        chartTitle='%ผลการดำเนินการด้านมิเตอร์ '+peaTitle;
      }
    chartData= {
      type: 'bar',
      labels: Pea,
      datasets:[
      {
      label: '%รอนำเข้า GIS',
      data: pIn,
      backgroundColor: '#07CCD6',
  },
  {
    type: 'bar',
    label: '%นำเข้า GIS',
    data: pComp,
    backgroundColor: '#DAF7A6',
  },
  {
    type: 'line',
    label: '%แผนงาน',
    data: trgArry,
    //backgroundColor: '#07CCD6',
    borderColor: '#5689ff',
    borderWidth: 2,
    fill: false,
  }

]};
    

    if (this.progressBar) this.progressBar.destroy();

    this.progressBar = new Chart('progressBar', {
      type: 'bar',
      data:  chartData,
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
      
    }else{
      alert(data.data);
    }

  }));
}
selectPea(event){
   
  this.selPea=event.value[0];
  this.selPeaName=event.value[2];
  this.selPeapeaCode=event.value[1];
  this.getJobProgressPea2();
  this.getProgreesMnt();

}
selectData(event){
  this.selDataType=event.value;
  this.getJobProgressPea2();
  this.getProgreesMnt();
}

}


