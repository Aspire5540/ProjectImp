import { TestBed } from '@angular/core/testing';
import { RestService } from './rest.service';
describe('RestService', function () {
    beforeEach(function () { return TestBed.configureTestingModule({}); });
    it('should be created', function () {
        var service = TestBed.get(RestService);
        expect(service).toBeTruthy();
    });
});
//# sourceMappingURL=rest.service.spec.js.map