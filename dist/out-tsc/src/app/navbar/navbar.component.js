var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { ConfigService } from '../config/config.service';
var NavbarComponent = /** @class */ (function () {
    function NavbarComponent(configService, config) {
        this.configService = configService;
        this.sidebarOpened = false;
        config.placement = 'bottom-right';
    }
    NavbarComponent.prototype.toggleOffcanvas = function () {
        this.sidebarOpened = !this.sidebarOpened;
        if (this.sidebarOpened) {
            document.querySelector('.sidebar-offcanvas').classList.add('active');
        }
        else {
            document.querySelector('.sidebar-offcanvas').classList.remove('active');
        }
    };
    NavbarComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.configService.currentMessage.subscribe(function (message) { return _this.message = message; });
        //console.log(this.message);
    };
    NavbarComponent = __decorate([
        Component({
            selector: 'app-navbar',
            templateUrl: './navbar.component.html',
            styleUrls: ['./navbar.component.scss'],
            providers: [NgbDropdownConfig]
        }),
        __metadata("design:paramtypes", [ConfigService, NgbDropdownConfig])
    ], NavbarComponent);
    return NavbarComponent;
}());
export { NavbarComponent };
//# sourceMappingURL=navbar.component.js.map