/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011      Zynga Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
function Game(){
    this.CHESSCLASS=7;
    this.ROWCELLCOUNT=9;

    this.chesses= new Array;
    this.unsetPos=new Array;
    for(var i=0; i<9;++i){
        this.chesses[i]=new Array;
        for(var j=0;j<9;++j){
            this.chesses[i][j] = new Object;
            this.chesses[i][j].class = 0;
            this.chesses[i][j].x = i;
            this.chesses[i][j].y = j;            
            this.unsetPos.push(this.chesses[i][j]);
        }
    }
    
    
    this.logic=null;
    this.state=null; 
    this.currentChessPos = null;
    this.nextReadyChess = null;
    return this;
}

Game.prototype.init=function(logic){
        this.logic = logic;
        this.nextReadyChess = this.genRandomChess(); //用来显示3个下次出现的棋子
        this.genNextChess();        
    }

Game.prototype.genRandomChess = function(){
    var arrResult = new Array;
    for (var i = 0; i <3; i++) {
        arrResult.push(Math.floor(Math.random()*this.CHESSCLASS+1));
    }
    return arrResult;
}

Game.prototype.genNextChess= function(){
        var poses = new Array;
        if (this.unsetPos.length < 3) {
            return false; // game over
        };

        for(var i=0; i<3;++i){
            var idx = Math.floor(Math.random()* (this.unsetPos.length-1));
            poses.push(this.chesses[this.unsetPos[idx].x][this.unsetPos[idx].y]);
            console.log("idx:"+idx +", length:"+this.unsetPos.length);
            this.unsetPos[idx] = this.unsetPos.pop();
        }
        for (var i = 0; i <3; i++) {
            this.chesses[poses[i].x][poses[i].y].class = this.nextReadyChess[i];
        };

        
            // var a = new Object;
            // a.class = 1;
            // a.x = 0;
            // a.y = 0;       
            // poses.push(a);
        
        
        this.nextReadyChess = this.genRandomChess();
        this.logic.afterGenChess(poses, this.nextReadyChess); 
    }

//判断指定位置是否有棋子
Game.prototype.chessClass=function(c, r){
    try{
    return this.chesses[c][r].class;    
    }
    catch(e){
        alert(e.stack);
    }
}

//设置当前的棋子
Game.prototype.selectChess = function(c, r){
    if (this.chesses[c][r].class ==0) 
        return;
    this.currentChessPos = this.chesses[c][r];
    this.logic.onCurrentPosChanged(this.currentChessPos);
}

Game.prototype.hasSelect = function(){
    return this.currentChessPos != null;
}

Game.prototype.moveChess = function(c, r){
    if (this.currentChessPos != null) {
        this.logic.onBeforeMoveChess(this.currentChessPos, this.chesses[c][r], function(){
            this.chesses[c][r].class = this.chesses[this.currentChessPos.x][this.currentChessPos.y].class;
            this.chesses[this.currentChessPos.x][this.currentChessPos.y].class = 0;

            

            //从未设置棋子集合移出
            for(var i = 0; i<this.unsetPos.length; ++i){
                if (this.unsetPos[i].x == c && this.unsetPos[i].y == r) {
                    this.unsetPos[i] = this.chesses[this.currentChessPos.x][this.currentChessPos.y];
                    break;
                };
            }
            //this.unsetPos.push(this.currentChessPos);
            this.currentChessPos = null;
            //判断移动的棋子是否应该触发消除
            if(!this.calcResult(this.chesses[c][r])) //只有未消除时 产生下一组棋子
                this.genNextChess();
        });
        
    };

}

//获取从当前位置到目标位置的路径
Game.prototype.getMovePath = function(){

}

    //validate the input
