namespace Core {

  export const MSG_INTERNAL_ERROR = 'Internal error';

  export namespace Ajax {

    function extractError(data: IAppAjaxResponse): IAppAjaxResponseError {
      if ('content' in data) {
        return {
          code: 0,
          msg: 'No error found'
        };
      }

      if (!data) {
        return {
          code: 1,
          msg: Core.MSG_INTERNAL_ERROR
        };
      }

      if (!('error' in data)) {
        return {
          code: 2,
          msg: Core.MSG_INTERNAL_ERROR
        };
      }

      const errorInfoIn = data.error;
      const errorInfoOut: IAppAjaxResponseError = {
        code: 3,
        msg: Core.MSG_INTERNAL_ERROR
      };

      if (errorInfoIn) {
        if ('code' in errorInfoIn) {
          errorInfoOut.code = errorInfoIn.code;
        }

        if ('msg' in errorInfoIn) {
          errorInfoOut.msg = errorInfoIn.msg;
        }

        if ('extra' in errorInfoIn) {
          errorInfoOut.extra = errorInfoIn.extra;
        }
      }

      return errorInfoOut;
    }

    export function post(path: string, content: any = null): JQueryPromise<any> {

      const jqXHR = $.ajax({
        type: 'post',
        dataType: 'json',
        data: content,

        url: path

      });


      const promise: any = jqXHR.then(function(data: IAppAjaxResponse) {
        let promiseDeferred;

        if (!data || !('content' in data)) {
          // application error
          promiseDeferred = $.Deferred();
          promiseDeferred.reject(extractError(data));
          return promiseDeferred;
        }

        return data.content;

      }, function(xhr) {
        const contentType = xhr.getResponseHeader('content-type');
        if ((contentType === 'application/json') || (contentType === 'text/json')) {
          if ('JSON' in window) {
            const dataObj = JSON.parse(xhr.responseText);

            if ('error' in dataObj && dataObj.error) {
              const errorObj = dataObj.error;

              if (('code' in errorObj) && errorObj.code > 0) {
                return errorObj;
              }
            }
          }
        }

        const errorObj = {
          code: 0,

          msg: Core.MSG_INTERNAL_ERROR
        };

        if (xhr.status == 500) {
          errorObj.code = 4;

        } else if (xhr.status == 200) {
          errorObj.code = 5;
        }
        else if (xhr.statusText == 'abort') {
          errorObj.code = 7;
        }
        else if (xhr.status > 500 && xhr.status < 600) {
          errorObj.code = 8;
        }
        else {
          errorObj.code = 6;
        }

        return errorObj;
      });

      promise.jqXHR = jqXHR;

      return promise;
    }
  }

  export function clone(obj: any): any {
    // Handle the 3 simple types, and null or undefined
    if (null == obj || 'object' != typeof obj) {
      return obj;
    }

    // Handle Date
    if (obj instanceof Date) {
      const copyDate = new Date();
      copyDate.setTime(obj.getTime());
      return copyDate;
    }

    // Handle Array
    if (obj instanceof Array) {
      const copyList = [];
      for (let i = 0, len = obj.length; i < len; i++) {
        copyList[i] = clone(obj[i]);
      }
      return copyList;
    }

    // Handle Object
    if (obj instanceof Object) {
      const copyObj: any = {};
      for (const attr in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, attr)) {
          copyObj[attr] = clone(obj[attr]);
        }
      }
      return copyObj;
    }

    throw new Error('Unable to copy obj! Its type isn\'t supported.');
  }

  export function bootstrap() {

    if ('onDocumentReady' in Application) {

      const fonctionStr = Application['onDocumentReady'];

      const tokenList = fonctionStr.split(/\./);

      let currentObj: any = window;
      let currentToken;

      // eslint-disable-next-line no-cond-assign
      while (currentToken = tokenList.shift()) {
        if (currentToken in currentObj) {
          currentObj = currentObj[currentToken];
        }
        else {
          currentObj = null;
          break;
        }
      }

      if (typeof currentObj === 'function') {
        window.setTimeout(function() {
          currentObj();
        }, 1);
      }

    }
  }
}


