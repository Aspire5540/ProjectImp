import { Component, OnInit,ViewChild } from '@angular/core';
import { ConfigService } from '../config/config.service';
import 'rxjs/add/observable/of';
import {MatTableDataSource,MatPaginator} from '@angular/material';
import { jobprogress  } from '../model/user.model';

import {MatSort} from '@angular/material/sort';
import {Chart} from 'chart.js';

@Component({
  selector: 'app-psimdashboard',
  templateUrl: './psimdashboard.component.html',
  styleUrls: ['./psimdashboard.component.scss']
})
export class PsimdashboardComponent implements OnInit {
  public dataSource = new MatTableDataSource<jobprogress>();
  displayedColumns = ['wbs', 'jobName', 'workCostP3', 'workCostP4','workCostP5'];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('sort') sort: MatSort;

  peaname = [];
  budjets= [
    {value: ['I-60-B','.BY.'], viewValue: 'I60.BY'},
    {value: ['I-62-B','.BY.'], viewValue: 'I62.BY'},
    {value: ['I-60-B','.MR.1'], viewValue: 'I60.MR'},
    {value: ['I-61-B','.MR.1'], viewValue: 'I61.MR'},
    {value: ['I-62-B','.MR.1'], viewValue: 'I62.MR'},
    {value: ['I-62-B','.41.11'], viewValue: 'I62.41.1100'},
    {value: ['I-62-B','.41.12'], viewValue: 'I62.41.1200'},
    {value: ['',''], viewValue: 'ทุกงบ'},
    
    
  ];
  projectArr=[];
  porjectRemArr=[];
  workCostArr1=[];
  workCostArr2=[];
  workCostArr3=[];
  matCostArr1=[];
  matCostArr2=[];
  matCostArr3=[];
  chartData: any;
  myDonut: Chart;
  myBar:Chart;
  myBar2:Chart;
  myBar3:Chart;
  selPea='';
  totalwbs:number;
  
  WorkCost =0 ;
  WorkCostPercent=0;
  WorkCostApp=0;
  projectBudget=0;
  nwbs=0;
  nwbsArr=[];
  nwbsApp=[];
  selPeapeaCode = 'B000';

  WorkCostPercentPea=[];
  matCostPercentPea=[];
  WorkCostPea=[];
  myPieChart: Chart;

  chartTitle:string;

  dataTypes=[
    {value: 0, viewValue: 'จำนวนงานคงค้าง'},
    {value: 1, viewValue: '% เบิกจ่าย'},

  ];

  totalWbs=0;
  selBudjet=['',''];
  selBudjet2=['',''];
  selected=0;
  nWbs =0;
  constructor(private configService :ConfigService) { }

