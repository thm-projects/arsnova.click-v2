import { QuizTheme } from '../enums/QuizTheme';

export interface ITheme {
  name: string;
  preview: string;
  description: string;
  id: QuizTheme;
}

export interface IThemeHashMap {
  hash: string;
  theme: string;
}
