import { AbstractAnswerEntity } from './entities/answer/AbstractAnswerEntity';
import { DefaultAnswerEntity } from './entities/answer/DefaultAnswerEntity';
import { FreeTextAnswerEntity } from './entities/answer/FreetextAnwerEntity';
import { AnswerType } from './enums/AnswerType';

export const getAnswerForType = (type: AnswerType, data?: object): AbstractAnswerEntity => {
  switch (type) {
    case AnswerType.DefaultAnswerOption:
      return new DefaultAnswerEntity(data);
    case AnswerType.FreeTextAnswerOption:
      return new FreeTextAnswerEntity(data);
    default:
      throw new Error(`Cannot built answer with type: ${type}`);
  }
};
