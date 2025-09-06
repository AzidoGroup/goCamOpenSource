"use strict";
var AvsFactoryIframeSdk;
(function (AvsFactoryIframeSdk) {
    let V1;
    (function (V1) {
        class Config {
            static create(config) {
                Config.VERIFICATION_TYPE_DEFAULT = config.verificationType || Config.VERIFICATION_TYPE_DEFAULT;
                Config.IFRAME_SELECTOR_ID = config.iframeSelectorId || Config.IFRAME_SELECTOR_ID;
                Config.IFRAME_LOCATION_URL = config.iframeLocationUrl || Config.IFRAME_LOCATION_URL;
            }
        }
        Config.IFRAME_SELECTOR_ID = 'avsFactoryIframe';
        Config.IFRAME_LOCATION_URL = '';
        Config.EVENT_STATUS_REQUEST = 'avs.statusRequest';
        Config.EVENT_ON_VERIFICATION_DONE = 'avs.onVerificationDone';
        Config.EVENT_VERIFICATION_START = 'avs.verificationStart';
        Config.EVENT_RESOURCE_PRELOAD = 'avs.resourcePreload';
        Config.EVENT_ON_CHECK_IFRAME_LOADED = 'avs.onCheckIframeLoaded';
        Config.EVENT_SET_VERIFICATION_TYPE = 'avs.setVerificationType';
        Config.EVENT_ON_START_PAGE_LOADED = 'avs.onStartPageLoaded';
        Config.EVENT_ON_RESOURCES_LOADED = 'avs.onResourcesLoaded';
        Config.EVENT_ON_INITIAL_VERIFICATION_SUCCESS = 'avs.onInitialVerificationSuccess';
        Config.EVENT_ON_INITIAL_VERIFICATION_NOT_FOUND = 'avs.onInitialVerificationNotFound';
        Config.EVENT_ON_INITIAL_VERIFICATION_FATAL_ERROR = 'avs.onInitialVerificationFatalError';
        Config.EVENT_ON_VERIFICATION_SUCCESS = 'avs.onVerificationSuccess';
        Config.EVENT_ON_VERIFICATION_ERROR = 'avs.onVerificationError';
        Config.EVENT_ON_CLOSE_IFRAME = 'avs.onCloseIframe';
        Config.VERIFICATION_TYPE_QR = 1;
        Config.VERIFICATION_TYPE_SMS = 2;
        Config.VERIFICATION_TYPE_DETECTION = 3;
        Config.VERIFICATION_TYPE_DEFAULT = Config.VERIFICATION_TYPE_DETECTION;
        V1.Config = Config;
    })(V1 = AvsFactoryIframeSdk.V1 || (AvsFactoryIframeSdk.V1 = {}));
})(AvsFactoryIframeSdk || (AvsFactoryIframeSdk = {}));

"use strict";
var AvsFactoryIframeSdk;
(function (AvsFactoryIframeSdk) {
    let V1;
    (function (V1) {
        class Core {
            constructor() {
                this.iframeSelectorId = V1.Config.IFRAME_SELECTOR_ID;
                this.iframeLocationUrl = V1.Config.IFRAME_LOCATION_URL;
                this.iframeInstance = new V1.IframeHandler({
                    iframeSelectorId: this.iframeSelectorId,
                    iframeLocationUrl: this.iframeLocationUrl
                });
            }
            init() {
                this.iframeInstance.create();
                this.iframeInstance.open();
                this.iframeInstance.onMessage = ((eventMessage) => {
                    this.onMessage(eventMessage);
                    switch (eventMessage.name) {
                        case V1.Config.EVENT_ON_CHECK_IFRAME_LOADED:
                            break;
                        case V1.Config.EVENT_ON_INITIAL_VERIFICATION_SUCCESS:
                            if (eventMessage.data.status) {
                                this.iframeInstance.destroy();
                            }
                            break;
                        case V1.Config.EVENT_ON_INITIAL_VERIFICATION_NOT_FOUND:
                            //
                            break;
                        case V1.Config.EVENT_ON_INITIAL_VERIFICATION_FATAL_ERROR:
                            //
                            break;
                        case V1.Config.EVENT_ON_RESOURCES_LOADED:
                            //
                            break;
                        case V1.Config.EVENT_ON_VERIFICATION_DONE:
                            //
                            break;
                        case V1.Config.EVENT_ON_VERIFICATION_SUCCESS:
                            if (eventMessage.data.status) {
                                this.iframeInstance.destroy();
                            }
                            break;
                        case V1.Config.EVENT_ON_VERIFICATION_ERROR:
                            //
                            break;
                        case V1.Config.EVENT_ON_CLOSE_IFRAME:
                            //
                            break;
                        default:
                        //
                    }
                });
            }
            onMessage(eventMessage) {
                return;
            }
            emit(messageName, messageData) {
                this.iframeInstance.emit(messageName, messageData);
            }
        }
        V1.Core = Core;
    })(V1 = AvsFactoryIframeSdk.V1 || (AvsFactoryIframeSdk.V1 = {}));
})(AvsFactoryIframeSdk || (AvsFactoryIframeSdk = {}));

