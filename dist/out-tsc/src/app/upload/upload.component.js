var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConfigService } from '../config/config.service';
import 'rxjs/add/observable/of';
import { AuthService } from '../config/auth.service';
import { HttpClient } from '@angular/common/http';
import { FileuploadService } from '../config/fileupload.service';
var UploadComponent = /** @class */ (function () {
    function UploadComponent(configService, authService, http, uploadService) {
        this.configService = configService;
        this.authService = authService;
        this.http = http;
        this.uploadService = uploadService;
        this.URL = "http://127.0.0.1/psisservice/uploadssap/";
    }
    UploadComponent.prototype.ngOnInit = function () {
    };
    __decorate([
        ViewChild('f'),
        __metadata("design:type", NgForm)
    ], UploadComponent.prototype, "registerForm", void 0);
    UploadComponent = __decorate([
        Component({
            selector: 'app-upload',
            templateUrl: './upload.component.html',
            styleUrls: ['./upload.component.scss']
        }),
        __metadata("design:paramtypes", [ConfigService, AuthService, HttpClient, FileuploadService])
    ], UploadComponent);
    return UploadComponent;
}());
export { UploadComponent };
//# sourceMappingURL=upload.component.js.map