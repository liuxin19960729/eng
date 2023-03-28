
import { app } from "./Engine";

const { ccclass, property } = cc._decorator;

@ccclass
export default abstract class Entry extends cc.Component {



    protected async start() {
        await app.init(this.loading.bind(this));

        app.debug(`游戏开始`)
        this.startGame();
    }



    abstract startGame();
    abstract loading(progress: number, total: number);
}
