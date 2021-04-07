import { Injectable, Type } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BaseDialog } from './components/dialog-base.component';
import { ConfirmDialog, ConfirmDialogData } from './components/confirm.component';
import { DialogType } from './dialog';
import { PromptDialog, PromptDialogData } from './components/prompt.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor( 
    private dialog: MatDialog
  ) {}

  /** Confirm dialog */
  confirm(data: ConfirmDialogData): Observable<boolean> {
    return this.dialog.open(ConfirmDialog, {
      data: data,
      autoFocus: data.type == DialogType.OK
    }).afterClosed();
  }

  /** Alert dialog */
  alert(data: ConfirmDialogData): Observable<boolean> {
    return this.dialog.open(ConfirmDialog, {
      data: Object.assign({}, data, { type: DialogType.OK }),
      autoFocus: true
    }).afterClosed();
  }

  /** Prompt dialog */
  prompt(data: PromptDialogData): Observable<any>;
  prompt(component: Type<BaseDialog>, data: PromptDialogData): Observable<any>;
  prompt(componentOrData: Type<BaseDialog> | PromptDialogData, data?: PromptDialogData): Observable<any> {
    let component: Type<BaseDialog>;
    if (componentOrData instanceof Type) {
      component = componentOrData;
    } else {
      component = PromptDialog;
      data = componentOrData;
    }
    return this.dialog.open(component, {
      data: data,
      autoFocus: false,
    }).afterClosed();
  }
}