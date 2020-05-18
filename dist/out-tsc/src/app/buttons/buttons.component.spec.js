import { async, TestBed } from '@angular/core/testing';
import { ButtonsComponent } from './buttons.component';
describe('ButtonsComponent', () => {
    let component;
    let fixture;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ButtonsComponent]
        })
            .compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(ButtonsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=buttons.component.spec.js.map