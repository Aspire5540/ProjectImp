import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ILogin } from '../login';
import { AuthService } from '../config/auth.service';
import { ConfigService } from '../config/config.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  model: ILogin = { userid: "admin", password: "admin123" };
  loginForm: FormGroup;
  message: string;
  returnUrl: string;





  constructor(private configService :ConfigService,private formBuilder: FormBuilder,private router: Router, public authService: AuthService) { }



  ngOnInit() {
   
    this.loginForm = this.formBuilder.group({
      userid: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.returnUrl = '/dashboard';
    this.authService.logout();
  }
  get f() { return this.loginForm.controls; }

  login() {

    // stop here if form is invalid
      console.log({ user: this.f.userid.value, password: this.f.password.value });
      this.configService.postdata('login.php',{ userName: this.f.userid.value, password: this.f.password.value }).subscribe((data=>{
        if(data.status==1){
          alert(data.data);
          console.log(data.data);
            //alert("เก็บข้อมูลแล้วเสร็จ");
        }else{
          alert(data.data);
          console.log(data.data);
        }
  
      }))
      if(this.f.userid.value == this.model.userid && this.f.password.value == this.model.password){
        console.log("Login successful");
        //this.authService.authLogin(this.model);
        localStorage.setItem('isLoggedIn', "true");
        localStorage.setItem('token', this.f.userid.value);
        this.router.navigate([this.returnUrl]);
      }
      else{
        this.message = "Please check your userid and password";
      }
    }    




}
