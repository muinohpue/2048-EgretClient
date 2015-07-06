var Direction;
(function (Direction) {
    Direction[Direction["Up"] = 0] = "Up";
    Direction[Direction["Down"] = 1] = "Down";
    Direction[Direction["Left"] = 2] = "Left";
    Direction[Direction["Right"] = 3] = "Right";
})(Direction || (Direction = {}));
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        _super.call(this);
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    var __egretProto__ = Main.prototype;
    __egretProto__.onAddToStage = function (event) {
        this._resLoader = new ResLoader();
        this._data = new GameData();
        this._operation = new Operation();
        this._connection = new Connection(this._data);
        this._resLoader.addEventListener(ResLoader.PRELOAD_COMPLETE, this.onPreLoaded, this);
        this._resLoader.startPreLoad();
    };
    __egretProto__.onPreLoaded = function (event) {
        RES.getResAsync("description", this.onDescriptionLoaded, this);
    };
    __egretProto__.onDescriptionLoaded = function (data) {
        var svrDef = data.server;
        Connection.URL_START = svrDef.protocol + "://" + svrDef.host + ":" + svrDef.port + "/" + svrDef.url_start;
        Connection.URL_MOVE = svrDef.protocol + "://" + svrDef.host + ":" + svrDef.port + "/" + svrDef.url_move;
        Tile.ANIME_TIME = data.anime_speed;
        this.createGameScene();
    };
    /**
     * 创建游戏场景
     * Create a game scene
     */
    __egretProto__.createGameScene = function () {
        this.createGameBoard();
        this.createScoreBoard();
        this.startGame();
    };
    __egretProto__.createGameBoard = function () {
        var stageW = this.stage.stageWidth;
        var stageH = this.stage.stageHeight;
        var bg = new egret.Shape;
        bg.graphics.beginFill(0xFAF8EF, 1);
        bg.graphics.drawRect(0, 0, stageW, stageH);
        bg.graphics.endFill();
        this.addChild(bg);
        var board = new egret.Shape;
        board.graphics.beginFill(0xBBADA0, 1);
        board.graphics.drawRoundRect(0, 0, GameData.GAME_BOARD_SIDE, GameData.GAME_BOARD_SIDE, GameData.GAME_BOARD_SIDE / 12, GameData.GAME_BOARD_SIDE / 12);
        board.graphics.endFill();
        board.x = (stageW - GameData.GAME_BOARD_SIDE) / 2;
        board.y = (stageH - GameData.GAME_BOARD_SIDE) / 2 + GameData.GAME_BOARD_Y_DIFF;
        this.addChild(board);
        for (var i = 0; i < GameData.CELL_MAX * GameData.CELL_MAX; i++) {
            var cellBg = new egret.Shape;
            cellBg.graphics.beginFill(0xCCC0B4, 1);
            cellBg.graphics.drawRoundRect(0, 0, Tile.CELL_SIDE, Tile.CELL_SIDE, Tile.CELL_SIDE / 8, Tile.CELL_SIDE / 8);
            cellBg.graphics.endFill();
            cellBg.x = board.x + GameData.GAME_BOARD_GAP + (i % 4) * (GameData.GAME_BOARD_GAP + Tile.CELL_SIDE);
            cellBg.y = board.y + GameData.GAME_BOARD_GAP + Math.floor(i / 4) * (GameData.GAME_BOARD_GAP + Tile.CELL_SIDE);
            this.addChild(cellBg);
        }
        this.gameContainer = new egret.Sprite();
        this.gameContainer.x = board.x;
        this.gameContainer.y = board.y;
        this.addChild(this.gameContainer);
    };
    __egretProto__.createScoreBoard = function () {
        this._scoreTxt = new egret.TextField();
        this._scoreTxt.x = 100;
        this._scoreTxt.y = 100;
        this._scoreTxt.textColor = 0x000000;
        this.addChild(this._scoreTxt);
        this._scoreTxt.text = "分数";
        egret.MainContext.instance.addEventListener(Main.STATUS_CHANGED, this.onStatusChanged, this);
    };
    __egretProto__.onStatusChanged = function (event) {
        this._scoreTxt.text = event.data;
    };
    /**
     * 开始
     */
    __egretProto__.startGame = function () {
        if (this._objPool == null) {
            this._objPool = [];
        }
        this._tileArr = [];
        for (var i = 0; i < GameData.CELL_MAX; i++) {
            var tmpArr = [];
            for (var j = 0; j < GameData.CELL_MAX; j++) {
                tmpArr.push(null);
            }
            this._tileArr.push(tmpArr);
        }
        Utils.showStatus("please waite, starting");
        this._connection.addEventListener(Connection.DATA_STARTED, this.onStartDataGeted, this);
        this._connection.addEventListener(Connection.DATA_MOVED, this.onMoveDataGeted, this);
        this._connection.sendStart();
    };
    __egretProto__.onStartDataGeted = function (event) {
        Utils.showStatus("started");
        this.showTiles();
        this._operation.addEventListener(Operation.MOVE, this._onMove, this);
        this._operation.startListen();
    };
    __egretProto__._onMove = function (event) {
        if (this._connection.sendMove(event.direction)) {
            this.lastDirection = event.direction;
        }
    };
    __egretProto__.onMoveDataGeted = function (event) {
        this.parseMoveData(event.data);
    };
    __egretProto__.parseMoveData = function (data) {
        switch (this.lastDirection) {
            case 0 /* Up */:
                for (var i = 0; i < GameData.CELL_MAX; i++) {
                    for (var j = 0; j < GameData.CELL_MAX; j++) {
                        this.parseTile(data[i][j], i, j);
                    }
                }
                break;
            case 1 /* Down */:
                for (var i = GameData.CELL_MAX - 1; i >= 0; i--) {
                    for (var j = 0; j < GameData.CELL_MAX; j++) {
                        this.parseTile(data[i][j], i, j);
                    }
                }
                break;
            case 2 /* Left */:
                for (var i = 0; i < GameData.CELL_MAX; i++) {
                    for (var j = 0; j < GameData.CELL_MAX; j++) {
                        this.parseTile(data[i][j], i, j);
                    }
                }
                break;
            case 3 /* Right */:
                for (var i = 0; i < GameData.CELL_MAX; i++) {
                    for (var j = GameData.CELL_MAX - 1; j >= 0; j--) {
                        this.parseTile(data[i][j], i, j);
                    }
                }
                break;
        }
        var str = Utils.tilesToString(this._tileArr);
        console.log("操作后的格子 " + str);
    };
    __egretProto__.parseTile = function (data, i, j) {
        var _this = this;
        switch (data.type) {
            case "empty":
                break;
            case "keep":
                this._tileArr[data.source.y][data.source.x].moveTo(j, i);
                if (data.source.y != j || data.source.x != i) {
                    this._tileArr[j][i] = this._tileArr[data.source.y][data.source.x];
                    this._tileArr[data.source.y][data.source.x] = null;
                }
                break;
            case "add":
                this._tileArr[data.source[0].y][data.source[0].x].mergeTo(j, i);
                this._tileArr[data.source[1].y][data.source[1].x].mergeTo(j, i);
                this._tileArr[j][i] = null;
                this._tileArr[data.source[0].y][data.source[0].x] = null;
                this._tileArr[data.source[1].y][data.source[1].x] = null;
                break;
            case "new":
                if (this._tileArr[j][i] == null) {
                    var tile = this.newTile(data.value, j, i);
                    tile.appear();
                }
                else {
                    alert("newError");
                }
                break;
        }
        egret.Tween.get(this).wait(Tile.ANIME_TIME * 2).call(function () {
            _this._connection._isProtocalSending = false;
        });
    };
    __egretProto__.createTile = function () {
        var tile;
        if (this._objPool.length > 0) {
            tile = this._objPool.pop();
            tile.alpha = 1;
        }
        else {
            tile = new Tile();
        }
        tile.addEventListener(Tile.NEW_TILE_BY_MERGED, this.mergeTile, this);
        return tile;
    };
    __egretProto__.removeTile = function (tile) {
        tile.removeEventListener(Tile.NEW_TILE_BY_MERGED, this.mergeTile, this);
        this.gameContainer.removeChild(tile);
        this._objPool.push(tile);
    };
    /**
     * 新建一个放到指定位置
     */
    __egretProto__.newTile = function (num, x, y) {
        var tile = this.createTile();
        tile.setNumber(num);
        tile.setPosition(x, y);
        this.gameContainer.addChild(tile);
        this._tileArr[x][y] = tile;
        return tile;
    };
    __egretProto__.showTiles = function () {
        var dataArr = this._data.dataArr;
        for (var i = 0; i < GameData.CELL_MAX; i++) {
            for (var j = 0; j < GameData.CELL_MAX; j++) {
                if (dataArr[i][j] > 0) {
                    this.newTile(dataArr[i][j], j, i).appear();
                }
                else {
                    if (this._tileArr[j][i] != null) {
                        this.gameContainer.removeChild(this._tileArr[j][i]);
                        this.removeTile(this._tileArr[j][i]);
                    }
                }
            }
        }
    };
    __egretProto__.mergeTile = function (event) {
        var tile = event.currentTarget;
        if (this._tileArr[tile.position.x][tile.position.y] == null) {
            this.newTile(tile.value * 2, tile.position.x, tile.position.y).merging();
        }
        this.removeTile(tile);
    };
    Main.STATUS_CHANGED = "status_changed";
    return Main;
})(egret.DisplayObjectContainer);
Main.prototype.__class__ = "Main";
//# sourceMappingURL=Main.js.map