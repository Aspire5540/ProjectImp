import { async, TestBed } from '@angular/core/testing';
import { JobapproveComponent } from './jobapprove.component';
describe('JobapproveComponent', () => {
    let component;
    let fixture;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [JobapproveComponent]
        })
            .compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(JobapproveComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=jobapprove.component.spec.js.map