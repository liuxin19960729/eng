
import Loading from "./Loading";
import { app } from "./Engine";

const { ccclass, property } = cc._decorator;

@ccclass
export default abstract class Entry extends cc.Component {

    @property(cc.String)
    loadingBundle: string = "loading";

    @property(cc.String)
    loadingPrefebPath: string = "loading"


    private _loadingWindow: Loading = null;
    private _loadingPrefeb: cc.Prefab = null;

    protected async start() {
        const self = this;
        const load = await self.loading().catch(err => err);
        if (load instanceof Loading) {
            load.node.once("startGame", this.startGame, self);
            await app.init().catch(err => self.startGame(err));
        }
    }



    protected update(dt: number): void {
        app.update(dt);
    }

    protected abstract startGame(err: Error);

    protected abstract loading(): Promise<Loading>;

}



