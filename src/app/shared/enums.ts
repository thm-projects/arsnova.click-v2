export enum FILTER {
  NONE, //
  UNUSED, //
  INVALID_KEYS, //
  INVALID_DE, //
  INVALID_EN, //
  INVALID_ES, //
  INVALID_FR, //
  INVALID_IT, //
}

export enum LANGUAGE_TRANSLATION {
  DE = <any>'Deutsch', //
  EN = <any>'English', //
  FR = <any>'Français', //
  IT = <any>'Italiano', //
  ES = <any>'Español', //
}

export enum NUMBER_TYPE {
  DECIMAL  = <any>'decimal', //
  CURRENCY = <any>'currency', //
  PERCENT  = <any>'percent', //
}

export enum CURRENCY_TYPE {
  DE = <any>'EUR', //
  EN = <any>'EUR', //
  FR = <any>'EUR', //
  IT = <any>'EUR', //
  ES = <any>'EUR', //
}

export enum LANGUAGE {
  EN = 'EN', //
  DE = 'DE', //
  FR = 'FR', //
  ES = 'ES', //
  IT = 'IT', //
}

export enum PROJECT {
  FRONTEND = 'arsnova-click-v2-frontend', //
  BACKEND  = 'arsnova-click-v2-backend', //
}

export enum STORAGE_KEY {
  WEBSOCKET_AUTHORIZATION = 'WEBSOCKET_AUTHORIZATION', //
  PROVIDE_NICK_SELECTION  = 'PROVIDE_NICK_SELECTION', //
  ATTENDEES               = 'ATTENDEES', //
  SERVER_SETTINGS         = 'SERVER_SETTINGS', //
  TOKEN                   = 'TOKEN', //
  MEMBER_GROUP            = 'MEMBER_GROUP', //
  CURRENT_QUIZ            = 'CURRENT_QUIZ', //
  ACTIVE_QUESTION_GROUP   = 'ACTIVE_QUESTION_GROUP', //
  LANGUAGE                = 'LANGUAGE', //
  QUIZ_THEME              = 'QUIZ_THEME', //
  PRIVATE_KEY             = 'PRIVATE_KEY', //
  NICK                    = 'NICK', //
  INTRO_STATE             = 'INTRO_STATE', //
  SHOW_PRODUCT_TOUR       = 'SHOW_PRODUCT_TOUR', //
  DEFAULT_THEME           = 'DEFAULT_THEME', //
}

export enum STORAGE_TYPE {
  LOCAL, //
  SESSION, //
}

export enum DB_NAME {
  DEFAULT = 'DEFAULT', //
}

export enum DB_TABLE {
  CONFIG = 'CONFIG', //
  QUIZ   = 'QUIZ', //
}

export enum TRACKING_EVENT_TYPE {
  INTERACTION, //
  NON_INTERACTION, //
}

export enum TRACKING_CATEGORY_TYPE {
  CLICK, //
  CONVERSION, //
  THEME_CHANGE, //
  THEME_PREVIEW, //
}
