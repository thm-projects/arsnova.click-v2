export function AutoUnsubscribe(subContainer: string): Function {

  return function (constructor): void {
    const original = constructor.prototype.ngOnDestroy;

    constructor.prototype.ngOnDestroy = function (): void {
      this[subContainer].forEach(property => {
        if (property && (typeof property.unsubscribe === 'function')) {
          property.unsubscribe();
        }
      });
      return original && typeof original === 'function' && original.apply(this, arguments);
    };
  };
}
