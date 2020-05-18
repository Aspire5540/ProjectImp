import * as tslib_1 from "tslib";
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
let ConfirmdlgComponent = class ConfirmdlgComponent {
    constructor(data, dialogRef) {
        this.data = data;
        this.dialogRef = dialogRef;
        this.message = "ต้องการลบใช่หรือไม่?";
        this.confirmButtonText = "ใช่";
        this.cancelButtonText = "ยกเลิก";
        this.uploadResponse = '';
        this.uploadDocResponse = '';
        if (data) {
            this.output = data;
            this.choice = data.choice;
            console.log(data);
        }
    }
    onConfirmClick() {
        this.dialogRef.close(this.output);
    }
};
ConfirmdlgComponent = tslib_1.__decorate([
    Component({
        selector: 'app-confirmdlg',
        templateUrl: './confirmdlg.component.html',
        styleUrls: ['./confirmdlg.component.scss']
    }),
    tslib_1.__param(0, Inject(MAT_DIALOG_DATA)),
    tslib_1.__metadata("design:paramtypes", [Object, MatDialogRef])
], ConfirmdlgComponent);
export { ConfirmdlgComponent };
//# sourceMappingURL=confirmdlg.component.js.map