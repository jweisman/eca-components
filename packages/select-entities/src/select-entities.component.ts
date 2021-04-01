import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Entity, EntityType } from "@exlibris/exl-cloudapp-angular-lib";
import { TranslateService } from '@ngx-translate/core';
import { i18n } from './i18n'
import { take } from 'rxjs/operators';
 
@Component({
  selector: 'eca-select-entities',
  templateUrl: './select-entities.component.html',
  styleUrls: ['./select-entities.component.scss'],
})
export class SelectEntitiesComponent implements OnInit {
  masterChecked: boolean;
  masterIndeterminate: boolean;
  entities: SelectItem[];
  @Input() isEntitySelected: (e: Entity) => boolean;
  @Output() entitySelected = 
    new EventEmitter<{entity: SelectItem, checked: boolean}>();

  constructor(
    private translate: TranslateService,
  ) { }

  ngOnInit() {
    /* Once app translations are loaded, merge with component strings */
    this.translate.getTranslation('en').pipe(take(1)).subscribe(() => {
      Object.entries(i18n).forEach(([k, v]) => this.translate.setTranslation(k, v, true));
    });
    this.masterChecked = false;
  }

  /** List of entities displayed on page */
  @Input()
  set entityList(val: Entity[]) {
    this.entities = val.map(i=>new SelectItem(i, this.isEntitySelected));
    this.determineMasterValue();
  }

  masterChange() {
    Object.values(this.entities).forEach(b=>{
      b.checked = this.masterChecked;
      this.entitySelected.emit({entity: b, checked: b.checked})
    })
  }

  listChange(e: SelectItem, checked: boolean){
    this.determineMasterValue();
    this.entitySelected.emit({entity: e, checked: checked});
  }

  private determineMasterValue() {
    const checked_count = Object.values(this.entities).filter(i=>i.checked).length;
    this.masterChecked = checked_count == this.entities.length;
    this.masterIndeterminate = checked_count > 0 && checked_count < this.entities.length;
  }

  /** Clear all selected values */
  clear() {
    Object.values(this.entities).forEach(b => b.checked = false);
    this.determineMasterValue();
  }
}

export class SelectItem implements Entity {
  checked: boolean;
  id: string;
  description: string;
  code: string;
  name: string;
  link: string;
  type: EntityType;

  constructor(item: Partial<SelectItem>, checker: (e: Entity) => boolean) {
    Object.assign(this, item);
    this.name = (this.description || this.code) || this.id;
    this.checked = checker(item as Entity);
  }
}
