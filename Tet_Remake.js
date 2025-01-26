// JavaScript source code

// スコアを付ける

//Settings
let GameSettings = {
        
    DROP_SPEED          : 700,
    BLOCK_SIZE          : 30,   //30x30=1block

    PLAY_SCREEN_WIDTH   : 10,   //width  = 10block
    PLAY_SCREEN_HEIGHT  : 20,   //height = 20block

    UpperMargin         : 4,

    //テトリミノの設計図の１辺
    TET_SIZE            : 4,             //4x4
};

const MinoData = { 

    Mino_Shape  : [
        [],
        // 改造
        // この4x4の配列がテトリミノの形の一覧
        // 1の部分がミノの形になる。
        // 増やしてもとりあえず動くので好きに改造して難易度を調整してください。

        // [   [0, 0, 0, 0],
        //     [0, 1, 0, 0],
        //     [0, 0, 1, 0],
        //     [0, 0, 0, 1],   ],
        [   [0, 0, 1, 0],
            [0, 1, 0, 0],
            [1, 0, 0, 0],
            [0, 0, 0, 0],   ],

        [   [0, 1, 1, 0],
            [0, 1, 1, 0],
            [0, 1, 1, 0],
            [0, 1, 1, 0],   ],
        // [   [1, 1, 0, 0],
        //     [1, 1, 0, 0],
        //     [1, 1, 0, 0],
        //     [1, 1, 0, 0],   ],

        // [   [1, 1, 0, 0],
        //     [1, 1, 1, 0],
        //     [0, 1, 1, 0],
        //     [0, 0, 0, 0],   ],
        [   [0, 1, 1, 0],
            [1, 1, 1, 0],
            [1, 1, 0, 0],
            [0, 0, 0, 0],   ],

        [   [0, 0, 0, 0],
            [1, 0, 1, 0],
            [1, 1, 1, 0],
            [0, 0, 0, 0],   ],
        // [   [0, 0, 0, 0],
        //     [0, 0, 0, 0],
        //     [1, 0, 1, 0],
        //     [1, 1, 1, 0],   ],

        [   [0, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 0, 0],   ],

        [   [0, 0, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 0],   ],

        // // Z
        // [   [0, 0, 0, 0],
        //     [1, 1, 0, 0],
        //     [0, 1, 1, 0],
        //     [0, 0, 0, 0],   ],

        // // S
        // [   [0, 0, 0, 0],
        //     [0, 0, 1, 1],
        //     [0, 1, 1, 0],
        //     [0, 0, 0, 0],   ],

        // I
        [   [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],   ],
        
        // J
        [   [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 1, 0],
            [0, 0, 0, 0],   ],
        // L
        [   [0, 0, 1, 0],
            [0, 0, 1, 0],
            [0, 1, 1, 0],
            [0, 0, 0, 0],   ],
        //T
        [   [0, 0, 0, 0],
            [0, 1, 0, 0],
            [1, 1, 1, 0],
            [0, 0, 0, 0],   ],
        // [   [0, 0, 0, 0],
        //     [0, 0, 0, 0],
        //     [0, 1, 0, 0],
        //     [1, 1, 1, 0],   ],
        // //O
        // [   [0, 0, 0, 0],
        //     [0, 1, 1, 0],
        //     [0, 1, 1, 0],
        //     [0, 0, 0, 0],   ]  
        ],

    MinoColor : ['', '#6CF', '#F92', '#66F', '#C5C', '#FD2', '#F44', '#585'],
};

let Player = {
    // 今落ちているテトリミノ
    tetIndex        : 0,
    tetShape        : [],

    // テトリミノの移動
    tetroMinoDistanceX  : 0,
    tetroMinoDistanceY  : 0,


    // ホールドしているテトリミノ
    holdTetIndex    : 0,
    Flag_Hold       : false,


    //ゲームオーバーフラグ
    Flag_Gameover   : false,
    //タイマーID
    timerId : NaN,   
};

let Score = {
    score : 0,
    
    AddScore : function() {
        this.score += 100;
    }
}

