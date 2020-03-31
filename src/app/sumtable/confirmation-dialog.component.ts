import { Component, Inject } from '@angular/core';
import { VERSION, MatDialogRef, MatDialog, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'confirmation-dialog',
  templateUrl: 'confirmation-dialog.html',
})
export class ConfirmationDialog {
  message: string = "Are you sure?"
  confirmButtonText = "ใช่"
  cancelButtonText = "ยกเลิก"
  wbs:string;
  choice:number;
  newWbs:string;
  newJobName:string;
  newMv:number;
  newLv:number;
  newTr:number;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<ConfirmationDialog>) {
    if(data){
    
    this.message = "ต้องการลบ "+data.wbs.wbs || this.message;
    this.wbs=data.wbs;
    this.choice=data.choice;
    this.newWbs=data.wbs.wbs;
    this.newJobName=data.wbs.jobName;
    this.newMv=data.wbs.mv;
    this.newLv=data.wbs.lv;
    this.newTr=data.wbs.tr;
      }
  }

  onConfirmClick(): void {
    this.wbs["newWbs"]=this.newWbs;
    this.wbs["newJobName"]=this.newJobName;
    this.wbs["newMv"]=this.newMv;
    this.wbs["newLv"]=this.newLv;
    this.wbs["newTr"]=this.newTr;
    this.dialogRef.close(this.wbs);
  }

}