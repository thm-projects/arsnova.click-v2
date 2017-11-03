import * as sha256 from 'crypto-js/sha256';
import * as Hex from 'crypto-js/enc-hex';
import * as fs from 'fs';
import * as request from 'request';
import {DatabaseTypes, DbDao} from '../db/DbDao';

export function MatchTextToAssetsDb(value: string) {
  const acceptedFileTypes = [/image\/*/];
  const matchedValue = value.match(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi);
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
          DbDao.create(DatabaseTypes.assets, {url: matchedValueElement, digest, path: cachePath}, digest);
        } else {
          req.abort();
          fs.unlink(cachePath);
        }
      }).on('error', (err) => {
        console.log(err);
        req.abort();
      }).pipe(fs.createWriteStream(cachePath));
    });
  }
}