let Screen = {

    //画面本体
    screen  : [],

    CanMove : function(moveX, moveY, newTet = Player.tetShape) {
        for(let y=0; y<GameSettings.TET_SIZE; y++) {
            for(let x=0; x<GameSettings.TET_SIZE; x++) {
                if(newTet[y][x]) {
                    let nextX = Player.tetroMinoDistanceX + x + moveX;
                    let nextY = Player.tetroMinoDistanceY + y + moveY;
    
                    //移動先にブロックがあるか判定
                    if( nextY < 0 || nextX < 0 ||
                        nextY >= GameSettings.PLAY_SCREEN_HEIGHT ||
                        nextX >= GameSettings.PLAY_SCREEN_WIDTH  || 
                        Screen.screen[nextY][nextX]) {
                        return false;
                    }
                }
            }
        }
        return true;
    },

    // ミノ設置
    FixTet  : function() {
        for(let y=0; y<GameSettings.TET_SIZE; y++) {
            for(let x=0; x<GameSettings.TET_SIZE; x++) {
                if(Player.tetShape[y][x]) {
                    Screen.screen[Player.tetroMinoDistanceY+y][Player.tetroMinoDistanceX+x] = Player.tetIndex;
                }
            }
        }
    },

    ClearLine : function() {
        for(let y=0; y<GameSettings.PLAY_SCREEN_HEIGHT; y++) {
            let isClearLine = true;
            for(let x=0; x<GameSettings.PLAY_SCREEN_WIDTH; x++) {
                if(Screen.screen[y][x] === 0) {
                    isClearLine = false;
                    break;
                }
            }
            if(isClearLine) {
                Score.AddScore();
                for(let newY=y; 0<newY; newY--) {
                    for(let newX=0; newX<GameSettings.PLAY_SCREEN_WIDTH; newX++) {
                        //上の行をコピーする
                        Screen.screen[newY][newX] = Screen.screen[newY-1][newX];
                    }
                }
                // 0列目（y=0の列）はさらに上の行がないので、0で埋める
                for(let newX=0; newX<GameSettings.PLAY_SCREEN_WIDTH; newX++) {
                    Screen.screen[0][newX] = 0;
                }
            }
        }
    },

};



let Controller = {

    CreateNewTet : function() {
        // 新しくテトリミノを生成
        Player.tetIndex = Math.floor(Math.random()*(MinoData.Mino_Shape.length-1))+1;
        Player.tetShape = MinoData.Mino_Shape[Player.tetIndex];
    
        Player.tetroMinoDistanceX = (GameSettings.PLAY_SCREEN_WIDTH / 2) - (GameSettings.TET_SIZE / 2);
        Player.tetroMinoDistanceY = 0;
    },

    MoveX       : function( direction ) {
        if(direction == 'R' )
            Player.tetroMinoDistanceX++;
        else if(direction == 'L') {
            Player.tetroMinoDistanceX--;
        }
    },

    MoveDown    : function() {
        Player.tetroMinoDistanceY++;
    },

    RotateTet   :  function( direcrion ) {
        let newTet = [];

        for(let y=0; y<GameSettings.TET_SIZE; y++) {
            newTet[y] = [];
            for(let x=0; x<GameSettings.TET_SIZE; x++) {
                if(direcrion == 'R') {
                    newTet[y][x] = Player.tetShape[GameSettings.TET_SIZE-1-x][y];
                } else if(direcrion == 'L') {
                    newTet[y][x] = Player.tetShape[x][GameSettings.TET_SIZE-1-y];
                }
                
            }
        }
    
        if(Screen.CanMove(0, 0, newTet)) Player.tetShape = newTet;
    },


    // ホールド
    Hold : function() {
        if(Player.Flag_Hold) return;

        let temp            = Player.holdTetIndex;
        Player.holdTetIndex   = Player.tetIndex;
        Player.tetIndex       = temp;

        Player.Flag_Hold = true;
    },

    OffHoldFlag : function() {
        Player.Flag_Hold = false;
    },
};

