class Tile extends egret.Sprite {
    public static NEW_TILE_BY_MERGED: string = "new_tile_by_merged";

    public static CELL_SIDE: number = 80;

    public static ANIME_TIME: number = 80; 

    private INIT_XY: number = GameData.GAME_BOARD_GAP;
    private OFFSET_XY: number = Tile.CELL_SIDE + GameData.GAME_BOARD_GAP;

    public value: number;
    public position: egret.Point;

    public constructor() {
        super();
        this.createView();
    }

    private background: egret.Shape;
    private textField: egret.TextField;

    private createView(): void {
        this.background = new egret.Shape;
        this.position = new egret.Point();
        this.addChild(this.background);

        this.textField = new egret.TextField();
        this.addChild(this.textField);
        this.textField.x = 0;
        this.textField.bold = true;
        this.textField.textAlign = "center";

        this.setNumber(0);
    }

    public setNumber(num: number): void {
        this.value = num;
        this.textField.text = num.toString();
        this.textField.textColor = this.getTextColor(num);

        this.textField.size = 45;
        while (this.textField.measuredWidth >= Tile.CELL_SIDE) {
            this.textField.size--;
        }
        this.textField.width = Tile.CELL_SIDE;
        this.textField.y = (Tile.CELL_SIDE - this.textField.measuredHeight) / 2;

        this.background.graphics.clear();
        this.background.graphics.beginFill(this.getBackgroundColor(num), 1);
        this.background.graphics.drawRoundRect(0, 0, Tile.CELL_SIDE, Tile.CELL_SIDE,
            Tile.CELL_SIDE / 8, Tile.CELL_SIDE / 8);
        this.background.graphics.endFill();
    }

    public setPosition(x: number, y: number) {
        this.position.x = x;
        this.position.y = y;

        this.x = this.INIT_XY + this.OFFSET_XY * x;
        this.y = this.INIT_XY + this.OFFSET_XY * y;
    }

    public moveTo(x: number, y: number) {
        this.position.x = x;
        this.position.y = y;

        egret.Tween.get(this).to({ x: this.INIT_XY + this.OFFSET_XY * x, y: this.INIT_XY + this.OFFSET_XY * y }, Tile.ANIME_TIME);
    }

    public mergeTo(x: number, y: number) {
        this.position.x = x;
        this.position.y = y;

        egret.Tween.get(this).to({ x: this.INIT_XY + this.OFFSET_XY * x, y: this.INIT_XY + this.OFFSET_XY * y }, Tile.ANIME_TIME).call(onMerged => {
            this.alpha = 0;
            var event: egret.Event = new egret.Event(Tile.NEW_TILE_BY_MERGED);
            event.data = {x, y};
            this.dispatchEvent(event);
        });
    }

    public appear() {
        this.scaleX = this.scaleY = this.alpha = 0;
        egret.Tween.get(this).wait(Tile.ANIME_TIME).to({ scaleX: 1.0, scaleY: 1.0, alpha:1}, Tile.ANIME_TIME);
    }

    public merging() {
        this.scaleX = this.scaleY = 1.1;
        egret.Tween.get(this).to({ scaleX: 1.0, scaleY: 1.0 }, Tile.ANIME_TIME);
    }

    private getBackgroundColor(num: number): number {
        switch (num) {
            case 2: return 0xEEE4DA; break;
            case 4: return 0xEDE0C8; break;
            case 8: return 0xF2B179; break;
            case 16: return 0xEC8D54; break; 
            case 32: return 0xF67C5F; break;
            case 64: return 0xEA5937; break;
            case 128: return 0xF3D86B; break;
            case 256: return 0xF1D04B; break;
            case 512: return 0xE4C02A; break;
            case 1024: return 0xE2BA13; break;
            case 2048: return 0xECC400; break;
            case 4096: return 0x000000; break;
            default: return 0xCCC0B4;
        }
    }

    private getTextColor(num: number): number {
        //if (num == 0) {
        //    return 0xCCC0B4;
        //} else
        if (num == 2 || num == 4) {
            return 0x776E65;
        } else {
            return 0xFFFFFF;
        }
    }
}