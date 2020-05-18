import * as tslib_1 from "tslib";
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FileuploadService } from '../config/fileupload.service';
let ConfirmationDialog = class ConfirmationDialog {
    constructor(uploadService, data, dialogRef) {
        this.uploadService = uploadService;
        this.data = data;
        this.dialogRef = dialogRef;
        this.message = "ต้องการลบใช่หรือไม่?";
        this.confirmButtonText = "ใช่";
        this.cancelButtonText = "ยกเลิก";
        this.uploadResponse = '';
        this.uploadDocResponse = '';
        if (data) {
            this.message = "ต้องการลบ " + data.wbs.wbs || this.message;
            this.wbs = data.wbs;
            this.choice = data.choice;
            this.newWbs = data.wbs.wbs;
            this.newJobName = data.wbs.jobName;
            this.newMv = data.wbs.mv;
            this.newLv = data.wbs.lv;
            this.newTr = data.wbs.tr;
            this.newNday = data.wbs.nday;
            this.newPeaTr = data.wbs.peatr;
            this.newKva = data.wbs.kva;
            this.newVin = data.wbs.vin;
            this.newVdrop = data.wbs.vdrop;
            this.newLoadTr = data.wbs.loadTr;
            this.newTrTap = data.wbs.trTap;
            this.newIa = data.wbs.ia;
            this.newIb = data.wbs.ib;
            this.newIc = data.wbs.ic;
            this.newLen = data.wbs.len;
        }
    }
    onConfirmClick() {
        this.wbs["newWbs"] = this.newWbs;
        this.wbs["newJobName"] = this.newJobName;
        this.wbs["newMv"] = this.newMv;
        this.wbs["newLv"] = this.newLv;
        this.wbs["newTr"] = this.newTr;
        this.wbs["newNday"] = this.newNday;
        this.wbs["newPeaTr"] = this.newPeaTr;
        this.wbs["newKva"] = this.newKva;
        this.wbs["newVin"] = this.newVin;
        this.wbs["newVdrop"] = this.newVdrop;
        this.wbs["newLoadTr"] = this.newLoadTr;
        this.wbs["newTrTap"] = this.newTrTap;
        this.wbs["newIa"] = this.newIa;
        this.wbs["newIb"] = this.newIb;
        this.wbs["newIc"] = this.newIc;
        this.wbs["newLen"] = this.newLen;
        this.dialogRef.close(this.wbs);
    }
    handleFileInput(event) {
        //console.log(event.target.files[0]);
        const formData = new FormData();
        formData.append('avatar', event.target.files[0]);
        formData.append('wbs', this.wbs["wbs"]);
        this.uploadService.upload2(formData).subscribe((res) => {
            this.uploadResponse = res.status;
            //console.log(res);
        }, (err) => {
            //console.log(err);
        });
    }
    handleFileDoc(event) {
        //console.log(event.target.files[0]);
        console.log(event);
        const formData = new FormData();
        formData.append('avatar', event.target.files[0]);
        formData.append('wbs', this.wbs["wbs"]);
        console.log(formData);
        this.uploadService.uploadDoc2(formData).subscribe((res) => {
            this.uploadDocResponse = res.status;
            console.log(res);
        }, (err) => {
            console.log(err);
        });
    }
};
ConfirmationDialog = tslib_1.__decorate([
    Component({
        selector: 'confirmation-dialog',
        templateUrl: 'confirmation-dialog.html',
    }),
    tslib_1.__param(1, Inject(MAT_DIALOG_DATA)),
    tslib_1.__metadata("design:paramtypes", [FileuploadService, Object, MatDialogRef])
], ConfirmationDialog);
export { ConfirmationDialog };
//# sourceMappingURL=confirmation-dialog.component.js.map