let Canvas = {

    canvas  : document.getElementById('canvas'),
    canvas2D: document.getElementById('canvas').getContext('2d'),

    width   : (GameSettings.PLAY_SCREEN_WIDTH + 10) * GameSettings.BLOCK_SIZE,
    height  : GameSettings.PLAY_SCREEN_HEIGHT * GameSettings.BLOCK_SIZE,

    DrawBlock   : function(x, y, tetIndex) {
        let drawX = x * GameSettings.BLOCK_SIZE;
        let drawY = y * GameSettings.BLOCK_SIZE;
    
        //色を設定
        // 改造してミノを増やしたときに色がバグらないための処置
        tetIndex_tmp = tetIndex%(MinoData.MinoColor.length-1)+1;
        if(tetIndex_tmp==0) tetIndex_tmp=1;
        this.canvas2D.fillStyle = MinoData.MinoColor[tetIndex_tmp];


        this.canvas2D.fillRect(drawX, drawY, GameSettings.BLOCK_SIZE, GameSettings.BLOCK_SIZE);
        //線の色を黒に設定
        this.canvas2D.strokeStyle = 'black';
        this.canvas2D.strokeRect(drawX, drawY, GameSettings.BLOCK_SIZE, GameSettings.BLOCK_SIZE);
    },

    //落下処理  （繰り返し呼び出す）
    DropTet     : function() {
        if(Player.Flag_Gameover) return;

        if(Screen.CanMove(0,1)) {
            Controller.MoveDown();
        } else {    // 接地したとき
    
            // Controller.OffHoldFlag();
            Screen.FixTet();
            Screen.ClearLine();
    
            // 新しくテトリミノを生成
            Controller.CreateNewTet();
    
    
            //次のテトリミノを出せなくなったらゲームオーバー
            if(!Screen.CanMove(0,0)) {
                Player.Flag_Gameover = true;
                clearInterval(Player.timerId);
            }
        }
    },

    DrawPlayScreen  : function() {
        //スクリーンを黒で塗りつぶす
        Canvas.canvas2D.fillStyle = '#000';
        Canvas.canvas2D.fillRect(0, 0, Canvas.width/2, Canvas.height);

        //設置されたミノを描画
        // for(let y=GameSettings.UpperMargin; y<GameSettings.PLAY_SCREEN_HEIGHT+GameSettings.UpperMargin; y++) {
        for(let y=0; y<GameSettings.PLAY_SCREEN_HEIGHT+GameSettings.UpperMargin; y++) {
            for(let x=0; x<GameSettings.PLAY_SCREEN_WIDTH; x++) {
                if(Screen.screen[y][x]) {
                    Canvas.DrawBlock(x,y, Screen.screen[y][x]);
                }
            }
        }

        //テトリミノの描画（今落ちてるやつ）
        for(let y=0; y<GameSettings.TET_SIZE; y++) {
            for(let x=0; x<GameSettings.TET_SIZE; x++) {
                if(Player.tetShape[y][x]) {
                    Canvas.DrawBlock(Player.tetroMinoDistanceX+x, Player.tetroMinoDistanceY+y, Player.tetIndex);
                }
            }
        }

        // スコア表示
        const scoreText = 'Score:' + String(Score.score);
        Canvas.canvas2D.font = "25px 'Meiryo UI";
        const x_tmp = 2;
        const y_tmp = 22;
        Canvas.canvas2D.fillStyle = 'white';
        Canvas.canvas2D.fillText(scoreText, x_tmp, y_tmp);
        // ホールドしているミノを描画

        // 操作方法の表示
        const KeySettingText = [
            'テトリミノの移動：矢印キー',
            'テトリミノの回転：A,Dキー',
            'ニューゲーム　　：Rキー',
            'aaaaa'
        ];
        Canvas.canvas2D.font = "20px 'Meiryo UI";
        const x_tmp1 = 11;
        const y_tmp1 = 17;
        const blockSize = GameSettings.BLOCK_SIZE;
        Canvas.canvas2D.fillStyle = 'white';
        Canvas.canvas2D.fillText(KeySettingText[0], x_tmp1*blockSize, y_tmp1*blockSize);
        Canvas.canvas2D.fillText(KeySettingText[1], x_tmp1*blockSize, (y_tmp1+1)*blockSize);
        Canvas.canvas2D.fillText(KeySettingText[2], x_tmp1*blockSize, (y_tmp1+2)*blockSize);
        // Canvas.canvas2D.fillText(KeySettingText[2], x_tmp*blockSize1, y_tmp1);

        //ゲームオーバー処理

        // Screenの21行目にミノが残ったらゲームオーバーにしたい。
        if(Player.Flag_Gameover) {
            const GAME_OVER_MESSAGE = 'GAME OVER';
            Canvas.canvas2D.font = "40px 'Meiryo UI";
            const width = Canvas.canvas2D.measureText(GAME_OVER_MESSAGE).width;
            // const x = Canvas.width/2 - width/2;
            const x = Canvas.width/2 - width;
            const y = Canvas.height/2 - 20;
            Canvas.canvas2D.fillStyle = 'white';
            Canvas.canvas2D.fillText(GAME_OVER_MESSAGE, x, y);
        }
    },

};



