import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CloudAppEventsService } from '@exlibris/exl-cloudapp-angular-lib';
import { Entity, EntityType } from '@exlibris/exl-cloudapp-angular-lib';
import { TranslateService } from '@ngx-translate/core';
import { i18n } from '../../i18n'
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
 
@Component({
  selector: 'eca-select-entities',
  templateUrl: './select-entities.component.html',
  styleUrls: ['./select-entities.component.scss'],
})
export class SelectEntitiesComponent implements OnInit, OnDestroy {

  private _entityType: EntityType;

  masterChecked: boolean;
  masterIndeterminate: boolean;
  items = new Array<SelectItem>();

  /* Entities Observable */
  @Input() entities$ = this.eventsService.entities$;
  subscription$: Subscription;

  /** Selected entities */
  @Input() selected = new Array<Entity>();
  @Output() selectedChange = new EventEmitter<Entity[]>();

  /** Supported Entity Types */
  @Input() entityTypes: EntityType[];

  /** Count of entities */
  @Output() count = new EventEmitter<number>();

  constructor(
    private translate: TranslateService,
    private eventsService: CloudAppEventsService,
  ) { }

  ngOnInit() {
    /* Subscribe to entities observable */
    this.subscription$ = this.entities$.subscribe(this.entitiesUpdated);
    /* Once app translations are loaded, merge with component strings */
    this.translate.getTranslation('en').pipe(take(1)).subscribe(() => {
      Object.entries(i18n).forEach(([k, v]) => this.translate.setTranslation(k, v, true));
    });
    this.masterChecked = false;
    this.count.emit(0);
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }

  entitiesUpdated = (entities: Entity[]) => {
    if (Array.isArray(this.entityTypes))
      entities = entities.filter(e=>this.entityTypes.includes(e.type));

    this.count.emit(entities.length);
    /* If different list, clear selected */
    if (entities.length == 0 || entities[0].type != this._entityType) {
      this.clear();
    }
    this._entityType = entities[0] && entities[0].type;
    this.items = entities.map(e=>({ value: e, checked: this.isEntitySelected(e) }));
    this.determineMasterValue();
  }

  masterChange() {
    Object.values(this.items).forEach(b=>{
      b.checked = this.masterChecked;
      this.entitySelected(b.value, b.checked)
    })
  }

  listChange(e: Entity, checked: boolean){
    this.determineMasterValue();
    this.entitySelected(e, checked);
  }

  entitySelected(entity: Entity, checked: boolean) {
    const index = this.selected.findIndex(e=>entity.id===e.id)
    if (checked && !~index) this.selected.push(entity);
    else if (!checked && ~index) this.selected.splice(index, 1);
    this.selectedChange.emit(this.selected);
  }

  private isEntitySelected = (entity: Entity) => this.selected.some(e=>entity.id===e.id);

  private determineMasterValue() {
    const checked_count = Object.values(this.items).filter(i=>i.checked).length;
    this.masterChecked = checked_count == this.items.length;
    this.masterIndeterminate = checked_count > 0 && checked_count < this.items.length;
  }

  /** Clear all selected values */
  clear() {
    this.selected = [];
    this.selectedChange.emit(this.selected);
    Object.values(this.items).forEach(b => b.checked = false);
    this.determineMasterValue();
  }
}

interface SelectItem {
  checked: boolean;
  value: any;
}