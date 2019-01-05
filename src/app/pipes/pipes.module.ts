import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FilterKeysPipe } from './filter-keys/filter-keys.pipe';
import { JustAFewPipe } from './justafew/justafew.pipe';
import { SearchFilterPipe } from './search-filter/search-filter.pipe';
import { SortPipe } from './sort/sort.pipe';
import { UnusedKeyFilterPipe } from './unused-key-filter/unused-key-filter.pipe';

@NgModule({
  imports: [CommonModule],
  exports: [JustAFewPipe, FilterKeysPipe, SearchFilterPipe, SortPipe, UnusedKeyFilterPipe],
  declarations: [JustAFewPipe, FilterKeysPipe, SearchFilterPipe, SortPipe, UnusedKeyFilterPipe],
})
export class PipesModule {
  public static forRoot(): object {
    return {
      ngModule: PipesModule,
      providers: [],
    };
  }
}
