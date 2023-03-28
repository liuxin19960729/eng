import Module from "./modules/Module";

const { ccclass, property } = cc._decorator;

declare global {
    namespace app {
        /**
         *  游戏是否运行
         */
        const isRunning: boolean;
        /**
         * 游戏运行总时间
         */
        const totalTime: number;

        const sys: ISysModules;
        const cus: ICusModules;
    }

    interface ISysModules {

    }

    interface ICusModules {

    }
}
@ccclass
export default class Engine extends cc.Component {
    protected onLoad(): void {

    }
}



class App {
    private _isRunning: boolean = false;
    private readonly _event: cc.EventTarget = new cc.EventTarget();
    readonly sys: { [key: string]: Module } = {};
    readonly cus: { [key: string]: Module } = {};
    get isRunning(): boolean {
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