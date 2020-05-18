import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { ConfigService } from '../config/config.service';
let NavbarComponent = class NavbarComponent {
    constructor(configService, config) {
        this.configService = configService;
        this.sidebarOpened = false;
        config.placement = 'bottom-right';
    }
    toggleOffcanvas() {
        this.sidebarOpened = !this.sidebarOpened;
        console.log(this.sidebarOpened);
        if (this.sidebarOpened) {
            document.querySelector('.sidebar-offcanvas').classList.add('active');
        }
        else {
            document.querySelector('.sidebar-offcanvas').classList.remove('active');
        }
    }
    ngOnInit() {
        this.configService.currentMessage.subscribe(message => this.message = message);
        //console.log(this.message);
    }
};
NavbarComponent = tslib_1.__decorate([
    Component({
        selector: 'app-navbar',
        templateUrl: './navbar.component.html',
        styleUrls: ['./navbar.component.scss'],
        providers: [NgbDropdownConfig]
    }),
    tslib_1.__metadata("design:paramtypes", [ConfigService, NgbDropdownConfig])
], NavbarComponent);
export { NavbarComponent };
//# sourceMappingURL=navbar.component.js.map