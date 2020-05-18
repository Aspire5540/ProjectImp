import { TestBed } from '@angular/core/testing';
import { RestService } from './rest.service';
describe('RestService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));
    it('should be created', () => {
        const service = TestBed.get(RestService);
        expect(service).toBeTruthy();
    });
});
//# sourceMappingURL=rest.service.spec.js.map