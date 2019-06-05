import { TestBed } from '@angular/core/testing';
import { ConfigService } from './config.service';
describe('ConfigService', function () {
    beforeEach(function () { return TestBed.configureTestingModule({}); });
    it('should be created', function () {
        var service = TestBed.get(ConfigService);
        expect(service).toBeTruthy();
    });
});
//# sourceMappingURL=config.service.spec.js.map