"use strict";
var AvsFactoryIframeSdk;
(function (AvsFactoryIframeSdk) {
    let V1;
    (function (V1) {
        class IframeHandler {
            constructor(config) {
                this.iframeSelectorId = config.iframeSelectorId;
                this.iframeLocationUrl = config.iframeLocationUrl;
                const url = new URL(this.iframeLocationUrl);
                this.iframeLocationHostname = url.hostname;
                this.eventsWereInit = false;
            }
            create() {
                this.iframeElement = document.createElement('iframe');
                this.iframeElement.setAttribute('id', this.iframeSelectorId);
                this.iframeElement.setAttribute('name', this.iframeSelectorId);
                this.iframeElement.setAttribute('frameborder', '0');
                this.iframeElement.setAttribute('allowtransparency', 'true');
                this.iframeElement.style.width = '1px';
                this.iframeElement.style.height = '1px';
                this.iframeElement.style.position = 'fixed';
                this.iframeElement.style.top = '0';
                this.iframeElement.style.left = '0';
                this.iframeElement.allow = 'camera http://localhost:3300';
                document.body.appendChild(this.iframeElement);
            }
            destroy() {
                this.iframeElement.setAttribute('src', '');
                this.iframeElement.remove();
                this.iframeElement = null;
            }
            open() {
                this.opener = window.open(this.iframeLocationUrl, this.iframeSelectorId);
                this.initEvents();
                this.iframeElement.onload = () => {
                    this.onMessage({
                        name: V1.Config.EVENT_ON_CHECK_IFRAME_LOADED
                    });
                };
            }
            refresh() {
                this.opener.location.href = this.iframeLocationUrl;
            }
            expand() {
                this.iframeElement.style.width = '100%';
                this.iframeElement.style.height = '100%';
                this.iframeElement.style.opacity = '0.9';
                this.iframeElement.style.zIndex = '999';
            }
            collapse() {
                this.iframeElement.style.width = '1px';
                this.iframeElement.style.height = '1px';
                this.iframeElement.style.opacity = '1';
            }
            initEvents() {
                if (this.eventsWereInit) {
                    return;
                }
                window.addEventListener('message', (event) => {
                    const url = new URL(event.origin);
                    if (url.hostname !== this.iframeLocationHostname) {
                        return;
                    }
                    this.onMessage(event.data);
                }, false);
                this.eventsWereInit = true;
            }
            emit(messageName, messageData) {
                let messageDataObject = {};
                if (messageData) {
                    messageDataObject = messageData;
                }
                this.opener.postMessage({
                    name: messageName,
                    data: messageDataObject
                }, this.iframeLocationUrl);
            }
            onMessage(eventData) {
                return;
            }
        }
        V1.IframeHandler = IframeHandler;
    })(V1 = AvsFactoryIframeSdk.V1 || (AvsFactoryIframeSdk.V1 = {}));
})(AvsFactoryIframeSdk || (AvsFactoryIframeSdk = {}));

"use strict";
var AvsFactoryIframeSdk;
(function (AvsFactoryIframeSdk) {
    let V1;
    (function (V1) {
        function init() {
            const instance = new V1.Core();
            instance.init();
        }
        V1.init = init;
    })(V1 = AvsFactoryIframeSdk.V1 || (AvsFactoryIframeSdk.V1 = {}));
})(AvsFactoryIframeSdk || (AvsFactoryIframeSdk = {}));
