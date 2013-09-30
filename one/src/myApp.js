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

var BallLayer = cc.Layer.extend({
    ball:null, 

    init:function(){
        this._super();
        this.setTouchEnabled(true);

        this.ball = cc.Sprite.create(s_ball);
        var size = cc.Director.getInstance().getWinSize();
       
        this.ball.setAnchorPoint(cc.p(0.5, 0.5));
        this.ball.setPosition(cc.p(size.width / 2, size.height / 2));
        this.addChild(this.ball, 2);

        var board = cc.Sprite.create(s_board);
        board.setAnchorPoint(cc.p(0.5, 0.5));
        board.setPosition(cc.p(size.width / 2, size.height / 2));
        this.addChild(board, 1);
    },

    onTouchesMoved : function(pnt){
        console.log('onTouchesMoved' + JSON.stringify(pnt));
    },

    onTouchesBegan:function(pnt){
        console.log('onTouchesBegan');
    },
    onTouchesEnded:function(pnt){
        console.log('onTouchesEnded');
        var action = cc.MoveTo.create(0.5, pnt[0].getLocation(), function(){
            this.ball.setPosition(pnt[0].getLocation());
        });
        this.ball.runAction(action);        
    }

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
