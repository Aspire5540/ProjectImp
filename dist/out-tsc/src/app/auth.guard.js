import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
let AuthGuard = class AuthGuard {
    constructor(router) {
        this.router = router;
    }
    canActivate(route, state) {
        let url = state.url;
        return this.verifyLogin(url);
    }
    verifyLogin(url) {
        if (!this.isLoggedIn()) {
            this.router.navigate(['/login']);
            this.router.navigate(['login'], { queryParams: { returnUrl: url } });
            return false;
        }
        else if (this.isLoggedIn()) {
            return true;
        }
    }
    isLoggedIn() {
        let status = false;
        if (localStorage.getItem('isLoggedIn') == "true") {
            status = true;
        }
        else {
            status = false;
        }
        return status;
    }
};
AuthGuard = tslib_1.__decorate([
    Injectable({
        providedIn: 'root'
    }),
    tslib_1.__metadata("design:paramtypes", [Router])
], AuthGuard);
export { AuthGuard };
//# sourceMappingURL=auth.guard.js.map