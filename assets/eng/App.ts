

import Entry from "./Entry";

const { ccclass, property } = cc._decorator;

@ccclass
export default class App extends Entry {

    loading(progress: number, total: number) {
        app.debug(`loading process:${progress} tatal:${total}`);
    }

    startGame() {

    }
}
