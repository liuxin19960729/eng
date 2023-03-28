export enum E_Module_Type {
    Custom,
    System,
}
const { ccclass, property } = cc._decorator;

@ccclass
export default class Module extends cc.Component {
    @property(cc.Boolean)
    isLog: boolean = true;

    @property({
        type: cc.Enum(E_Module_Type)
    })
    type: E_Module_Type = E_Module_Type.System;


    private _event: cc.EventTarget = null;

    protected get event(): cc.EventTarget {
        return this._event
    }

    onBeforeInit?();
    onInit?(): Promise<any>;
    onAfterInit?();
}
