import * as tslib_1 from "tslib";
import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConfigService } from '../config/config.service';
import { AuthService } from '../config/auth.service';
import { HttpClient } from '@angular/common/http';
import { FileuploadService } from '../config/fileupload.service';
let UploadComponent = class UploadComponent {
    constructor(configService, authService, http, uploadService) {
        this.configService = configService;
        this.authService = authService;
        this.http = http;
        this.uploadService = uploadService;
        this.URL = "http://127.0.0.1/psisservice/uploadssap/";
        this.uploadDocResponse = '';
        this.uploadDocResponse2 = '';
        this.peaCode = "";
    }
    ngOnInit() {
        this.peaCode = localStorage.getItem('peaCode');
    }
    handleFile048(event) {
        //console.log(event.target.files[0]);
        const formData = new FormData();
        formData.append('avatar', event.target.files[0]);
        this.uploadService.uploadZap048(formData).subscribe(res => {
            this.uploadDocResponse = res.status;
            //console.log(res);   
        });
    }
    handleFileGIS(event) {
        //console.log(event.target.files[0]);
        const formData = new FormData();
        formData.append('avatar', event.target.files[0]);
        this.uploadService.uploadGIS(formData).subscribe(res => {
            this.uploadDocResponse2 = res.status;
            //console.log(res);   
        });
    }
    onSubmit() {
        this.configService.postdata2('w048tosql.php', this.registerForm.value).subscribe((data => {
            if (data['status'] == 1) {
                this.registerForm.resetForm();
                alert("เก็บข้อมูลแล้วเสร็จ");
            }
            else {
                alert(data['data']);
            }
        }));
    }
    onSubmit2() {
        this.configService.postdata2('phase/gistosql.php', {}).subscribe((data => {
            if (data['status'] == 1) {
                this.registerForm.resetForm();
                alert("เก็บข้อมูลแล้วเสร็จ");
            }
            else {
                alert(data['data']);
            }
        }));
    }
};
tslib_1.__decorate([
    ViewChild('f', { static: false }),
    tslib_1.__metadata("design:type", NgForm)
], UploadComponent.prototype, "registerForm", void 0);
UploadComponent = tslib_1.__decorate([
    Component({
        selector: 'app-upload',
        templateUrl: './upload.component.html',
        styleUrls: ['./upload.component.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [ConfigService, AuthService, HttpClient, FileuploadService])
], UploadComponent);
export { UploadComponent };
//# sourceMappingURL=upload.component.js.map