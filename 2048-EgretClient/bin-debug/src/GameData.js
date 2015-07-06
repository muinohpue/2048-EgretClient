var GameData = (function () {
    function GameData() {
        this.initData();
    }
    var __egretProto__ = GameData.prototype;
    __egretProto__.initData = function () {
        this._dataArr = [];
        for (var i = 0; i < GameData.CELL_MAX; i++) {
            var tmpArr = [];
            for (var j = 0; j < GameData.CELL_MAX; j++) {
                tmpArr.push(0);
            }
            this._dataArr.push(tmpArr);
        }
    };
    Object.defineProperty(__egretProto__, "dataArr", {
        get: function () {
            return this._dataArr;
        },
        enumerable: true,
        configurable: true
    });
    __egretProto__.convertDataFromServer = function (data) {
        for (var i = 0; i < GameData.CELL_MAX; i++) {
            for (var j = 0; j < GameData.CELL_MAX; j++) {
                this._dataArr[i][j] = data[i][j].value;
            }
        }
        console.log("转换后" + JSON.stringify(this._dataArr));
    };
    __egretProto__.createNewGame = function () {
        this.initData();
        this._dataArr[Math.floor(Math.random() * 4)][Math.floor(Math.random() * 4)] = 2;
        this._dataArr[Math.floor(Math.random() * 4)][Math.floor(Math.random() * 4)] = Math.floor(Math.random() * 2 + 1) * 2;
        return true;
    };
    GameData.CELL_MAX = 4;
    GameData.GAME_BOARD_SIDE = GameData.CELL_MAX * 100;
    GameData.GAME_BOARD_GAP = (GameData.GAME_BOARD_SIDE - Tile.CELL_SIDE * GameData.CELL_MAX) / (GameData.CELL_MAX + 1);
    GameData.GAME_BOARD_Y_DIFF = 80;
    return GameData;
})();
GameData.prototype.__class__ = "GameData";
//# sourceMappingURL=GameData.js.map