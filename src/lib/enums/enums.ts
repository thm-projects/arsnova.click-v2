export enum Filter {
  None, //
  Unused, //
  InvalidKeys, //
  InvalidDE, //
  InvalidEN, //
  InvalidES, //
  InvalidFr, //
  InvalidIt, //
}

export enum LanguageTranslation {
  DE = 'Deutsch', //
  EN = 'English', //
  FR = 'Français', //
  IT = 'Italiano', //
  ES = 'Español', //
}

export enum NumberType {
  Decimal  = 'decimal', //
  Currency = 'currency', //
  Percent  = 'percent', //
}

export enum CurrencyType {
  DE = 'EUR', //
  EN = 'EUR', //
  FR = 'EUR', //
  IT = 'EUR', //
  ES = 'EUR', //
}

export enum Language {
  EN = 'en', //
  DE = 'de', //
  FR = 'fr', //
  ES = 'es', //
  IT = 'it', //
}

export enum Project {
  Frontend = 'arsnova-click-v2-frontend', //
  Backend  = 'arsnova-click-v2-backend', //
}

export enum StorageKey {
  PrivateKey   = 'PrivateKey', //
  Language     = 'Language', //
  QuizTheme    = 'QuizTheme', //
  DefaultTheme = 'DefaultTheme', //
}

export enum DbName {
  Default = 'Default', //
}

export enum DbTable {
  Config = 'Config', //
  Quiz   = 'Quiz', //
}

export enum TrackingCategoryType {
  Click, //
  Conversion, //
  ThemeChange, //
  ThemePreview, //
}
