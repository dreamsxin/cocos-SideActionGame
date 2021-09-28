// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameManager from "./GameManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Monster extends cc.Component {

    colorArr: cc.Color[] = [
        cc.color(255,251,171),
        cc.color(171,251,255),
        cc.color(255,171,255),
    ];


    health : number = 1;

    lbHealth : cc.Label = null!;
    hp : cc.Node[] = [];

    _atkTimer : cc.ProgressBar = null!;


    gameManager : GameManager = null!;

    _animation : cc.Animation = null!;

    onLoad(){
        this._atkTimer = cc.find('atkTimer', this.node).getComponent(cc.ProgressBar);
        this._atkTimer.node.active = false;

        this.gameManager = cc.find("GameManager").getComponent(GameManager);

    }

    init( isLeft : boolean  , difficulty : number){
        this._animation = this.getComponent(cc.Animation);

        let rnd = difficulty === 0 ? 2 : 3;
        let health = Math.floor(Math.random() * rnd ) + 1;


        if ( isLeft ){
            this.node.scaleX = -1;
        }


        this.hp.push( this.node.children[1]);
        this.hp.push( this.node.children[2]);
        this.hp.push( this.node.children[3]);


        if ( health === 1 ){
            this.node.color     = this.colorArr[0];
            this.hp[0].color    = this.colorArr[0];
            this.hp[1].color    = this.colorArr[0];
            this.hp[2].color    = this.colorArr[0];
            this.hp[0].active = true;
            this.hp[1].active = false;
            this.hp[2].active = false;
        }
        else if ( health === 2 ){
            this.node.color     = this.colorArr[1];
            this.hp[0].color    = this.colorArr[1];
            this.hp[1].color    = this.colorArr[1];
            this.hp[2].color    = this.colorArr[1];
            this.hp[0].active = true;
            this.hp[1].active = true;
            this.hp[2].active = false;
        }
        else if ( health === 3 ){
            this.node.color     = this.colorArr[2];
            this.hp[0].color    = this.colorArr[2];
            this.hp[1].color    = this.colorArr[2];
            this.hp[2].color    = this.colorArr[2];
            this.hp[0].active = true;
            this.hp[1].active = true;
            this.hp[2].active = true;
        }

        if ( difficulty >= 2 ){
            this.hp[0].active = false;
            this.hp[1].active = false;
            this.hp[2].active = false;
        }

        if ( difficulty >= 3 ){
            this._atkTimer.node.active =true;
        }

        this.health = health;

        this.lbHealth = cc.find( "lbHealth" , this.node ).getComponent(cc.Label);
        this.lbHealth.string = this.health + "";


        this._animation.play('monsterIdle');
    }


    damaged( onePunch : boolean ) : boolean {
        this.health--;
        this.lbHealth.string = this.health + "";
        this.hp[this.health].active = false;

        this._atkTimerCur = this._atkTimerBase;

        this._animation.play('monsterDamage');
        if ( this.health === 0  || onePunch ){
            this.dieAnimation();
            return true;
        }
        else {
            return false;
        }
    }


    dieAnimation(){
        this._animation.play('monsterDead');
        cc.tween( this.node )
        .to( 0.1 , { opacity : 0 , position : cc.v2( this.node.x , 100) })
        .removeSelf()
        .start();
        // this.node.removeFromParent();
    }


    _atkTimerCur : number = 99;
    _atkTimerBase : number = 0.5;
    startInsaneTimer(){
        this._atkTimer.node.active = true;
        this._atkTimerCur = this._atkTimerBase;
        this.schedule( this._insaneModeTimer , 0 );
    }

    _insaneModeTimer( dt : number ){
        this._atkTimerCur -= dt ;
        this._atkTimer.progress = this._atkTimerCur / this._atkTimerBase;
        if ( this._atkTimerCur <= 0 ){
            this._atkTimerCur = this._atkTimerBase;
            this._attack();
        }
    }

    _attack(){
        // cc.log('Monster.ts(118)' , "_attack" );
        this.gameManager.playerDamaged();
    }

    pauseTimer(){
        this.unschedule( this._insaneModeTimer );
        // this._atkTimer.node.active = false;
    }
}
