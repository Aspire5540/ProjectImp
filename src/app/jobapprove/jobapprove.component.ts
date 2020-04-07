import { Component, OnInit,ViewChild } from '@angular/core';
import {NgForm} from '@angular/forms';
import { ConfigService } from '../config/config.service';

import {MatTableDataSource,MatPaginator} from '@angular/material';
import { jobreq  } from '../model/user.model';
import { HttpClient,HttpHandler } from '@angular/common/http';
import {MatSort} from '@angular/material/sort';
import {Chart} from 'chart.js';
@Component({
  selector: 'app-jobapprove',
  templateUrl: './jobapprove.component.html',
  styleUrls: ['./jobapprove.component.scss']
})
export class JobapproveComponent implements OnInit {
  public dataSource = new MatTableDataSource<jobreq>();
  @ViewChild('f') registerForm: NgForm;
  selPeapeaCode = 'B000';
  projectName='';
  WorkCost =0 ;
  WorkCostPercent=0;
  WorkCostApp=0;
  projectBudget=0;
  nwbs=0;
  nwbsArr=[];
  nwbsApp=[];
  peaname = [];
  peaCode="";
  URL ="http://172.18.226.19/psisservice/uploads/";
  WorkCostPercentPea=[];
  matCostPercentPea=[];
  WorkCostPea=[];
  myPieChart: Chart;
  chartData: any;
  chartTitle:string;

 budjets=[];
  dataTypes=[
    {value: 0, viewValue: 'จำนวนงานคงค้าง'},
    {value: 1, viewValue: '% เบิกจ่าย'},
    {value: 2, viewValue: 'งานที่ขออนุมัติ'},

  ];
  selPea='';
  totalWbs=0;
  selBudjet=['',''];
  selected=2;
  nWbs =0;
  displayedColumns = ['wbs', 'jobName','mv','lv','tr', 'causeName', 'solveMet','note','workCostPln','user','del'];

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('sort') sort: MatSort;

  constructor(private configService :ConfigService) {}
  ngOnInit() {
    
    //this.getData(this.selPea,this.selBudjet);
    //this.rdsumcost();
    this.peaCode = localStorage.getItem('peaCode');
    this.dataSource.paginator = this.paginator; 
    this.dataSource.sort = this.sort;
    this.getpeaList();
    this.getFilter();
    //this.getJobProgress();
    this.getJobProgressPea();


  }
  selectDataType(event){
    this.selected=event.value;
    this.getJobProgressPea();
    
  }
  getFilter(){
    this.configService.postdata2('rdfilter.php',{}).subscribe((data=>{
      if(data['status']==1){
          data['data'].forEach(element => {
            this.budjets.push({value: [element.filter1,element.filter2], viewValue: element.project})
          });
      }else{
        alert(data['data']);
      }
    }))
  }
  getData = (pea,data) => {
    
    this.configService.getJob('rdimjobview.php?peaCode='+pea+'&filter1='+data[0]+'&filter2='+data[1])
    .subscribe(res => {
      this.dataSource.data = res as jobreq[];
      this.dataSource.paginator = this.paginator; 
      this.dataSource.sort = this.sort;
    })
  }
  applyFilter(filterValue: string) {
    //console.log((filterValue+" "+localStorage.getItem('peaEng')).trim().toLowerCase());
    this.dataSource.filter = (filterValue).trim().toLowerCase();
  }

