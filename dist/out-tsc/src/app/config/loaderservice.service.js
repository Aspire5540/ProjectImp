import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
let LoaderserviceService = class LoaderserviceService {
    constructor() {
        this.isLoading = new Subject();
    }
    show() {
        this.isLoading.next(true);
    }
    hide() {
        this.isLoading.next(false);
    }
};
LoaderserviceService = tslib_1.__decorate([
    Injectable({
        providedIn: 'root'
    })
], LoaderserviceService);
export { LoaderserviceService };
//# sourceMappingURL=loaderservice.service.js.map