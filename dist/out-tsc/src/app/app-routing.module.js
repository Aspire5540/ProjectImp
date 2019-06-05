var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsComponent } from './forms/forms.component';
import { ButtonsComponent } from './buttons/buttons.component';
import { TablesComponent } from './tables/tables.component';
import { IconsComponent } from './icons/icons.component';
import { TypographyComponent } from './typography/typography.component';
import { AlertsComponent } from './alerts/alerts.component';
import { AccordionsComponent } from './accordions/accordions.component';
import { BadgesComponent } from './badges/badges.component';
import { ProgressbarComponent } from './progressbar/progressbar.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { PaginationComponent } from './pagination/pagination.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { TooltipsComponent } from './tooltips/tooltips.component';
import { CarouselComponent } from './carousel/carousel.component';
import { TabsComponent } from './tabs/tabs.component';
import { SumtableComponent } from './sumtable/sumtable.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { UploadComponent } from './upload/upload.component';
import { JobapproveComponent } from './jobapprove/jobapprove.component';
var routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'forms', component: FormsComponent },
    { path: 'buttons', component: ButtonsComponent },
    { path: 'tables', component: TablesComponent },
    { path: 'icons', component: IconsComponent },
    { path: 'typography', component: TypographyComponent },
    { path: 'alerts', component: AlertsComponent },
    { path: 'accordions', component: AccordionsComponent },
    { path: 'badges', component: BadgesComponent },
    { path: 'progressbar', component: ProgressbarComponent },
    { path: 'breadcrumbs', component: BreadcrumbsComponent },
    { path: 'pagination', component: PaginationComponent },
    { path: 'dropdowns', component: DropdownComponent },
    { path: 'tooltips', component: TooltipsComponent },
    { path: 'carousel', component: CarouselComponent },
    { path: 'tabs', component: TabsComponent },
    { path: 'sumtable', component: SumtableComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'upload', component: UploadComponent },
    { path: 'jobapprove', component: JobapproveComponent }
];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = __decorate([
        NgModule({
            imports: [RouterModule.forRoot(routes)],
            exports: [RouterModule]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());
export { AppRoutingModule };
//# sourceMappingURL=app-routing.module.js.map