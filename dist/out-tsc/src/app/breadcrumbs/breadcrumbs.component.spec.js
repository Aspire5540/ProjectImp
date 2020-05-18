import { async, TestBed } from '@angular/core/testing';
import { BreadcrumbsComponent } from './breadcrumbs.component';
describe('BreadcrumbsComponent', () => {
    let component;
    let fixture;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [BreadcrumbsComponent]
        })
            .compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(BreadcrumbsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=breadcrumbs.component.spec.js.map