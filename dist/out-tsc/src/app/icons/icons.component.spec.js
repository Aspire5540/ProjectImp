import { async, TestBed } from '@angular/core/testing';
import { IconsComponent } from './icons.component';
describe('IconsComponent', () => {
    let component;
    let fixture;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [IconsComponent]
        })
            .compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(IconsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=icons.component.spec.js.map