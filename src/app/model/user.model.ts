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
  peatr : number;
  vdrop : number;
  loadTr : number;
  status : string;
  user : string;
  peaCode : string;
  workCostPln : number;
  matCostPln : number;
}