  ngOnInit() {
   
    this.dataSource.paginator = this.paginator;    
    this.dataSource.sort = this.sort;
    this.getpeaList();
    this.rdproject();
    this.getJobProgress();
    this.getJobProgressPea();
    
  }
  applyFilter(filterValue: string) {
    
    this.dataSource.filter = (filterValue).trim().toLowerCase();
  }
  getJobProgress = () => {
    this.configService.getJobProgress('rdprogressmntAll.php?peaCode='+this.selPeapeaCode+'&filter1='+this.selBudjet2[0]+'&filter2='+this.selBudjet2[1]) 
    .subscribe(res => {
      this.dataSource.data = res as jobprogress[];
    })
  }
  getpeaList(){ 
    this.configService.postdata('rdpeaall.php',{}).subscribe((data=>{
      if(data.status==1){
        //console.log(data.data);
        this.peaname=data.data;
        //console.log(this.peaname);
      }else{
        alert(data.data);
      }
  
    }))
    
  } 
  rdproject(){
    this.configService.postdata('rdprogressmnt.php',{peaCode : this.selPeapeaCode}).subscribe((data=>{
      
      this.projectArr=[];
      this.porjectRemArr=[];
      this.workCostArr1=[];
      this.workCostArr2=[];
      this.workCostArr3=[];
      this.matCostArr1=[];
      this.matCostArr2=[];
      this.matCostArr3=[];
      this.totalwbs=0;
      data.data.forEach(element => {
        this.projectArr.push(element.projectName);
        this.porjectRemArr.push(element.nwbs);
        this.workCostArr3.push(((Number(element.workCostAct5)-Number(element.workCostAct4))/Number(element.workCostPln)*100).toFixed(2));
        this.workCostArr2.push(((Number(element.workCostAct4)-Number(element.workCostAct3))/Number(element.workCostPln)*100).toFixed(2));
        this.workCostArr1.push((Number(element.workCostAct3)/Number(element.workCostPln)*100).toFixed(2));
   
        this.matCostArr3.push(((Number(element.matCostAct5)-Number(element.matCostAct4))/Number(element.matCostPln)*100).toFixed(2));
        this.matCostArr2.push(((Number(element.matCostAct4)-Number(element.matCostAct3))/Number(element.matCostPln)*100).toFixed(2));
        this.matCostArr1.push((Number(element.matCostAct3)/Number(element.matCostPln)*100).toFixed(2));


      })
      
      this.porjectRemArr.forEach(element=>{
        this.totalwbs+=Number(element);

      })
      if (this.myDonut) this.myDonut.destroy();
      this.myDonut = new Chart('myDonut', {
        type: 'doughnut',
        data:  {
          datasets: [{
            data: this.porjectRemArr,
            backgroundColor: ["#ff5687","#ffce56","#56ffce","#5687ff","#ce56ff"],
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

    this.chartData= {
      labels: this.projectArr,
      datasets:[
      {
      label: '%เบิกจ่าย คชจ.หน้างาน เดือน มี.ค.',
      data: this.workCostArr1,
      backgroundColor: "#5687ff",
  },{
    label: '%เบิกจ่าย คชจ.หน้างาน  เดือน เม.ย.',
    data: this.workCostArr2,
    backgroundColor: "#ffce56",
},{
  label: '%เบิกจ่าย คชจ.หน้างาน  เดือน พ.ค.',
  data: this.workCostArr3,
  backgroundColor: "#56ffce",
}]};
      if (this.myBar) this.myBar.destroy();
      this.myBar = new Chart('myBar', {
        type: 'bar',
        data:  this.chartData,
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
            stacked: true,
          }]
        },
        title: {
          display: true,
          text: "%เบิกจ่าย คชจ.หน้างาน แยกตามโครงการย้อนหลัง 3 เดือน"
        }
      } 
    });
    this.chartData= {
      labels: this.projectArr,
      datasets:[
      {
      label: '%เบิกจ่ายค่าวัสดุ เดือน มี.ค.',
      data: this.matCostArr1,
      backgroundColor: "#5687ff",
  },{
    label: '%เบิกจ่ายค่าวัสดุ  เดือน เม.ย.',
    data: this.matCostArr2,
    backgroundColor: "#ffce56",
},{
  label: '%เบิกจ่ายค่าวัสดุ  เดือน พ.ค.',
  data: this.matCostArr3,
  backgroundColor: "#56ffce",
}]};
      if (this.myBar2) this.myBar2.destroy();
      this.myBar2 = new Chart('myBar2', {
        type: 'bar',
        data:  this.chartData,
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
            stacked: true,
          }]
        },
        title: {
          display: true,
          text: "%เบิกจ่ายค่าวัสดุ แยกตามโครงการย้อนหลัง 3 เดือน"
        }
      } 
    });

    }));
  }

  selectPea(event){
   
    this.selPea=event.value[0];
    
    this.selPeapeaCode=event.value[1];
    this.rdproject();
    this.getJobProgressPea();
    this.getJobProgress();
    /*
    //this.getJobProgress();
    this.getData(this.selPea,this.selBudjet);
    this.rdsumcost();
    this.getJobProgressPea();
    */
  }

  getJobProgressPea(){ 

     this.configService.postdata('rdJobProgressPea.php',{peaCode : this.selPeapeaCode,filter1: this.selBudjet[0],filter2: this.selBudjet[1]}).subscribe((data=>{
      if(data.status==1){
        this.WorkCostPea=[];
        this.WorkCostPercentPea=[];
  
        this.nwbsArr=[];
        this.matCostPercentPea=[];
        data.data.forEach(element => {
 


        
        
          this.nwbsArr.push(element.nWBS);
          this.WorkCostPea.push(element.Pea);
          this.WorkCostPercentPea.push((Number(element.workCostAct)/Number(element.workCostPln)*100).toFixed(2));
          this.matCostPercentPea.push((Number(element.matCostAct)/Number(element.matCostPln)*100).toFixed(2));
         
          
        });
        
        if (this.selected==0) {
          this.chartData={
            labels: this.WorkCostPea,
            datasets: [{
            label: 'จำนวนงานคงค้าง',
            data: this.nwbsArr,
            backgroundColor:'#07CCD6',
           }]};
          this.chartTitle='จำนวนงานคงค้าง'}
        else {
          this.chartData= {
            labels: this.WorkCostPea,
            datasets:[
            {
            label: 'คชจ.หน้างาน',
            data: this.WorkCostPercentPea,
            backgroundColor: '#07CCD6',
        },
      {
        label: 'ค่าพัสดุ',
        data: this.matCostPercentPea,
        backgroundColor: '#DAF7A6',
      }]};
          this.chartTitle='% การเบิกจ่าย';
        }
        
        
        if (this.myBar3) this.myBar3.destroy();

        this.myBar3 = new Chart('myBar3', {
          type: 'bar',
          data:  this.chartData,
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
        //this.nwbs=data.data.nwbs;
        //this.WorkCostPercent=Number(data.data.workCostAct)/Number(data.data.workCostPln*0.8)*100;
        
      }else{
        alert(data.data);
      }
  
    }));

  

  }


  selectDataType(event){
    this.selected=event.value;
    this.getJobProgressPea();
  }
  selectBudget(event){

    this.selBudjet=event.value;
    this.getJobProgressPea();
  }
  selectBudget2(event){

    this.selBudjet2=event.value;
    this.getJobProgress();
  }
}
