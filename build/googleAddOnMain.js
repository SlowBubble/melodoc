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

    main('google');

})();
//# sourceMappingURL=googleAddOnMain.js.map
