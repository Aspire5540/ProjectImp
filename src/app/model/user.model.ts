
export interface Product {
  name: string;
  email: string;
  phone: string;
  company: {
      name: string;
  }
  } 

  export interface GithubApi {
    items: GithubIssue[];
    total_count: number;
  }
  
  export interface GithubIssue {
    created_at: string;
    number: string;
    state: string;
    title: string;
  }

  export interface Owner{
    id: number;
    employee_name: string;
    employee_salary: number;
    employee_age: number;
    profile_image:string;

}

export class User {
  id: number;
  userName: string;
  password: string;
  name: string;
  peacode: string;
  peaname: string;
}
export interface wbsdata {
  projectType : string;
  wbs : string;
  jobName : string;
  docName : string;
  causeName : string;
  solveMet  : string;
  mv  : number;
  tr  : number;
  lv : number;
  filename : string;
  peatr : number;
  vdrop : number;
  loadTr : number;
  status : string;
  user : string;
  peaCode : string;
  note:string;
}

export interface jobreq {
  projectType : string;
  wbs : string;
  jobName : string;
  docName : string;
  causeName : string;
  solveMet  : string;
  mv  : number;
  tr  : number;
  lv : number;
  filename : string;
  fileDocname : string;
  peatr : number;
  vdrop : number;
  loadTr : number;
  status : string;
  user : string;
  peaCode : string;
  workCostPln : number;
  matCostPln : number;
}
export interface jobprogress {
  wbs : string;
  jobName : string;
  workCostPln : number;
  matCostPln : number;
  matCostActM5:number;
  matCostActM4:number;
  matCostActM3:number;
  workCostP5:number;
  workCostP4:number;
  workCostP3:number;
}
export interface appJob {
  wbs : string;
  jobName :string;
  mv  : number;
  tr  : number;
  lv : number;
  workCostPln : number;
  totalcost : number;
  matCostInPln:number;
  appNo:number;

}
export interface trdata {
  PEA_TR : string;
  Location : string;
  Feeder : number;
  LineSize : string;
  Aoj : string;
  Kva : number;
  minV  : number;
  NumberCus  : number;
  I  : number;
  Load : number;
  PLoad : number;
  PLoadTOT : number;
  Loss : number;
  PLoss : number;
  LoadFlowStatus : string;
  MaxLen : number;
  PEAName : string;
  PEAName2 : string;
  VRange : number;
  TotalCus : number;
  TRRange : number;
  PLoadPortion : number;
  Status : string;
  WBS : string;
}

export interface meterdata {
  PEA_TR : string;
  PEA_Meter : string;
  kWh : number;
  CustName : string;
  rate : string;
  rateMeter : string;
  Voltage:number;
}