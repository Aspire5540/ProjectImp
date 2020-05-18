import * as tslib_1 from "tslib";
import { Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
//import { ILogin } from '../login';
import { AuthService } from '../config/auth.service';
import { ConfigService } from '../config/config.service';
import { NgForm } from '@angular/forms';
let LoginComponent = class LoginComponent {
    constructor(configService, formBuilder, route, router, authService) {
        this.configService = configService;
        this.formBuilder = formBuilder;
        this.route = route;
        this.router = router;
        this.authService = authService;
    }
    ngOnInit() {
        //this.returnUrl = '/phasecheck';
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/phasecheck';
        console.log(this.returnUrl);
        this.authService.logout();
        this.configService.changeMessage();
    }
    onSubmit() {
        this.configService.postdata2('login.php', this.registerForm.value).subscribe((data => {
            //console.log(this.registerForm.value,data);
            if (data['status'] == 1) {
                this.islogin = true;
                localStorage.setItem('isLoggedIn', "true");
                localStorage.setItem('token', this.registerForm.value.userName);
                localStorage.setItem('name', data['data']["Name"]);
                localStorage.setItem('peaName', data['data']["Peaname"]);
                localStorage.setItem('peaCode', data['data']["Peacode"]);
                this.configService.changeMessage();
                this.configService.postdata2('rdpea.php', { peaCode: data['data']["Peacode"] }).subscribe((pea => {
                    localStorage.setItem('peaEng', pea['data']["peaEng"]);
                    this.configService.changeMessage();
                }));
                this.router.navigate([this.returnUrl]);
                //window.location.reload();
                //this.router.navigate([this.returnUrl]);
            }
            else {
                this.message = data['data'];
                this.islogin = false;
            }
        }));
    }
};
tslib_1.__decorate([
    ViewChild('f', { static: true }),
    tslib_1.__metadata("design:type", NgForm)
], LoginComponent.prototype, "registerForm", void 0);
LoginComponent = tslib_1.__decorate([
    Component({
        selector: 'app-login',
        templateUrl: './login.component.html',
        styleUrls: ['./login.component.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [ConfigService, FormBuilder, ActivatedRoute, Router, AuthService])
], LoginComponent);
export { LoginComponent };
//# sourceMappingURL=login.component.js.map