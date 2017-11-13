import * as fs from 'fs';
import * as path from 'path';

function createPath(pathRelativeToBase) {
  fs.exists(path.join(__dirname, '..', pathRelativeToBase), (exists => {
    if (!exists) {
      fs.mkdir(path.join(__dirname, '..', pathRelativeToBase), (err) => console.log(err));
    }
  }));
}

export function createDefaultPaths(): void {
  createPath('cache');
  createPath('certs');
  createPath('predefined_quizzes');
  createPath(path.join('predefined_quizzes', 'abcd_quiz'));
  createPath(path.join('predefined_quizzes', 'demo_quiz'));
  createPath('images');
  createPath(path.join('images', 'favicons'));
  createPath(path.join('images', 'mathjax'));
  createPath(path.join('images', 'themes'));
  createPath('i18n');
  createPath('sound');

}
