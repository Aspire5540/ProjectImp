var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../config/auth.service';
import { ConfigService } from '../config/config.service';
import 'rxjs/add/observable/of';
var LoginComponent = /** @class */ (function () {
    function LoginComponent(configService, formBuilder, router, authService) {
        this.configService = configService;
        this.formBuilder = formBuilder;
        this.router = router;
        this.authService = authService;
    }
    LoginComponent.prototype.ngOnInit = function () {
        this.loginForm = this.formBuilder.group({
            userid: ['', Validators.required],
            password: ['', Validators.required]
        });
        this.returnUrl = '/sumtable';
        this.authService.logout();
    };
    Object.defineProperty(LoginComponent.prototype, "f", {
        get: function () { return this.loginForm.controls; },
        enumerable: true,
        configurable: true
    });
    LoginComponent.prototype.login = function () {
        // stop here if form is invalid
        var _this = this;
        console.log({ userName: this.f.userid.value, password: this.f.password.value });
        this.configService.postdata('login.php', { userName: this.f.userid.value, password: this.f.password.value }).subscribe((function (data) {
            //console.log(data);
            if (data.status == 1) {
                _this.islogin = true;
                localStorage.setItem('isLoggedIn', "true");
                localStorage.setItem('token', _this.f.userid.value);
                localStorage.setItem('name', data.data["Name"]);
                localStorage.setItem('peaName', data.data["peaName"]);
                localStorage.setItem('peaCode', data.data["Peacode"]);
                _this.configService.changeMessage();
                //window.location.reload();
                //this.router.navigate([this.returnUrl]);
            }
            else {
                _this.message = data.data;
                _this.islogin = false;
            }
        }));
        if (this.islogin) {
            this.configService.postdata('rdpea.php', { peaCode: localStorage.getItem('peaCode') }).subscribe((function (data) {
                localStorage.setItem('peaEng', data.data["peaEng"]);
                _this.configService.changeMessage();
                //window.location.reload();
                _this.router.navigate([_this.returnUrl]);
                console.log(data);
            }));
        }
    };
    LoginComponent = __decorate([
        Component({
            selector: 'app-login',
            templateUrl: './login.component.html',
            styleUrls: ['./login.component.scss']
        }),
        __metadata("design:paramtypes", [ConfigService, FormBuilder, Router, AuthService])
    ], LoginComponent);
    return LoginComponent;
}());
export { LoginComponent };
//# sourceMappingURL=login.component.js.map