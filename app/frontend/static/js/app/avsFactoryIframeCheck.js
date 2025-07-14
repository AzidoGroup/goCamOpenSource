"use strict";
var AvsFactoryIframeCheck;
(function (AvsFactoryIframeCheck) {
    class Core {
        constructor() {
        }
        init() {
            window.addEventListener('message', (event) => {
                switch (event.data.name) {
                    case Core.EVENT_STATUS_REQUEST:
                        try {
                            const appData = document.getElementById('app-data');
                            const Application = JSON.parse(appData.textContent);
                            if (Application.isAgeVerified) {
                                window.top.postMessage({
                                    name: Core.EVENT_ON_VERIFICATION_DONE,
                                    data: {
                                        status: true,
                                        payload: Application.verificationPayload
                                    }
                                }, '*');
                                window.top.postMessage({
                                    name: Core.EVENT_ON_INITIAL_VERIFICATION_SUCCESS,
                                    data: {
                                        status: true,
                                        payload: Application.verificationPayload
                                    }
                                }, '*');
                                return;
                            }
                            else {
                                window.top.postMessage({
                                    name: Core.EVENT_ON_VERIFICATION_DONE,
                                    data: {
                                        status: false,
                                        payload: Application.verificationPayload
                                    }
                                }, '*');
                                window.top.postMessage({
                                    name: Core.EVENT_ON_INITIAL_VERIFICATION_NOT_FOUND,
                                    data: {
                                        status: false,
                                        payload: Application.verificationPayload
                                    }
                                }, '*');
                            }
                        }
                        catch (e) {
                            let errorMessage = '';
                            if (e instanceof Error) {
                                errorMessage = e.message;
                            }
                            window.top.postMessage({
                                name: Core.EVENT_ON_INITIAL_VERIFICATION_FATAL_ERROR,
                                data: {
                                    errorMessage: errorMessage
                                }
                            }, '*');
                        }
                        break;
                    case Core.EVENT_RESOURCE_PRELOAD:
                        window.location.href = window.location.href.replace('/iframeCheck', '/iframeRender');
                        break;
                    default:
                    //
                }
            }, false);
        }
    }
    Core.EVENT_STATUS_REQUEST = 'avs.statusRequest';
    Core.EVENT_ON_VERIFICATION_DONE = 'avs.onVerificationDone';
    Core.EVENT_RESOURCE_PRELOAD = 'avs.resourcePreload';
    Core.EVENT_ON_INITIAL_VERIFICATION_SUCCESS = 'avs.onInitialVerificationSuccess';
    Core.EVENT_ON_INITIAL_VERIFICATION_NOT_FOUND = 'avs.onInitialVerificationNotFound';
    Core.EVENT_ON_INITIAL_VERIFICATION_FATAL_ERROR = 'avs.onInitialVerificationFatalError';
    AvsFactoryIframeCheck.Core = Core;
})(AvsFactoryIframeCheck || (AvsFactoryIframeCheck = {}));
(() => {
    const instance = new AvsFactoryIframeCheck.Core();
    instance.init();
})();
