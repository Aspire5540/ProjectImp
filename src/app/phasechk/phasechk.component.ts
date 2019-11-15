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

  displayedColumns = ['PEA_TR','SUBTYPECOD','Kva','location','Feeder','status','PEA_Meter'];
  displayedColumns1 = ['PEA_Meter','PhaseMeterGis'];
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
  myDonut1: Chart;
  myDonut3: Chart;
  myDonut2: Chart;
  PEA_TR0:number;
  PEA_TR1:number;
  PEA_TR2:number;
  PEA_TR3:number;
  PEA_TR4:number;
  PEA_TR5:number;

  PEA_TR1perPEA_TR0:number;
  PEA_TR3perPEA_TR0:number;
  PEA_TR2perPEA_TR0:number;

  meterdata=[];


  Statuss= [
    {value: '-'},
    {value: 'นำเข้าเฟสมิเตอร์ใน GIS แล้ว'},
  ];

  

  public dataSource = new MatTableDataSource<trphase>();
  public dataSource1 = new MatTableDataSource<meterdata3>();
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
    console.log(event);
    this.configService.postdata('phase/wristatus.php',{TRNumber:event.value[1].PEA_TR,status :event.value[0]}).subscribe((data=>{
      if(data.status==1){
         
         this.getTrData();
         this.getStatus()
        //console.log(this.peaname);
      }else{
        alert(data.data);
      }
  
    }))
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
    this.configService.postdata('phase/rdstat.php',{peaCode : localStorage.getItem('peaCode')}).subscribe((data=>{
      if(data.status==1){
        this.PEA_TR0 =data.data[0];
        this.PEA_TR1 =data.data[1];
        this.PEA_TR2 =data.data[2];
        this.PEA_TR3 =data.data[3];
        this.PEA_TR4 =Number(data.data[0])+Number(data.data[2])
        this.PEA_TR5 =Number(data.data[3])+Number(data.data[1])
        this.PEA_TR1perPEA_TR0=Number(data.data[1])/Number(data.data[0])*100;
        this.PEA_TR3perPEA_TR0=Number(data.data[3])/Number(data.data[2])*100;
        this.PEA_TR2perPEA_TR0=this.PEA_TR5/this.PEA_TR4*100;


        console.log (this.PEA_TR1perPEA_TR0);


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
            ' แรงดันต่ำกว่า 200 Volt และโหลดเกิน 80% : '+ [this.PEA_TR2perPEA_TR0.toFixed(2)]+' %',
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
              ' แรงดันต่ำกว่า 200 Volt : '+ [this.PEA_TR3perPEA_TR0.toFixed(2)]+' %',
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


