
import LoadingWindow from "../bundles/loading/LoadingWindow";
import { app } from "./Engine";

const { ccclass, property } = cc._decorator;

@ccclass
export default abstract class Entry extends cc.Component {

    @property(cc.String)
    loadingBundle: string = "loading";

    @property(cc.String)
    loadingPrefebPath: string = "loading"


    private _loadingWindow: LoadingWindow = null;
    private _loadingPrefeb: cc.Prefab = null;

    protected async start() {
        const loadingPrefeb = await this.loadLoding();
        loadingPrefeb.addRef();
        this._loadingPrefeb = loadingPrefeb;
        const loadingNode = cc.instantiate(loadingPrefeb);
        cc.find("Canvas").addChild(loadingNode);
        this._loadingWindow = loadingNode.getComponent(LoadingWindow);
        this._loadingWindow.node.once("startGame", this.__startGame, this);
        await app.init();
    }

    protected __startGame() {
        app.debug(`游戏开始`)
        this._loadingWindow.node.destroy();
        this._loadingPrefeb.decRef();
        this._loadingPrefeb = null;
        this._loadingWindow = null;
        this.startGame();
    }

    protected update(dt: number): void {
        app.update(dt);
    }

    protected abstract startGame();


    private loadLoding(): Promise<cc.Prefab> {
        const self = this;
        return new Promise((res, rej) => {
            cc.assetManager.loadBundle(self.loadingBundle, (err, bundle) => {
                if (!!err) return rej(err)
                bundle.load<cc.Prefab>(self.loadingPrefebPath, (err, prefeb) => {
                    if (!!err) return rej(err);
                    res(prefeb);
                })
            })
        })
    }

}


