import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ILogin } from '../login';
import { AuthService } from '../config/auth.service';
import { ConfigService } from '../config/config.service';
import 'rxjs/add/observable/of';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  //model: ILogin = { userid: "admin", password: "admin123" };
  loginForm: FormGroup;
  message: string;
  returnUrl: string;
  islogin : boolean;




  constructor(private configService :ConfigService,private formBuilder: FormBuilder,private router: Router, public authService: AuthService) { }



  ngOnInit() {
   
    this.loginForm = this.formBuilder.group({
      userid: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.returnUrl = '/sumtable';
    this.authService.logout();
  }
  get f() { return this.loginForm.controls; }

  login() {

    // stop here if form is invalid
    
      console.log({ userName: this.f.userid.value, password: this.f.password.value });
      
      this.configService.postdata('login.php',{ userName: this.f.userid.value, password: this.f.password.value }).subscribe((data=>{
        //console.log(data);
        
        if(data.status==1){
          this.islogin=true;
          localStorage.setItem('isLoggedIn', "true");
          localStorage.setItem('token', this.f.userid.value);
          localStorage.setItem('name', data.data["Name"]);
          localStorage.setItem('peaName', data.data["peaName"]);
          localStorage.setItem('peaCode', data.data["Peacode"]);
          this.configService.changeMessage();
          //window.location.reload();
          //this.router.navigate([this.returnUrl]);
          
      }else{
        this.message =data.data;
        this.islogin=false;
      }
        
      }))

      if (this.islogin){

        this.configService.postdata('rdpea.php',{ peaCode: localStorage.getItem('peaCode')}).subscribe((data=>{
        localStorage.setItem('peaEng', data.data["peaEng"]);
        this.configService.changeMessage();
        //window.location.reload();
        this.router.navigate([this.returnUrl]);
        console.log(data);
        



      }))


    }    

  }
}