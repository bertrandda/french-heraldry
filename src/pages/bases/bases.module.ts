import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BasesPage } from './bases';

@NgModule({
  declarations: [
    BasesPage,
  ],
  imports: [
    IonicPageModule.forChild(BasesPage),
  ],
})
export class BasesPageModule {}
