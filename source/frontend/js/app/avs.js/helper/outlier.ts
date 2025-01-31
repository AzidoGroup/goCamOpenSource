namespace Avs {

  export namespace Helper {

    /**
		 * Typescript implementation of https://github.com/pablodenadai/outlier
		 */
    export class Outlier {

      public array: Array<number>;

      constructor(array?: Array<number>) {

        if (!array || !(array instanceof Array)) {
          array = [];
        }

        array = array.slice(0);
        array.sort(function (a: number, b: number) {
          return a - b;
        });

        this.array = array;

      }

      public clone() {
        return new Outlier(this.array.slice(0));
      }

      public q1() {

        const nums = this.clone();

        return nums.slice(0, Math.floor(nums.size() / 2)).median();

      }

      public q3() {

        const nums = this.clone();

        return nums.slice(Math.ceil(nums.size() / 2)).median();
      }

      public iqr() {
        return this.q3() - this.q1();
      }

      public median() {

        const half = Math.floor(this.size() / 2);

        if (this.size() % 2) {
          return this.array[half];
        }
        else {
          return (this.array[half - 1] + this.array[half]) / 2;
        }

      }

      public slice(...params: Array<number>) {

        this.array = Array.prototype.slice.apply(this.array, <any>params);
        return this;

      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
      public each(fn: Function) {

        for (let i = 0, l = this.size(); i < l; i++) {
          fn.call(this.array[i], this.array[i], i, this.array);
        }

        return this;

      }

      public findOutliers() {

        const median   = this.median();
        const range    = this.iqr() * 1.5;
        const outliers: Array<number> = [];

        this.each(function (num: number) {
          if (Math.abs(num - median) > range) {
            outliers.push(num);
          }
        });

        return outliers;

      }

      public testOutlier(num: number) {

        return (Math.abs(num - this.median()) > this.iqr() * 1.5);

      }

      public size() {

        return this.array.length;

      }

    }

  }

}
