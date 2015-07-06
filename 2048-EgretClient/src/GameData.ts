class GameData {
    public static CELL_MAX = 4;
    public static GAME_BOARD_SIDE: number = GameData.CELL_MAX * 100;
    public static GAME_BOARD_GAP: number = (GameData.GAME_BOARD_SIDE - Tile.CELL_SIDE * GameData.CELL_MAX) / (GameData.CELL_MAX + 1);
    public static GAME_BOARD_Y_DIFF: number = 80;

    private _dataArr: number[][];

    public constructor() {
        this.initData();
    }

    private initData(): void {
        this._dataArr = [];
        for (var i: number = 0; i < GameData.CELL_MAX; i++) {
            var tmpArr: number[] = [];
            for (var j: number = 0; j < GameData.CELL_MAX; j++) {
                tmpArr.push(0);
            }
            this._dataArr.push(tmpArr);
        }
    }

    public get dataArr(): number[][] {
        return this._dataArr;
    }

    public convertDataFromServer(data: { value: number; "type": string; source: any; }[][]): void {
        for (var i: number = 0; i < GameData.CELL_MAX; i++) {
            for (var j: number = 0; j < GameData.CELL_MAX; j++) {
                this._dataArr[i][j] = data[i][j].value;
            }
        }

        console.log("转换后"+JSON.stringify(this._dataArr));
    }

    public createNewGame(): boolean {
        this.initData();
        this._dataArr[Math.floor(Math.random() * 4)][Math.floor(Math.random() * 4)] = 2;
        this._dataArr[Math.floor(Math.random() * 4)][Math.floor(Math.random() * 4)] = Math.floor(Math.random() * 2 + 1) * 2;

        return true;
    }
}