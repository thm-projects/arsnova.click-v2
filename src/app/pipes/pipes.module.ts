import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FilterKeysPipe } from './filter-keys/filter-keys.pipe';
import { GenericFilterPipe } from './generic-filter/generic-filter.pipe';
import { JustAFewPipe } from './justafew/justafew.pipe';
import { QuizAdminFilterPipe } from './quiz-admin-filter/quiz-admin-filter.pipe';
import { SearchFilterPipe } from './search-filter/search-filter.pipe';
import { SortPipe } from './sort/sort.pipe';
import { UnusedKeyFilterPipe } from './unused-key-filter/unused-key-filter.pipe';

@NgModule({
  imports: [CommonModule],
  exports: [JustAFewPipe, FilterKeysPipe, SearchFilterPipe, SortPipe, UnusedKeyFilterPipe, QuizAdminFilterPipe, GenericFilterPipe],
  declarations: [JustAFewPipe, FilterKeysPipe, SearchFilterPipe, SortPipe, UnusedKeyFilterPipe, QuizAdminFilterPipe, GenericFilterPipe],
})
export class PipesModule {
}
