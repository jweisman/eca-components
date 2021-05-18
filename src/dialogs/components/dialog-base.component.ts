import { Inject } from "@angular/core";
import { Component } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { take } from 'rxjs/operators';
import { DialogData, DialogType } from "../dialog";
import { i18n } from "../i18n";

@Component({
  selector: 'base-dialog',
  template: ''
})
export class BaseDialog {
  text: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public translate: TranslateService,
  ) {}

  ngOnInit() {
    /* Once app translations are loaded, merge with component strings */
    this.translate.getTranslation('en').pipe(take(1)).subscribe(() => {
      /* On the next tick otherwise template won't update */
      setTimeout(() => Object.entries(i18n).forEach(([k, v]) => this.translate.setTranslation(k, v, true)));
    });
  }

  ngAfterContentInit() {
    let data: DialogData = {
      cancel: 'Cancel',
      ok: 'OK',
      type: DialogType.OK_CANCEL,
    }
    this.data = Object.assign(data, this.data);
    let text: string, options: any;
    if (Array.isArray(this.data.text)) {
      [text, options] = this.data.text;
    } else {
      text = this.data.text;
    }
    if(!!text) this.text = this.translate.instant(text, options);
  }
}