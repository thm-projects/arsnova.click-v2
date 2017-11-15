import * as sha256 from 'crypto-js/sha256';
import * as Hex from 'crypto-js/enc-hex';
import * as fs from 'fs';
import * as request from 'request';
import {DatabaseTypes, DbDao} from '../db/DbDAO';
import {IQuestion} from '../interfaces/questions/interfaces';
import {staticStatistics} from '../statistics';
import {IAnswerOption} from '../interfaces/answeroptions/interfaces';

export const assetsUrlRegex = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;

export function MatchTextToAssetsDb(value: string) {
  const acceptedFileTypes = [/image\/*/];
  const matchedValue = value.match(assetsUrlRegex);
  if (matchedValue) {
    matchedValue.forEach((matchedValueElement: string) => {
      const digest = Hex.stringify(sha256(matchedValueElement));
      const cachePath = `${__dirname}/../../cache/${digest}`;
      if (fs.existsSync(cachePath)) {
        return;
      }
      if (!matchedValueElement.startsWith('http')) {
        matchedValueElement = `http://${matchedValueElement}`;
      }
      const req = request(matchedValueElement);
      req.on('response', (response) => {
        const contentType = response.headers['content-type'];
        const hasContentTypeMatched = acceptedFileTypes.some((contentTypeRegex) => contentType.match(contentTypeRegex));
        if (hasContentTypeMatched) {
          DbDao.create(DatabaseTypes.assets, {url: matchedValueElement, digest, path: cachePath}, matchedValueElement.replace(/\./g, '_'));
        } else {
          req.abort();
          fs.exists(cachePath, (exists: boolean) => {
            if (exists) {
              fs.unlink(cachePath, (err) => !err ? null : console.log('error while unlinking file', err));
            }
          });
        }
      }).on('error', (err) => {
        console.log('error at requesting asset url', err);
        req.abort();
      }).pipe(fs.createWriteStream(cachePath));
    });
  }
}

export function parseCachedAssetQuiz(cacheAwareQuestions: Array<IQuestion>) {
  const assetsCache = DbDao.read(DatabaseTypes.assets);
  const assetsBasePath = `${staticStatistics.rewriteAssetCacheUrl}/lib/cache/quiz/assets`;
  cacheAwareQuestions.forEach((question: IQuestion) => {
    const matchedQuestionText = question.questionText.match(assetsUrlRegex);
    if (matchedQuestionText) {
      matchedQuestionText.forEach((matchedValueElement: string) => {
        const encodedText = matchedValueElement.replace(/\./g, '_');
        if (!assetsCache[encodedText]) {
          return;
        }
        const cachedUrl = `${assetsBasePath}/${assetsCache[encodedText].digest}`;
        question.questionText = question.questionText.replace(matchedValueElement, cachedUrl);
      });
    }
    question.answerOptionList.forEach((answerOption: IAnswerOption) => {
      const matchedAnswerText = answerOption.answerText.match(assetsUrlRegex);
      if (matchedAnswerText) {
        matchedAnswerText.forEach((matchedValueElement: string) => {
          const encodedText = matchedValueElement.replace(/\./g, '_');
          if (!assetsCache[encodedText]) {
            return;
          }
          const cachedUrl = `${assetsBasePath}/${assetsCache[encodedText].digest}`;
          answerOption.answerText = answerOption.answerText.replace(matchedValueElement, cachedUrl);
        });
      }
    });
  });
}
