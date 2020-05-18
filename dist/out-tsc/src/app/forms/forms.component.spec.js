import { async, TestBed } from '@angular/core/testing';
import { FormsComponent } from './forms.component';
describe('FormsComponent', () => {
    let component;
    let fixture;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FormsComponent]
        })
            .compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(FormsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=forms.component.spec.js.map