enum Direction { Up, Down, Left, Right }

class Main extends egret.DisplayObjectContainer {
    public static STATUS_CHANGED: string = "status_changed";

    private gameContainer: egret.Sprite;

    private _data: GameData;
    private _operation: Operation;
    private _connection: Connection;
    private _resLoader: ResLoader;


    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {
        this._resLoader = new ResLoader();
        this._data = new GameData();
        this._operation = new Operation();
        this._connection = new Connection(this._data);

        this._resLoader.addEventListener(ResLoader.PRELOAD_COMPLETE, this.onPreLoaded, this);
        this._resLoader.startPreLoad();
    }
    
    private onPreLoaded(event: egret.Event): void {
        RES.getResAsync("description", this.onDescriptionLoaded, this);
    }

    private onDescriptionLoaded(data: any): void {
        var svrDef: any = data.server;
        Connection.URL_START = svrDef.protocol + "://" + svrDef.host + ":" + svrDef.port + "/" + svrDef.url_start;
        Connection.URL_MOVE = svrDef.protocol + "://" + svrDef.host + ":" + svrDef.port + "/" + svrDef.url_move;
        
        Tile.ANIME_TIME = data.anime_speed;
        
        this.createGameScene();
    }

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene(): void {
        this.createGameBoard();
        this.createScoreBoard();
        this.startGame();
    }

    private createGameBoard(): void {
        var stageW: number = this.stage.stageWidth;
        var stageH: number = this.stage.stageHeight;

        var bg: egret.Shape = new egret.Shape;
        bg.graphics.beginFill(0xFAF8EF, 1);
        bg.graphics.drawRect(0, 0, stageW, stageH);
        bg.graphics.endFill();
        this.addChild(bg);

        var board: egret.Shape = new egret.Shape;
        board.graphics.beginFill(0xBBADA0, 1);
        board.graphics.drawRoundRect(0, 0,
            GameData.GAME_BOARD_SIDE, GameData.GAME_BOARD_SIDE,
            GameData.GAME_BOARD_SIDE / 12, GameData.GAME_BOARD_SIDE / 12);
        board.graphics.endFill();
        board.x = (stageW - GameData.GAME_BOARD_SIDE) / 2;
        board.y = (stageH - GameData.GAME_BOARD_SIDE) / 2 + GameData.GAME_BOARD_Y_DIFF;
        this.addChild(board);

        for (var i: number = 0; i < GameData.CELL_MAX * GameData.CELL_MAX; i++) {
            var cellBg: egret.Shape = new egret.Shape;
            cellBg.graphics.beginFill(0xCCC0B4, 1);
            cellBg.graphics.drawRoundRect(0, 0,
                Tile.CELL_SIDE, Tile.CELL_SIDE,
                Tile.CELL_SIDE / 8, Tile.CELL_SIDE / 8);
            cellBg.graphics.endFill();
            cellBg.x = board.x + GameData.GAME_BOARD_GAP + (i % 4) * (GameData.GAME_BOARD_GAP + Tile.CELL_SIDE);
            cellBg.y = board.y + GameData.GAME_BOARD_GAP + Math.floor(i / 4) * (GameData.GAME_BOARD_GAP + Tile.CELL_SIDE);
            this.addChild(cellBg);
        }

        this.gameContainer = new egret.Sprite();
        this.gameContainer.x = board.x;
        this.gameContainer.y = board.y;
        this.addChild(this.gameContainer);
    }

    private _scoreTxt: egret.TextField;

    private createScoreBoard(): void {
        this._scoreTxt = new egret.TextField();
        this._scoreTxt.x = 100;
        this._scoreTxt.y = 100;
        this._scoreTxt.textColor = 0x000000;
        this.addChild(this._scoreTxt);
        this._scoreTxt.text = "分数";

        egret.MainContext.instance.addEventListener(Main.STATUS_CHANGED, this.onStatusChanged, this);
    }

    private onStatusChanged(event: egret.Event): void {
        this._scoreTxt.text = event.data;
    }

    /**
     * 开始
     */
    private startGame(): void {
        if (this._objPool == null) {
            this._objPool = [];
        }
        this._tileArr = [];
        for (var i: number = 0; i < GameData.CELL_MAX; i++) {
            var tmpArr: Tile[] = [];
            for (var j: number = 0; j < GameData.CELL_MAX; j++) {
                tmpArr.push(null);
            }
            this._tileArr.push(tmpArr);
        }

        Utils.showStatus("please waite, starting");
        this._connection.addEventListener(Connection.DATA_STARTED, this.onStartDataGeted, this);
        this._connection.addEventListener(Connection.DATA_MOVED, this.onMoveDataGeted, this);
        this._connection.sendStart();
    }