  selWbs(wbsdata){ 
    this.configService.postdata2('addjob.php',{ wbs: wbsdata.wbs, status : 1 }).subscribe((data=>{
      if(data['status']==1){
          this.getData(this.selPea,this.selBudjet);
          this.rdsumcost();
          this.getJobProgressPea();
          //alert("ลบข้อมูลแล้วเสร็จ");
      }else{
        alert(data['data']);
      }
  
    }))
    
  } 
  getpeaList(){ 
    this.configService.postdata2('rdpeaall.php',{}).subscribe((data=>{
      if(data['status']==1){
        //console.log(data['data']);
        this.peaname=data['data'];
        //console.log(this.peaname);
      }else{
        alert(data['data']);
      }
  
    }))
    
  } 
  getJobProgressPea(){ 

    if (this.selected==2){
      this.configService.postdata2('rdsummaryAll.php',{peaCode : this.selPeapeaCode,filter1: this.selBudjet[0],filter2: this.selBudjet[1]}).subscribe((data=>{
        if(data['status']==1){
          this.WorkCostPea=[];
          this.nwbsArr=[];
          this.nwbsApp=[];
         
          data['nwbsApp'].forEach(element => {
            this.WorkCostPea.push(element.Pea);
            this.nwbsApp.push(element.nstatus);
            this.nwbsArr.push(element.totalWbs);
           

          });
        
          
         // console.log(data.nwbsApp);
          this.chartData= {
            labels: this.WorkCostPea,
            datasets:[
            {
            label: 'งานที่ขออนุมัติ',
            data: this.nwbsArr,
            backgroundColor: '#07CCD6',
        },
      {
        label: 'งานที่อนุมัติครั้งนี้',
        data: this.nwbsApp,
        backgroundColor: '#DAF7A6',
      }]};
        this.chartTitle='จำนวนงานที่ขออนุมัติเปิดงาน';
        if (this.myPieChart) this.myPieChart.destroy();
            this.myPieChart = new Chart('myPieChart', {
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
            } ,
            
          });

        }


      }));


    }else{
    this.configService.postdata2('rdJobProgressPea.php',{peaCode : this.selPeapeaCode,filter1: this.selBudjet[0],filter2: this.selBudjet[1]}).subscribe((data=>{
      if(data['status']==1){
        this.WorkCostPea=[];
        this.WorkCostPercentPea=[];
  
        this.nwbsArr=[];
        this.matCostPercentPea=[];
        data['data'].forEach(element => {
 


        
        
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
        
        
        if (this.myPieChart) this.myPieChart.destroy();

        this.myPieChart = new Chart('myPieChart', {
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
          }
        } 
      });
        //this.nwbs=data['data'].nwbs;
        //this.WorkCostPercent=Number(data['data'].workCostAct)/Number(data['data'].workCostPln*0.8)*100;
        
      }else{
        alert(data['data']);
      }
  
    }));

  }

  }
  getApproved(){ 
    this.configService.postdata2('rdapproved.php',{peaEng : this.selPea,filter1: this.selBudjet[0],filter2: this.selBudjet[1]}).subscribe((data=>{
      if(data['status']==1){
        
        this.WorkCostApp=Number(data['data'].sumWorkCostPln);
        this.projectBudget=Number(data['data'].budget);
        //console.log(this.peaname);
      }else{
        alert(data['data']);
      }
  
    }));
    
  } 
  delWbs(wbsdata){
    //console.log(wbsdata);
    this.configService.postdata2('addjob.php',{ wbs: wbsdata.wbs, status : 0 }).subscribe((data=>{
      if(data['status']==1){
          this.getData(this.selPea,this.selBudjet);
          this.rdsumcost();
          this.getJobProgressPea();
          //alert("ลบข้อมูลแล้วเสร็จ");
      }else{
        alert(data['data']);
      }
  
    }))
    
  } 
  rdsumcost(){
    this.configService.postdata2('rdsummary.php',{ peaEng : this.selPea,filter1: this.selBudjet[0],filter2: this.selBudjet[1]}).subscribe((data=>{
  
      this.getData(this.selPea,this.selBudjet);
      this.nWbs=Number(data['nWbs']);
      this.WorkCost=Number(data['sumWorkCostPln']);
      this.totalWbs=Number(data['totalWbs']);
     
    }))
  }
  selectBudget(event){

    this.selBudjet=event.value;
    
    this.getApproved();
    this.getData(this.selPea,this.selBudjet);
    //this.getJobProgress();
    this.rdsumcost();
    this.getJobProgressPea();
  }
  selectPea(event){
   
    this.selPea=event.value[0];
    this.selPeapeaCode=event.value[1];
    //this.getJobProgress();
    this.getData(this.selPea,this.selBudjet);
    this.rdsumcost();
    this.getJobProgressPea();
 
  }
  onSubmit(){
    var wdata = this.registerForm.value;
    wdata["filter1"] = this.selBudjet[0];
    wdata["filter2"] = this.selBudjet[1];
    console.log(wdata);
    
    this.configService.postdata2('wrAppJob.php',wdata).subscribe((data=>{
      if(data['status']==1){
          this.getData(this.selPea,this.selBudjet);
          this.rdsumcost();
          this.getJobProgressPea();
          this.registerForm.resetForm();
          alert("บันทึกแล้วเสร็จ");
      }else{
        alert(data['data']);
      }
  
    }))
    
  }
  exportAsXLSX():void {
    this.configService.exportAsExcelFile(this.dataSource.data, 'sample');
 }
}
