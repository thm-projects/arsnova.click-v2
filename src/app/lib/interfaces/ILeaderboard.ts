export declare interface ILeaderBoardItem {
  name: string;
  responseTime: number;
  score: number;
}

export declare interface ILeaderBoard {
  attendees: Array<ILeaderBoardItem>;
}

export declare interface ILeaderBoardItem {
  name: string;
  responseTime: number;
  correctQuestions: Array<number>;
  confidenceValue: number;
}
