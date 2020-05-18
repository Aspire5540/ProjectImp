import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
let AuthService = class AuthService {
    constructor() { }
    logout() {
        localStorage.setItem('isLoggedIn', "false");
        localStorage.removeItem('token');
        localStorage.removeItem('name');
        localStorage.removeItem('peaName');
        localStorage.removeItem('peaCode');
    }
};
AuthService = tslib_1.__decorate([
    Injectable({
        providedIn: 'root'
    }),
    tslib_1.__metadata("design:paramtypes", [])
], AuthService);
export { AuthService };
//# sourceMappingURL=auth.service.js.map