    private onStartDataGeted(event: egret.Event): void {
        Utils.showStatus("started");
        this.showTiles();

        this._operation.addEventListener(Operation.MOVE, this._onMove, this);
        this._operation.startListen();
    }

    private lastDirection: Direction;

    private _onMove(event: MoveEvent): void {
        this.lastDirection = event.direction;
        this._connection.sendMove(event.direction);
    }

    private onMoveDataGeted(event: egret.Event): void {
        this.parseMoveData(event.data);
    }

    private parseMoveData(data: { value: number; "type": string; source: any; }[][]): void {
        switch (this.lastDirection) {
            case Direction.Up:
                for (var i: number = 0; i < GameData.CELL_MAX; i++) {
                    for (var j: number = 0; j < GameData.CELL_MAX; j++) {
                        this.parseTile(data[i][j], i, j);
                    }
                }
                break;
            case Direction.Down:
                for (var i: number = GameData.CELL_MAX - 1; i >= 0; i--) {
                    for (var j: number = 0; j < GameData.CELL_MAX; j++) {
                        this.parseTile(data[i][j], i, j);
                    }
                }
                break;
            case Direction.Left:
                for (var i: number = 0; i < GameData.CELL_MAX; i++) {
                    for (var j: number = 0; j < GameData.CELL_MAX; j++) {
                        this.parseTile(data[i][j], i, j);
                    }
                }
                break;
            case Direction.Right:
                for (var i: number = 0; i < GameData.CELL_MAX; i++) {
                    for (var j: number = GameData.CELL_MAX - 1; j >= 0; j--) {
                        this.parseTile(data[i][j], i, j);
                    }
                }
                break;
        }

        var str: string = Utils.tilesToString(this._tileArr);
        console.log("操作后的格子 " + str);
    }

    private parseTile(data: { value: number; "type": string; source: any; }, i:number, j:number): void {
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
                    var tile: Tile = this.newTile(data.value, j, i);
                    tile.appear();
                } else {
                    alert("newError");
                }
                break;
        }

        egret.Tween.get(this).wait(Tile.ANIME_TIME * 2).call(() => {
            this._connection._isProtocalSending = false;
        });
    }

    private _objPool: Tile[];

    private createTile(): Tile {
        var tile: Tile;
        if (this._objPool.length > 0) {
            tile = this._objPool.pop();
            tile.alpha = 1;
        } else {
            tile = new Tile();
        } 
        tile.addEventListener(Tile.NEW_TILE_BY_MERGED, this.mergeTile, this);
        return tile;
    }

    private removeTile(tile: Tile): void {
        tile.removeEventListener(Tile.NEW_TILE_BY_MERGED, this.mergeTile, this);
        this.gameContainer.removeChild(tile);
        this._objPool.push(tile);
    }

    /**
     * 新建一个放到指定位置
     */
    private newTile(num: number, x: number, y: number): Tile {
        var tile: Tile = this.createTile();
        tile.setNumber(num);
        tile.setPosition(x, y);
        this.gameContainer.addChild(tile);
        this._tileArr[x][y] = tile;
        return tile;
    }

    private _tileArr: Tile[][];

    private showTiles(): void {
        var dataArr: number[][] = this._data.dataArr;
        for (var i: number = 0; i < GameData.CELL_MAX; i++) {
            for (var j: number = 0; j < GameData.CELL_MAX; j++) {
                if (dataArr[i][j] > 0) {
                    this.newTile(dataArr[i][j], j, i).appear();
                } else {
                    if (this._tileArr[j][i] != null) {
                        this.gameContainer.removeChild(this._tileArr[j][i]);
                        this.removeTile(this._tileArr[j][i]);
                    }
                }
            }
        }
    }

    private mergeTile(event: egret.Event): void {
        var tile: Tile = event.currentTarget;
        if (this._tileArr[tile.position.x][tile.position.y] == null) {
            this.newTile(tile.value * 2, tile.position.x, tile.position.y).merging();
        }
        this.removeTile(tile);
    }
}
