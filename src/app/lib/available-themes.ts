import { QuizTheme } from './enums/QuizTheme';
import { ITheme } from './interfaces/ITheme';

export const themes: Array<ITheme> = [
  {
    name: 'component.theme_switcher.themes.material.name',
    preview: 'component.theme_switcher.themes.material.preview',
    description: 'component.theme_switcher.themes.material.description',
    id: QuizTheme.Material,
  }, {
    name: 'component.theme_switcher.themes.black_beauty.name',
    preview: 'component.theme_switcher.themes.black_beauty.preview',
    description: 'component.theme_switcher.themes.black_beauty.description',
    id: QuizTheme.Blackbeauty,
  }, {
    name: 'component.theme_switcher.themes.westermann-blue.name',
    preview: 'component.theme_switcher.themes.westermann-blue.preview',
    description: 'component.theme_switcher.themes.westermann-blue.description',
    id: QuizTheme.WestermannBlue,
  },
];
