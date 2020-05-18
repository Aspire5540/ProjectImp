import { async, TestBed } from '@angular/core/testing';
import { PsimdashboardComponent } from './psimdashboard.component';
describe('PsimdashboardComponent', () => {
    let component;
    let fixture;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PsimdashboardComponent]
        })
            .compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(PsimdashboardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=psimdashboard.component.spec.js.map