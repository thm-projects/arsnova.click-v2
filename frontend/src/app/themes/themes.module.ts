import { NgModule } from '@angular/core';
import {SharedModule} from "../shared/shared.module";
import {ThemesComponent} from "./themes.component";

@NgModule({
  imports: [
    SharedModule
  ],
  exports: [ThemesComponent],
  declarations: [ThemesComponent]
})
export class ThemesModule { }
