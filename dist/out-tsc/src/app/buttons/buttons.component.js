import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
let ButtonsComponent = class ButtonsComponent {
    constructor() {
        this.model = 1;
        this.checkboxModel = {
            left: true,
            middle: false,
            right: false
        };
    }
    ngOnInit() {
    }
};
ButtonsComponent = tslib_1.__decorate([
    Component({
        selector: 'app-buttons',
        templateUrl: './buttons.component.html',
        styleUrls: ['./buttons.component.scss'],
        encapsulation: ViewEncapsulation.None
    }),
    tslib_1.__metadata("design:paramtypes", [])
], ButtonsComponent);
export { ButtonsComponent };
//# sourceMappingURL=buttons.component.js.map