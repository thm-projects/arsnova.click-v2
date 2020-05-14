export enum LoginMechanism {
  UsernamePassword, Token
}

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
  EN = 'GBP', //
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
  PushSubscription       = 'PushSubscription', //
  TwitterOptIn           = 'TwitterOptIn', //
  CurrentQuestionIndex   = 'CurrentQuestionIndex', //
  PrivateKey             = 'PrivateKey', //
  LoginToken             = 'LoginToken', //
  QuizToken              = 'QuizToken', //
  CasToken               = 'CasToken', //
  CurrentQuizName        = 'CurrentQuizName', //
  CurrentNickName        = 'CurrentNickName', //
  CurrentMemberGroupName = 'CurrentMemberGroupName', //
  Language               = 'Language', //
  QuizTheme              = 'QuizTheme', //
  DefaultTheme           = 'DefaultTheme', //
}

export enum DbState {
  Initialized, //
  Revalidate, //
  Destroy, //
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

export enum DeprecatedKeys {
  privateKey                     = 'privateKey', //
  token                          = 'token', //
  language                       = 'language', //
  showProductTour                = 'showProductTour', //
  localStorageAvailable          = 'localStorageAvailable', //
  intro_state                    = 'intro_state', //
  lastPage                       = 'lastPage', //
  theme                          = 'theme', //
  hashtags                       = 'hashtags', //
  '__amplify__tap-i18n-language' = '__amplify__tap-i18n-language', //
}

export enum DeprecatedDb {
  DEFAULT = 'DEFAULT', //
}

export enum Title {
  Default, Westermann
}
