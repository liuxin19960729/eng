import WindowUI from "../eng/ui/WindowUI";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LoadingWindow extends WindowUI {
    protected onShow(data?: undefined) {

    }

    protected onHide() {

    }

    progress(progress: number, total: number) {
        app.debug(`progress:${progress} total:${total}`)
        const self = this;
        self.scheduleOnce(() => {
            self.node.emit("startGame");
        }, 1)
    }

}