import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
let RestService = class RestService {
    constructor(http) {
        this.http = http;
    }
};
RestService = tslib_1.__decorate([
    Injectable({
        providedIn: 'root'
    }),
    tslib_1.__metadata("design:paramtypes", [HttpClient])
], RestService);
export { RestService };
//# sourceMappingURL=rest.service.js.map