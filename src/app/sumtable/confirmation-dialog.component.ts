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
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<ConfirmationDialog>) {
    if(data){
    this.message = "ต้องการลบ "+data.wbs.wbs || this.message;
    this.wbs=data.wbs;
    this.choice=data.choice;
    this.newWbs=data.wbs.wbs;
      }
  }

  onConfirmClick(): void {
    this.wbs["newWbs"]=this.newWbs;
    this.dialogRef.close(this.wbs);
  }

}