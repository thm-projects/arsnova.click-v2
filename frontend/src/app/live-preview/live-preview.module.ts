import {NgModule} from '@angular/core';
import {LivePreviewComponent} from './live-preview/live-preview.component';
import {SharedModule} from '../shared/shared.module';
import {HeaderModule} from '../header/header.module';

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
