(function () {
    'use strict';

    class MelodocEditor {
    }

    class MelodocUi extends HTMLElement {
        constructor() {
            super();
            this.editor = new MelodocEditor();
        }
        connectedCallback() {
            this.innerHTML = `MelodocUi`;
        }
        loadSerializedData(data) {
            this.innerHTML = data;
        }
    }

    function main(data) {
        customElements.define("melodoc-ui", MelodocUi);
        const mainDiv = document.getElementById('main');
        mainDiv.innerHTML = '';
        const melodocUi = document.createElement('melodoc-ui');
        mainDiv.appendChild(melodocUi);
        melodocUi.loadSerializedData(data);
    }

    function toInternalUrl(externalUrlStr) {
        return new URL(externalUrlStr.replace('#', '?'));
    }
    function getUrlParamsMap() {
        const url = toInternalUrl(document.URL);
        const keyVals = new Map();
        url.searchParams.forEach(function (value, key) {
            keyVals.set(key, value);
        });
        return keyVals;
    }

    const urlParams = getUrlParamsMap();
    const data = urlParams.has('data') ? urlParams.get('data') : '';
    main(data);

})();
//# sourceMappingURL=webMain.js.map
