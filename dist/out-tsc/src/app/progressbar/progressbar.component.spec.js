import { async, TestBed } from '@angular/core/testing';
import { ProgressbarComponent } from './progressbar.component';
describe('ProgressbarComponent', () => {
    let component;
    let fixture;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ProgressbarComponent]
        })
            .compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(ProgressbarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=progressbar.component.spec.js.map