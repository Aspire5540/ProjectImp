import { async, TestBed } from '@angular/core/testing';
import { TablesComponent } from './tables.component';
describe('TablesComponent', () => {
    let component;
    let fixture;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TablesComponent]
        })
            .compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(TablesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=tables.component.spec.js.map