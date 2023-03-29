
const { ccclass, property } = cc._decorator;

@ccclass
export default class Loading extends cc.Component {
    loadingProgress?(progress: number, total: number);


    startGame() {
        this.node.emit("startGame");
    }
}