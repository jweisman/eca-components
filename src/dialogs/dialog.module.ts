import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfirmDialog } from './components/confirm.component';
import { PromptDialog } from './components/prompt.component';
import { MaterialModule } from '@exlibris/exl-cloudapp-angular-lib';
import { FormsModule } from '@angular/forms';
import { BaseDialog } from './components/dialog-base.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    TranslateModule,
  ],
  declarations: [BaseDialog,ConfirmDialog,PromptDialog],
  entryComponents: [BaseDialog,ConfirmDialog,PromptDialog],
})
export class DialogModule { }