namespace Avs {

  export namespace Helper {

    export var MSG_INTERNAL_ERROR = 'Internal error';

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
            msg: Helper.MSG_INTERNAL_ERROR
          };
        }

        if (!('error' in data)) {
          return {
            code: 2,
            msg: Helper.MSG_INTERNAL_ERROR
          };
        }

        const errorInfoIn = data.error;
        const errorInfoOut: IAppAjaxResponseError = {
          code: 3,
          msg: Helper.MSG_INTERNAL_ERROR
        };

        if (errorInfoIn) {
          if ('code' in errorInfoIn) {
            errorInfoOut.code = errorInfoIn.code;
          }

          if ('msg' in errorInfoIn) {
            // maybe use a custom translation from the error code (or maybe it is already translated)
            errorInfoOut.msg = errorInfoIn.msg;
          }

          if ('extra' in errorInfoIn) {
            // extra data about the error
            errorInfoOut.extra = errorInfoIn.extra;
          }
        }

        return errorInfoOut;
      }


      export function post(path: string, content: any = null, timeout: number = 0): any {

        const jqXHR = $.ajax({
          type: 'post',
          dataType: 'json',
          data: content,
          url: path,

          timeout: timeout
        });


        const promise = jqXHR.then(function(data: IAppAjaxResponse) {
          let promiseDeferred;

          if (!data || !('content' in data)) {
            // application error
            promiseDeferred = $.Deferred();
            promiseDeferred.reject(extractError(data));
            return promiseDeferred;
          }

          return data.content;

        }, function(xhr) {
          const errorObj = {
            code: 0,

            msg: Helper.MSG_INTERNAL_ERROR
          };

          if (xhr.status == 500) {
            // erreur de configuration du serveur
            errorObj.code = 4;

          } else if (xhr.status == 200) {
            errorObj.code = 5;
          }
          else if (xhr.statusText == 'abort') {
            errorObj.code = 7;
          }
          else {
            errorObj.code = 6;
          }

          return errorObj;
        });

        (<any>promise).jqXHR = jqXHR;

        return promise;
      }
    }

    interface IAppAjaxResponseError {
      code: number;
      msg: string;
      extra?: any;
    }

    interface IAppAjaxResponse {
      error?: IAppAjaxResponseError;
      content?: any;
    }

  }

}
