import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FamilyArmorialPage } from './family-armorial';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    FamilyArmorialPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(FamilyArmorialPage)
  ],
})
export class FamilyArmorialPageModule {}
