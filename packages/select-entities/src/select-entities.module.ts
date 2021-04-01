import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@exlibris/exl-cloudapp-angular-lib';
import { TranslateModule } from '@ngx-translate/core';
import { SelectEntitiesComponent } from './select-entities.component';

@NgModule({
  declarations: [ SelectEntitiesComponent ],
  imports: [ 
    MaterialModule, 
    FormsModule, 
    CommonModule,
    TranslateModule
  ],
  exports: [ SelectEntitiesComponent ]
})
export class SelectEntitiesModule { }


