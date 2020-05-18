import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { LoaderserviceService } from '../config/loaderservice.service';
let LoaderComponent = class LoaderComponent {
    constructor(loaderService) {
        this.loaderService = loaderService;
        this.color = 'primary';
        this.mode = 'indeterminate';
        this.value = 50;
        this.isLoading = this.loaderService.isLoading;
    }
};
LoaderComponent = tslib_1.__decorate([
    Component({
        selector: 'app-loader',
        templateUrl: './loader.component.html',
        styleUrls: ['./loader.component.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [LoaderserviceService])
], LoaderComponent);
export { LoaderComponent };
//# sourceMappingURL=loader.component.js.map