import { ElementRef, Inject, ViewChild } from "@angular/core";
import { Component } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from "@ngx-translate/core";
import { BaseDialog } from './dialog-base.component';
import { DialogData } from "../dialog";

export interface PromptDialogData extends DialogData {
  prompt?: string;
  val?: any;
}

@Component({
  selector: 'prompt-dialog',
  template: `<h2 mat-dialog-title translate>{{data.title}}</h2>
  <mat-dialog-content>
    <p *ngIf="text">{{text}}</p>
    <mat-form-field>
      <mat-label>{{data.prompt | translate}}</mat-label>
      <input matInput #input [(ngModel)]="data.val" 
        (keyup.enter)="dialogRef.close(data.val)"
      >
    </mat-form-field>
  </mat-dialog-content>
  <mat-dialog-actions align="end">
    <button mat-flat-button color="secondary" *ngIf="data.type=='ok-cancel'" mat-dialog-close>{{data.cancel || 'Cancel' | translate}}</button>
    <button mat-flat-button color="secondary" [mat-dialog-close]="data.val" cdkFocusInitial>{{data.ok || 'OK' | translate}}</button>
  </mat-dialog-actions>`
})
export class PromptDialog extends BaseDialog {
  @ViewChild('input') inputElement: ElementRef;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: PromptDialogData,
    public translate: TranslateService,
    public dialogRef: MatDialogRef<PromptDialog>
  ) {
    super(data,translate);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.inputElement != undefined) {
        const elem = this.inputElement.nativeElement as HTMLInputElement;
        elem.focus();
        elem.select();
      }
    });
  }
}