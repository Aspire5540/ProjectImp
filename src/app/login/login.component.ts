import { Component, OnInit,ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
//import { ILogin } from '../login';
import { AuthService } from '../config/auth.service';
import { ConfigService } from '../config/config.service';
import 'rxjs/add/observable/of';
import {NgForm} from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild('f') registerForm: NgForm;
  //model: ILogin = { userid: "admin", password: "admin123" };
  loginForm: FormGroup;
  message: string;
  returnUrl: string;
  islogin : boolean;
 



  constructor(private configService :ConfigService,private formBuilder: FormBuilder,private router: Router, public authService: AuthService) { }


  ngOnInit() {
   

    this.returnUrl = '/psim';
    this.authService.logout();
    this.configService.changeMessage();
  }
  
  onSubmit(){
   
    this.configService.postdata('login.php',this.registerForm.value).subscribe((data=>{
      //console.log(data);
      
    if(data.status==1){
        this.islogin=true;
        localStorage.setItem('isLoggedIn', "true");
        localStorage.setItem('token', this.registerForm.value.userName);
        localStorage.setItem('name', data.data["Name"]);
        localStorage.setItem('peaName', data.data["peaName"]);
        localStorage.setItem('peaCode', data.data["Peacode"]);
    
        this.configService.changeMessage();
        this.configService.postdata('rdpea.php',{ peaCode: data.data["Peacode"]}).subscribe((pea=>{
          localStorage.setItem('peaEng', pea.data["peaEng"]);
          this.configService.changeMessage();   
        }))
        this.router.navigate([this.returnUrl]);
        //window.location.reload();
        //this.router.navigate([this.returnUrl]);
        
    }else{
      this.message =data.data;
      this.islogin=false;
    }
      
    }))


  }
 
}