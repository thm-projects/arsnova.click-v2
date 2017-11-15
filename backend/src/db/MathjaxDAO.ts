export class MathjaxDAO {
  private static mathjaxCache: Object = {};

  static getAllPreviouslyRenderedData(plainData: string): Object {
    return MathjaxDAO.mathjaxCache[plainData];
  }

  static updateRenderedData(renderedData, plainData): void {
    MathjaxDAO.mathjaxCache[plainData] = renderedData;
  }

}
