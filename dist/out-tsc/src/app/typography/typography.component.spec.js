import { async, TestBed } from '@angular/core/testing';
import { TypographyComponent } from './typography.component';
describe('TypographyComponent', () => {
    let component;
    let fixture;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TypographyComponent]
        })
            .compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(TypographyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=typography.component.spec.js.map