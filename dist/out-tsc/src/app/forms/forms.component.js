import * as tslib_1 from "tslib";
import { filter, merge, map, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { Component, ViewChild } from '@angular/core';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
const states = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado',
    'Connecticut', 'Delaware', 'District Of Columbia', 'Federated States Of Micronesia', 'Florida', 'Georgia',
    'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
    'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana',
    'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
    'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico', 'Rhode Island',
    'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Islands', 'Virginia',
    'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
let FormsComponent = class FormsComponent {
    constructor() {
        this.search = (text$) => text$.pipe(debounceTime(200), distinctUntilChanged(), map(term => term.length > 1 ? []
            : states.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)));
        this.focus$ = new Subject();
        this.click$ = new Subject();
        this.focusSearch = (text$) => text$.pipe(debounceTime(200), distinctUntilChanged(), merge(this.focus$), merge(this.click$.pipe(filter(() => !this.instance.isPopupOpen()))), map(term => (term === '' ? states : states.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10)));
    }
    ngOnInit() {
        this.currentRate = 8;
    }
};
tslib_1.__decorate([
    ViewChild('instance', { static: true }),
    tslib_1.__metadata("design:type", NgbTypeahead)
], FormsComponent.prototype, "instance", void 0);
FormsComponent = tslib_1.__decorate([
    Component({
        selector: 'app-forms',
        templateUrl: './forms.component.html',
        styleUrls: ['./forms.component.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [])
], FormsComponent);
export { FormsComponent };
//# sourceMappingURL=forms.component.js.map