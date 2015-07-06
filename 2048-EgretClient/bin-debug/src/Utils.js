var Utils = (function () {
    function Utils() {
    }
    var __egretProto__ = Utils.prototype;
    Utils.showStatus = function (str) {
        var event = new egret.Event(Main.STATUS_CHANGED);
        event.data = str;
        egret.MainContext.instance.dispatchEvent(event);
    };
    Utils.tilesToString = function (arr) {
        var str = "";
        for (var i = 0; i < GameData.CELL_MAX; i++) {
            str += "[";
            for (var j = 0; j < GameData.CELL_MAX; j++) {
                if (arr[j][i] == null) {
                    str += "0,";
                }
                else {
                    str += arr[j][i].value + ",";
                }
            }
            str += "]\n";
        }
        str += "";
        return str;
    };
    Utils.svrDataToString = function (arr) {
        var str = "[";
        for (var i = 0; i < GameData.CELL_MAX; i++) {
            str += "[";
            for (var j = 0; j < GameData.CELL_MAX; j++) {
                if (arr[j][i] == null) {
                    str += "0,";
                }
                else {
                    str += arr[i][j].value + ",";
                }
            }
            str += "]\n";
        }
        str += "]";
        return str;
    };
    return Utils;
})();
Utils.prototype.__class__ = "Utils";
//# sourceMappingURL=Utils.js.map