import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
let FileuploadService = class FileuploadService {
    //SERVER_URL: string = "http://127.0.0.1/psisservice/";
    constructor(http) {
        this.http = http;
        this.SERVER_URL = "http://172.18.226.19/psisservice/";
    }
    upload(data) {
        let uploadURL = `${this.SERVER_URL}/upload.php`;
        return this.http.post(uploadURL, data);
    }
    upload2(data) {
        let uploadURL = `${this.SERVER_URL}/upload2.php`;
        return this.http.post(uploadURL, data);
    }
    uploadDoc(data) {
        let uploadURL = `${this.SERVER_URL}/uploadDoc.php`;
        return this.http.post(uploadURL, data);
    }
    uploadDoc2(data) {
        let uploadURL = `${this.SERVER_URL}/uploadDoc2.php`;
        return this.http.post(uploadURL, data);
    }
    uploadZap048(data) {
        let uploadURL = `${this.SERVER_URL}/uploadZap048.php`;
        return this.http.post(uploadURL, data);
    }
    uploadGIS(data) {
        let uploadURL = `${this.SERVER_URL}/uploadGIS.php`;
        return this.http.post(uploadURL, data);
    }
};
FileuploadService = tslib_1.__decorate([
    Injectable({
        providedIn: 'root'
    }),
    tslib_1.__metadata("design:paramtypes", [HttpClient])
], FileuploadService);
export { FileuploadService };
//# sourceMappingURL=fileupload.service.js.map