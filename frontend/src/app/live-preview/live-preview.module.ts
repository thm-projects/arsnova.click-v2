import {NgModule} from '@angular/core';
import {LivePreviewComponent} from './live-preview/live-preview.component';
import {SharedModule} from '../shared/shared.module';
import {HeaderModule} from '../header/header.module';

export enum DeviceTypes {
  XS, SM, MD, LG, XLG
}

export enum EnvironmentTypes {
  ANSWEROPTIONS, QUESTION
}

@NgModule({
  imports: [
    SharedModule,
    HeaderModule
  ],
  declarations: [LivePreviewComponent],
  exports: [LivePreviewComponent]
})
export class LivePreviewModule {
}
