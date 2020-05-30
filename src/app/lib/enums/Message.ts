export enum StatusProtocol {
  Failed  = 'Failed', //
  Success = 'Success', //
}

export enum MessageProtocol {
  UpdateBadgeAmount            = 'UpdateBadgeAmount', //
  PendingPoolQuestion          = 'PendingPoolQuestion', //
  PoolQuestionApproved         = 'PoolQuestionApproved', //
  RequestStatistics            = 'RequestStatistics', //
  Countdown                    = 'Countdown', //
  Updated                      = 'Updated', //
  UpdatedResponse              = 'UpdatedResponse', //
  Added                        = 'Added', //
  DuplicateResponse            = 'DuplicateResponse', //
  InvalidResponse              = 'InvalidResponse', //
  IllegalName                  = 'IllegalName', //
  DuplicateLogin               = 'DuplicateLogin', //
  Closed                       = 'Closed', //
  GetPlayers                   = 'GetPlayers', //
  Inactive                     = 'Inactive', //
  AllPlayers                   = 'AllPlayers', //
  UnknownGroup                 = 'UnknownGroup', //
  CasLoginRequired             = 'CasLoginRequired', //
  Opened                       = 'Opened', //
  Authenticate                 = 'Authenticate', //
  AuthenticateStatic           = 'AuthenticateStatic', //
  NotAuthorized                = 'NotAuthorized', //
  Authorized                   = 'Authorized', //
  AuthenticateAsOwner          = 'AuthenticateAsOwner', //
  InsufficientPermissions      = 'InsufficientPermissions', //
  UpdateLang                   = 'UpdateLang', //
  FileNotFound                 = 'FileNotFound', //
  InvalidData                  = 'InvalidData', //
  InvalidProjectSpecified      = 'InvalidProjectSpecified', //
  Init                         = 'Init', //
  Post                         = 'Post', //
  AlreadyTaken                 = 'AlreadyTaken', //
  Unavailable                  = 'Unavailable', //
  UpdatedSettings              = 'UpdatedSettings', //
  GetRemainingNicks            = 'GetRemainingNicks', //
  Exists                       = 'Exists', //
  ServerPasswordRequired       = 'ServerPasswordRequired', //
  TooMuchActiveQuizzes         = 'TooMuchActiveQuizzes', //
  SetActive                    = 'SetActive', //
  SetInactive                  = 'SetInactive', //
  IsInactive                   = 'IsInactive', //
  NextQuestion                 = 'NextQuestion', //
  Start                        = 'Start', //
  Stop                         = 'Stop', //
  Undefined                    = 'Undefined', //
  Available                    = 'Available', //
  ReadingConfirmationRequested = 'ReadingConfirmationRequested', //
  ConfidenceValueRequested     = 'ConfidenceValueRequested', //
  Reset                        = 'Reset', //
  InvalidParameters            = 'InvalidParameters', //
  UploadFile                   = 'UploadFile', //
  AlreadyStarted               = 'AlreadyStarted', //
  EndOfQuestions               = 'EndOfQuestions', //
  CurrentState                 = 'CurrentState', //
  GetStartTime                 = 'GetStartTime', //
  GetLeaderboardData           = 'GetLeaderboardData', //
  Reserved                     = 'Reserved', //
  Removed                      = 'Removed', //
  GetThemes                    = 'GetThemes', //
  QuizAssets                   = 'QuizAssets', //
  Render                       = 'Render', //
  Connected                    = 'Connected', //
  QuizNotFound                 = 'QuizNotFound', //
  Connect                      = 'Connect', //
  Disconnect                   = 'Disconnect', //
  Editable                     = 'Editable', //
  GetFreeMemberGroup           = 'GetFreeMemberGroup', //
  RequestTweets                = 'RequestTweets', //
}

export const Message = {
  Status: StatusProtocol,
  Message: MessageProtocol,
};