//function

// Start()
const init = () => {

    Canvas.canvas.width  = Canvas.width;
    Canvas.canvas.height = Canvas.height;

    //画面を中心にする
    const CONTAINER = document.getElementById('container');
    CONTAINER.style.width = Canvas.width + 'px';


    //画面本体用配列の作成
    for(let y=0; y<GameSettings.PLAY_SCREEN_HEIGHT+GameSettings.UpperMargin; y++) {
        Screen.screen[y] = [];
        for(let x=0; x<GameSettings.PLAY_SCREEN_WIDTH; x++) {
            Screen.screen[y][x] = 0;
        }
    }

    // 初期化
    Controller.CreateNewTet();

    // 一定周期で落下処理
    Player.timerId = setInterval(Update, GameSettings.DROP_SPEED);

    Canvas.DrawPlayScreen();
};

const Update = () => {

    // ゲームオーバー判定

    Canvas.DropTet();
    
    Canvas.DrawPlayScreen();
};

//キー入力
document.onkeydown = (e) => {
    if(Player.Flag_Gameover) return;

    switch(e.code) {
        case 'ArrowLeft':
            if(Player.Flag_Gameover) return;
            if(Screen.CanMove(-1, 0))
                Controller.MoveX('L');
            break;
        // case 'ArrowUp':
        //     if(Screen.CanMove( 0,-1))
        //         tetroMinoDistanceY--;
        //     break;
        case 'ArrowRight':
            if(Player.Flag_Gameover) return;
            if(Screen.CanMove( 1, 0))
                Controller.MoveX('R');
            break;
        case 'ArrowDown':
            if(Player.Flag_Gameover) return;
            if(Screen.CanMove( 0, 1))
                Controller.MoveDown();
            break;

        // 右回転
        case 'KeyD':
            if(Player.Flag_Gameover) return;
            Controller.RotateTet('R');
            break;

        // 左回転
        case 'KeyA':
            if(Player.Flag_Gameover) return;
            Controller.RotateTet('L');
            break;
        
        // ホールド
        case 'Space':
            // Controller.Hold();
            break;

        // リスタート
        case 'KeyR':
            clearInterval(Player.timerId);
            // init()とほぼ同じ
            // Screen.screen を初期化
            for(let y=0; y<GameSettings.PLAY_SCREEN_HEIGHT+GameSettings.UpperMargin; y++) {
                Screen.screen[y] = [];
                for(let x=0; x<GameSettings.PLAY_SCREEN_WIDTH; x++) {
                    Screen.screen[y][x] = 0;
                }
            }
            // 初期化
            Controller.CreateNewTet();
            // 一定周期で落下処理
            Player.timerId = setInterval(Update, GameSettings.DROP_SPEED);
            break;
    }
    Canvas.DrawPlayScreen();
};