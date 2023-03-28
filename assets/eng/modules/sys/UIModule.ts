import Entry from "../../Entry";
import Module from "../Module";

const { ccclass, property } = cc._decorator;

declare global {
    interface ISysModules {
        ui: IUIModule;
    }

    interface IUIModule {

    }

}

export enum E_UILayer {
    Window = 0,
    Panel,
    Guide,
}

@ccclass
export default class UIModule extends Module implements IUIModule {
    private __layers: cc.Node[] = [];
    onBeforeInit() {
        const self = this;
        Object.entries(E_UILayer).forEach(([k, v]) => {
            if (E_UILayer.hasOwnProperty(k) && Number.isInteger(E_UILayer[k])) {
                const node = new cc.Node(k);
                node.zIndex = v as number;
                self.__layers.push(node);
            }
        })
        self.__layers.sort((a, b) => a.zIndex - b.zIndex);
        const root = cc.find("Canvas").getComponentInChildren(Entry);
        this.__layers.forEach(layer => {
            root.node.addChild(layer);
        })
    }

    show() {

    }

    hide() {

    }
}