Game.prototype.calcResult = function(pnt){
        var arrFinded = new Array;

        //验证水平
        var hStart = pnt.x-5 <0 ? 0 : pnt.x-5;
        var hEnd = pnt.x + 5 > 8 ? 8 : pnt.x + 5;

        var hCnt = 0;
        var i = 0, j=0;
        for(i = pnt.x-1; i >= 0; --i){
            if (this.chesses[i][pnt.y].class != this.chesses[pnt.x][pnt.y].class) {
                break;
            }
            ++hCnt;
        }
        for(j=pnt.x+1; j<this.ROWCELLCOUNT;++j){
            if (this.chesses[j][pnt.y].class != this.chesses[pnt.x][pnt.y].class) {
                break;
            }
            ++hCnt;
        }
        if (hCnt>=4) { //水平OK
            for (var k = i+1; k < j; ++k) {
                arrFinded.push(this.chesses[k][pnt.y]);
            }
        }

        //验证竖直        
        hCnt = 0;
        for(i = pnt.y -1; i>=0; --i){
            if (this.chesses[pnt.x][i].class != this.chesses[pnt.x][pnt.y].class) {
                break;
            }
            ++hCnt;
        }
        for(j=pnt.y+1; j<this.ROWCELLCOUNT;++j){
            if (this.chesses[pnt.x][j].class != this.chesses[pnt.x][pnt.y].class) {
                break;
            }
            ++hCnt;
        }
        if (hCnt>=4) { //水平OK
            for (var k = i+1; k < j; ++k) {
                arrFinded.push(this.chesses[pnt.x][k]);
            }
        }
        ////////////////////////////////////////////////////        
        if (arrFinded.length>0) {
            //标示要消除的棋子
            for (var i = 0; i < arrFinded.length; i++) {
                arrFinded[i].class = 0;
            };
            this.logic.onHit(arrFinded);  // 命中时回调logic的接口 
        };

        return arrFinded.length >0;
    }

var CELLSIZE = 53;

var BallLayer = cc.Layer.extend({
    //ball:null, 
    game:null,
    boardOffset:null,

    init:function(){
        this._super();
        this.boardOffset = new Object;
        this.boardOffset.x = 0;
        this.boardOffset.y = 30;

        this.game = new Game;
        this.game.init(this);
        this.setTouchEnabled(true);

        
        var size = cc.Director.getInstance().getWinSize();
       
        // this.ball = cc.Sprite.create(s_ball);
        // this.ball.setAnchorPoint(cc.p(0.5, 0.5));
        // this.ball.setPosition(cc.p(size.width / 2, size.height / 2));
        // this.addChild(this.ball, 2);

        var board = cc.Sprite.create(s_board);
        board.setAnchorPoint(cc.p(0.5, 0));
        //board.setPosition(cc.p(size.width / 2, size.height / 2-this.boardOffset.y));
        board.setPosition(cc.p(size.width / 2, this.boardOffset.y));
        this.addChild(board, 1);
    },

    onTouchesMoved : function(pnt){
//        console.log('onTouchesMoved' + JSON.stringify(pnt));
    },

    onTouchesBegan:function(pnt){
  //      console.log('onTouchesBegan');
        
        var bPos = this.posToChessBoard(pnt[0].getLocation().x, pnt[0].getLocation().y);
        if (bPos.c <0 || bPos.c >8 || bPos.r<0 || bPos.r >8) {
            return;
        };
        if (this.game.chessClass(bPos.c, bPos.r) != 0) {
            this.game.selectChess(bPos.c, bPos.r);
        }
        else{
            if (this.game.hasSelect()) {  //移动
                this.game.moveChess(bPos.c, bPos.r);
            };
        }

        console.log('onTouchesMoved' + bPos.r +" c: "+ bPos.r);
    },
    onTouchesEnded:function(pnt){
    //    console.log('onTouchesEnded');
        // var action = cc.MoveTo.create(0.5, pnt[0].getLocation(), function(){
        //     this.ball.setPosition(pnt[0].getLocation());
        // });
        // this.ball.runAction(action);    


    },

    // logic interface
    afterGenChess: function(poses, nextClass){
        for (var i = 0; i < poses.length; i++) {
            poses[i].data = cc.LabelTTF.create(""+poses[i].class, "Impact", 30);
        // position the label on the center of the screen
        poses[i].data.setAnchorPoint(cc.p(0.5, 0.5));
        poses[i].data.setPosition(cc.p(53* poses[i].x+26 + this.boardOffset.x, 53* poses[i].y+26 + this.boardOffset.y));
        // add the label as a child to this layer
        this.addChild(poses[i].data, 5);
        };
    },

    onCurrentPosChanged:function(){

    },

    onBeforeMoveChess:function(chessOld, chessNew, callback){        
        var action = cc.MoveTo.create(0.5, cc.p(chessNew.x*53 +26, chessNew.y*53+26+this.boardOffset.y));

        var game = this.game;  // for call
        var actionCallback = cc.CallFunc.create(function(node){
            callback.call(game);
        });
        chessOld.data.runAction(cc.Sequence.create(action, actionCallback));  
        chessNew.data = chessOld.data;
        chessOld.data = null;
        
    },

    onHit:function(poses){
        for (var i = 0; i < poses.length; i++) {
            poses[i].data.removeFromParentAndCleanup();
            poses[i].data = null;
        };
    },

    //helper function
    posToChessBoard: function(x, y){
        var boardPos = new Object;
        boardPos.c = Math.floor((x-this.boardOffset.x) / CELLSIZE);
        boardPos.r = Math.floor((y-this.boardOffset.y) / CELLSIZE);
        return boardPos;
    },



});

