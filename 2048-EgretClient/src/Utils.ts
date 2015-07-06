class Utils {
    public static showStatus(str: string): void {
        var event: egret.Event = new egret.Event(Main.STATUS_CHANGED);
        event.data = str;
        egret.MainContext.instance.dispatchEvent(event);
    }

    public static tilesToString(arr: Tile[][]): string {
        var str: string = "";
        for (var i: number = 0; i < GameData.CELL_MAX; i++) {
            str += "[";
            for (var j: number = 0; j < GameData.CELL_MAX; j++) {
                if (arr[j][i] == null) {
                    str += "0,";
                } else {
                    str += arr[j][i].value + ",";
                }
            }
            str += "]\n";
        }
        str += "";
        return str;
    }

    public static svrDataToString(arr: { value: number; "type": string; source: any; }[][]): string {
        var str: string = "[";
        for (var i: number = 0; i < GameData.CELL_MAX; i++) {
            str += "[";
            for (var j: number = 0; j < GameData.CELL_MAX; j++) {
                if (arr[j][i] == null) {
                    str += "0,";
                } else {
                    str += arr[i][j].value + ",";
                }
            }
            str += "]\n";
        }
        str += "]";
        return str;
    }
}