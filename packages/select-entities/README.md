# Select Entities

A reusable component for Ex Libris Cloud Apps to select entities visible on the current Alma screen. Features include:
* Display description of page entities
* Check/uncheck all
* Selection across multiple pages in Alma


## Installation
```
$ npm install eca-select-entities --save
```

In _app.module.ts_:
```
import { SelectEntitiesModule } from 'eca-select-entities';

...

@NgModule({
  imports: [
  ...
    SelectEntitiesModule,
  ],
```

## Usage
The select entities component requires a reference to the components on the page, a list to collect the selected entities into, and a way to know if an entity is pre-selected.

### Component Class
To begin using the component, you add a few members to your component.ts file. First, expose the [`entities$` observable](https://developers.exlibrisgroup.com/cloudapps/docs/api/events-service/#entities). You can optionally filter based on supported entity types:
```
  public entities$ = 
    this.eventsService.entities$.pipe(
      map(entities=>entities.filter(e=>[EntityType.ITEM].includes(e.type))),
    );
```

Next add a list to collect selected entities, a handler for when an entity is checked or unchecked, and a function to determine if an entity should be pre-selected. You can use an `Array` as follows:
```
  selectedEntities = new Array<Entity>();

  isEntitySelected = (entity: Entity) => this.selectedEntities.find(e=>entity.id===e.id);

  onEntitySelected(event: {entity: Entity, checked: boolean}) {
    const entity = event.entity;
    const index = this.selectedEntities.findIndex(e=>entity.id===e.id)
    if (event.checked && !~index) this.selectedEntities.push(entity);
    else if (~index) this.selectedEntities.splice(index, 1);
  }
```
Or a `List` of one of the entity properties:
```
  selectedEntities = new Set<string>();

  isEntitySelected = (entity: Entity) => this.selectedEntities.has(entity.link);

  onEntitySelected(event: {entity: Entity, checked: boolean}) {
    if (event.checked) this.selectedEntities.add(event.entity.link);
    else this.selectedEntities.delete(event.entity.link);
  }
```

### Template
Finally, in your component.html page, add a reference to the component and the members defined in the previous step:
```
  <eca-select-entities
    (entitySelected)="onEntitySelected($event)"
    [entityList]="entities$ | async"
    [isEntitySelected]="isEntitySelected">
  </eca-select-entities>
```

### Other methods
The component also supports the following methods:
**`clear`**
Clears all selected items:
```
  @ViewChild(SelectEntitiesComponent) selectEntitiesComponent: SelectEntitiesComponent;

  clear() {
    this.selectedEntities = [];
    this.selectEntitiesComponent.clear();
  }
```