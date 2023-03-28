export default class KVMap<K, V>{
    private _ks: K[];
    private _vs: V[];
    private _map: { [key: string | number | symbol]: V };
    constructor(entries?: readonly (readonly [K, V])[] | null) {
        this._ks = [];
        this._vs = [];
        this._map = {};
        const self = this;
        !!entries && entries.forEach(([k, v]) => {
            self._ks.push(k);
            self._vs.push(v);
            self._map[this.__getK(k)] = v;
        });

    }

    private __getK(key: K): string | number | symbol {
        if (typeof key == "number" || typeof key == "symbol" || typeof key == "string") return key;
        if (key instanceof Object) return key.$$uniqueId;
        throw new Error(`KVMap:${typeof key} type 不支持`);
    }

    clear(): void {
        this._ks = [];
        this._vs = [];
        this._map = {};
    }

    delete(key: K): boolean {
        if (this.has(key)) return false;
        delete this._map[this.__getK(key)];
        const index = this._ks.indexOf(key);
        this._ks.splice(index, 1);
        this._vs.splice(index, 1);
    }
    forEach(callbackfn: (value: V, key: K, map: KVMap<K, V>) => void, thisArg?: any): void {
        const ks = this._ks.slice();
        const vs = this._vs.slice();
        const self = this;
        ks.forEach((k, i) => {
            !!thisArg && callbackfn.call(thisArg, self._vs[i], k, self);
            !!!thisArg && callbackfn(self._vs[i], k, self);
        })
    }

    get(key: K): V | undefined {
        return this._map[this.__getK(key)];
    }

    has(key: K): boolean {
        return !!this._map[this.__getK(key)];
    }

    set(key: K, value: V): this {
        this._map[this.__getK(key)] = value;
        return this;
    }

    get size(): number {
        return this._ks.length;
    }

    entries(): ([K, V])[] {
        const vv = [];
        this._ks.forEach((k, i) => {
            vv.push([k, this._vs[i]]);
        })

        return vv;
    }

    keys(): K[] {
        return this._ks.slice();
    }
    values(): V[] {
        return this._vs.slice();
    }
}
