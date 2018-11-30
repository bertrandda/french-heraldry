import { Component, Input } from '@angular/core';

/**
 * Generated class for the ItemEmblemListComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'item-emblem-list',
  templateUrl: 'item-emblem-list.html'
})
export class ItemEmblemListComponent {

  @Input() imageUrl;
  @Input() title;
  @Input() description;

  constructor() {}

}
