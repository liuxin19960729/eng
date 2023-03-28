const { ccclass, property } = cc._decorator;

declare global {
    namespace app {

    }
}
@ccclass
export default class Engine extends cc.Component {

}



class App {
    private _isRunning: boolean = false;
    private readonly _event: cc.EventTarget = new cc.EventTarget();
    get running(): boolean {
        return this._isRunning;
    }


    init(cb?: (progress: number, total: number) => void): Promise<any> {
        return new Promise((res, rej) => {

        });
    }

    
    private _totalTime: number = 0;

    get totalTime(): number {
        return this._totalTime;
    }
    update(dt: number) {
        if (!this._isRunning) return;
        this._totalTime += dt;

    }


}

const app = new App();

export { app };

(<any>window)[`app`] = app;