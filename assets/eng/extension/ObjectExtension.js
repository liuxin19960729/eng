


var globalUniqueId = 0;
const uniqueSymbol = Symbol("$$uniquedId")
if (!Object.prototype.hasOwnProperty("$$uniqueId")) {
    Object.defineProperty(Object.prototype, "$$uniqueId", {
        enumerable: false,
        configurable: false,
        get: function () {
            if (!!!this[uniqueSymbol]) {
                this[uniqueSymbol] = ++globalUniqueId;
            }
            return this[uniqueSymbol];
        }
    })
}