BallLayer.create = function(){;
    var scene = cc.Scene.create();
    var ballLayer =new BallLayer; 
    scene.addChild(ballLayer);
    ballLayer.init();

    return scene;
}


var MenuLayer = cc.Layer.extend({
    init: function(){
        this._super();
        // bkg png
        var size = cc.Director.getInstance().getWinSize();
        var bkg = cc.Sprite.create(s_menuBkg);
        bkg.setAnchorPoint(cc.p(0.5, 0.5));
        bkg.setPosition(cc.p(size.width / 2, size.height / 2));
        this.addChild(bkg);

        // menu

        var newGameNormal = cc.Sprite.create(s_menu, cc.rect(0, 0, 126, 33));
        var newGameSelected = cc.Sprite.create(s_menu, cc.rect(0, 33, 126, 33));
        var newGameDisabled = cc.Sprite.create(s_menu, cc.rect(0, 33 * 2, 126, 33));

        var gameSettingsNormal = cc.Sprite.create(s_menu, cc.rect(126, 0, 126, 33));
        var gameSettingsSelected = cc.Sprite.create(s_menu, cc.rect(126, 33, 126, 33));
        var gameSettingsDisabled = cc.Sprite.create(s_menu, cc.rect(126, 33 * 2, 126, 33));

        var aboutNormal = cc.Sprite.create(s_menu, cc.rect(252, 0, 126, 33));
        var aboutSelected = cc.Sprite.create(s_menu, cc.rect(252, 33, 126, 33));
        var aboutDisabled = cc.Sprite.create(s_menu, cc.rect(252, 33 * 2, 126, 33));

        var newGame = cc.MenuItemSprite.create(newGameNormal, newGameSelected, newGameDisabled,this.onNewGame);
        
        var gameSettings = cc.MenuItemSprite.create(gameSettingsNormal, gameSettingsSelected, gameSettingsDisabled, this.onSettings, this);
        var about = cc.MenuItemSprite.create(aboutNormal, aboutSelected, aboutDisabled, this.onAbout, this);

        var menu = cc.Menu.create(newGame, gameSettings, about);
        menu.alignItemsVerticallyWithPadding(10);
        this.addChild(menu, 1, 2);
        menu.setPosition(size.width / 2, size.height / 2 - 80);
        this.schedule(this.update, 0.1);
    },

    onNewGame : function(){
        
        cc.Director.getInstance().replaceScene(BallLayer.create());
    }
});

var MenuScene = cc.Scene.extend({
    onEnter: function(){
        this._super();
        var layer = new MenuLayer;
        layer.init();
        this.addChild(layer);
    }
})

var MyLayer = cc.Layer.extend({
    isMouseDown:false,
    helloImg:null,
    helloLabel:null,
    circle:null,
    sprite:null,

    init:function () {

        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask director the window size
        var size = cc.Director.getInstance().getWinSize();

        // add a "close" icon to exit the progress. it's an autorelease object
        var closeItem = cc.MenuItemImage.create(
            s_CloseNormal,
            s_CloseSelected,
            function () {
                cc.log("close");
            },this);
        closeItem.setAnchorPoint(cc.p(0.5, 0.5));

        var menu = cc.Menu.create(closeItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu, 1);
        closeItem.setPosition(cc.p(size.width - 20, 20));

        /////////////////////////////
        // 3. add your codes below...
        // add a label shows "Hello World"
        // create and initialize a label
        this.helloLabel = cc.LabelTTF.create("Hello World", "Impact", 38);
        // position the label on the center of the screen
        this.helloLabel.setPosition(cc.p(size.width / 2, size.height - 40));
        // add the label as a child to this layer
        this.addChild(this.helloLabel, 5);

        // add "Helloworld" splash screen"
        this.sprite = cc.Sprite.create(s_HelloWorld);
        this.sprite.setAnchorPoint(cc.p(0.5, 0.5));
        this.sprite.setPosition(cc.p(size.width / 2, size.height / 2));
        this.addChild(this.sprite, 0);
    }
});

var MyScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new MyLayer();
        this.addChild(layer);
        layer.init();
    }
});
