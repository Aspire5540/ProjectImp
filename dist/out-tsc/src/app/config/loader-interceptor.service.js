import * as tslib_1 from "tslib";
import { Injectable } from "@angular/core";
import { finalize } from "rxjs/operators";
import { LoaderserviceService } from '../config/loaderservice.service';
let LoaderInterceptorService = class LoaderInterceptorService {
    constructor(loaderService) {
        this.loaderService = loaderService;
    }
    intercept(req, next) {
        this.loaderService.show();
        return next.handle(req).pipe(finalize(() => this.loaderService.hide()));
    }
};
LoaderInterceptorService = tslib_1.__decorate([
    Injectable({
        providedIn: 'root'
    }),
    tslib_1.__metadata("design:paramtypes", [LoaderserviceService])
], LoaderInterceptorService);
export { LoaderInterceptorService };
//# sourceMappingURL=loader-interceptor.service.js.map