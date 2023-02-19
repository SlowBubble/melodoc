(function () {
    'use strict';

    // Top-level public structure for Melodoc.
    class Song {
        constructor({ title = '', }) {
            this.title = title;
        }
    }
    // export class Voice {
    //   constructor({
    //     noteGps = [],
    //     staffType = StaffType.Treble,
    //   }) {
    //   }
    // }
    // export const StaffType = {
    //   Treble: 'Treble',
    //   Bass: 'Bass',
    // };
    // export class NoteGp {
    //   constructor({
    //     start8n,
    //     end8n,
    //     pitches = [],
    //     // optional
    //     accented,
    //   }) {
    //   }
    // }
    // export class Pitch {
    //   constructor({
    //     noteNum = 60,
    //     spelling,
    //   }) {
    //   }
    // }
    // export class ChordChange {
    //   constructor({
    //     start8n,
    //     // No validation here.
    //     // Interpretation is left for the client.
    //     chordString,
    //   }) {
    //   }
    // }

    class MelodocEditor {
        constructor() {
            this.song = new Song({});
        }
        loadSong(song) {
            this.song = song;
        }
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
            const song = new Song(dataToSongApi(data));
            this.editor.loadSong(song);
            this.innerHTML = data;
        }
    }
    function dataToSongApi(data) {
        try {
            const songJson = JSON.parse(data);
            return songJson;
        }
        catch (err) {
            console.warn('Failed to parse this data as a song: ', data);
        }
        return {};
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
