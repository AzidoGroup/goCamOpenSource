namespace Avs {

  export interface IGenericApi {
    apiDataChannel: Avs.DataChannel.Http,
    modelManagerApiDataChannel: Avs.DataChannel.Http,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    startPolling: Function,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    stopPolling: Function
  }

  export interface IGenericObject {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any
  }

}
