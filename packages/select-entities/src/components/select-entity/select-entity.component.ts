import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { CloudAppEventsService, Entity, EntityType } from "@exlibris/exl-cloudapp-angular-lib";
import { Subscription } from 'rxjs';

@Component({
  selector: 'eca-select-entity',
  templateUrl: './select-entity.component.html',
  styleUrls: ['./select-entity.component.scss'],
})
export class SelectEntityComponent implements OnInit, OnDestroy {

    private _entityType: EntityType;
    entities: Entity[];

    /* Entities Observable */
    @Input() entities$ = this.eventsService.entities$;
    subscription$: Subscription;
  
    /** Selected entities */
    @Input() selected: Entity;
    @Output() selectedChange = new EventEmitter<Entity>();
  
    /** Supported Entity Types */
    @Input() entityTypes: EntityType[];
  
    /** Count of entities */
    count: number = 0;

    constructor(
      private eventsService: CloudAppEventsService,
    ) { }
  
    ngOnInit() {
      /* Subscribe to entities observable */
      this.subscription$ = this.entities$.subscribe(this.entitiesUpdated);
    }

    ngOnDestroy() {
      this.subscription$.unsubscribe();
    }

    entitiesUpdated = (entities: Entity[]) => {
      if (Array.isArray(this.entityTypes))
        entities = entities.filter(e => this.entityTypes.includes(e.type));
      this.entities = entities;
      this.count = entities.length;
      /* If different list, clear selected */
      if (entities.length == 0 || entities[0].type != this._entityType) {
        this.clear();
      }
      this._entityType = entities[0] && entities[0].type;
    }

    entitySelected() {
      this.selectedChange.emit(this.selected);
    }

    /** Clear all selected values */
    clear() {
      this.selected = null;
      this.selectedChange.emit(this.selected);
    }

}
