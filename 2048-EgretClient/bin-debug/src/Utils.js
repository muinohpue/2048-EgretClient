var Utils = (function () {
    function Utils() {
    }
    var __egretProto__ = Utils.prototype;
    Utils.showStatus = function (str) {
        var event = new egret.Event(Main.STATUS_CHANGED);
        event.data = str;
        egret.MainContext.instance.dispatchEvent(event);
    };
    return Utils;
})();
Utils.prototype.__class__ = "Utils";
