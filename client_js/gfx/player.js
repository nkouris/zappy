let gfx = require('./gfx');
function Pt(x, y) {
    this.x = x;
    this.y = y;
}
Pt.prototype.setX = function (x) {
    this.x = x;
}
Pt.prototype.setY = function (y) {
    this.y = y;
}
function specialAbs(num, cap) {
    if (num < 0) {
        return cap + num;
    }
    return num;
}
Pt.prototype.isEqual = function (comparePt, o) {
    if (o == 1 || o == 2)
        return ((specialAbs(Math.floor(this.x), gfx.config.mapWidth)) % (gfx.config.mapWidth * 13 / 5)) == comparePt.x && (specialAbs(Math.floor(this.y), gfx.config.mapHeight) % (gfx.config.mapHeight) == comparePt.y);
    else
        return ((specialAbs(Math.ceil(this.x), gfx.config.mapWidth)) % ((gfx.config.mapWidth * 13 / 5))) == comparePt.x && (specialAbs(Math.ceil(this.y), gfx.config.mapHeight) % (gfx.config.mapHeight) == comparePt.y);
}

function Player(op) {
    this.lvl = op.lvl;
    this.id = op.id;
    this.inventory = [];
    this.team = op.team;
    this.orientation = op.orientation;
    this.loc = new Pt(op.x, op.y);
    this.pTarget = new Pt(op.x, op.y);
    this.target = new Pt(op.x, op.y);
    this.model = op.model;
    this.setHeight = false;
    this.inBroadcast;
    this.broadcastTorus = op.broadcastTorus;
    this.isPartying = false;
    this.partyScale = 1;
    this.partyScaleDerivative = 1;
    this.orgScale = this.model.children[0].scale.x;
    this.scaleHead = false;
}

Player.prototype.moveTowardLoc = function (timeExec, timeInterval) {
    if (this.loc.isEqual(this.target, this.orientation)) {
        console.log("HEREEEEE", this.loc.x, this.loc.y, "||", this.target.x, this.target.y);
        this.loc.x = this.target.x;
        this.loc.y = this.target.y;
        this.pTarget.x = this.target.x;
        this.pTarget.y = this.target.y;
        return;
    }
    let delta = {};
    // console.log("Time exec: ", timeExec, Math.floor(this.loc.x), "||", Math.floor(this.loc.y));
    if (timeExec >= 6 / timeInterval || timeInterval >= 100) {
        this.loc.x = this.target.x;
        this.loc.y = this.target.y;
        return;
    } else {
        delta = {
            x: 1 / ((6 / timeInterval) / timeExec),
            y: 1 / ((6 / timeInterval) / timeExec),
        }
        if ((this.pTarget.x != this.target.x + 1 && this.pTarget.x != this.target.x - 1) && (this.orientation == 2 || this.orientation == 4)) {
            this.loc.x = this.target.x;
            this.loc.y = this.target.y;
            console.warn("HERE it is");
            return;
        }
    }
    if (this.loc.y < this.target.y)
        this.loc.y += delta.y;
    else if (this.loc.y > this.target.y)
        this.loc.y -= delta.y;
    if (this.loc.x < this.target.x)
        this.loc.x += delta.x;
    else if (this.loc.x > this.target.x)
        this.loc.x -= delta.x;
    this.model.children[0].rotation.z += delta.x;
}
let $quantsSpans = document.getElementsByClassName("inv_quants");
let $teamName = document.getElementById("TeamName");
let $Lvl = document.getElementById("Lvl");
Player.prototype.displayInventory = function () {
    $teamName.innerHTML = this.team;
    $Lvl.innerHTML = this.lvl;
    for (let i = 0; i < $quantsSpans.length; i++)
        $quantsSpans[i].innerHTML = this.inventory[i];
}

Player.prototype.setScale = function () {
    let scale = this.lvl;
    if (this.isPartying == true || this.scaleHead) {
        if (this.partyScale == 1)
            this.partyScaleDerivative = 1;
        else if (this.partyScale == 8)
            this.partyScaleDerivative = -1;
        this.partyScale += this.partyScaleDerivative;
        scale = this.partyScale;
    }
    if (this.scaleHead)
        this.model.children[1].scale.set(this.orgScale / 8 * scale, this.orgScale / 8 * scale, this.orgScale / 8 * scale);
    else {
        this.model.children[0].scale.set(this.orgScale / 8 * scale, this.orgScale / 8 * scale, this.orgScale / 8 * scale);
        this.model.children[1].scale.set(this.orgScale, this.orgScale, this.orgScale);
    }
    // this.model.children[1].scale.set(this.orgScale/8 * scale, this.orgScale/8 * scale, this.orgScale/8 * scale);
}
module.exports.class = Player;