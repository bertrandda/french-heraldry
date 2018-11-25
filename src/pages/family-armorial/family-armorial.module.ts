import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FamilyArmorialPage } from './family-armorial';

@NgModule({
  declarations: [
    FamilyArmorialPage,
  ],
  imports: [
    IonicPageModule.forChild(FamilyArmorialPage),
  ],
})
export class FamilyArmorialPageModule {}