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
function specialAbs(num, cap){
    if(num < 0){
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
    this.inventory = op.inventory;
    this.team = op.team;
    this.orientation = op.orientation;
    this.loc = new Pt(op.x, op.y);
    this.pTarget = new Pt(op.x, op.y);
    this.target = new Pt(op.x, op.y);
    this.model = op.model;
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
    console.log("Time exec: ", timeExec, Math.floor(this.loc.x), "||", Math.floor(this.loc.y));
    if (timeExec >= 6 / timeInterval) {
        this.loc.x = this.target.x;
        this.loc.y = this.target.y;
        console.warn("Or In hERE")
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
    if (this.orientation == 1)
        this.loc.y += delta.y;
    else if (this.orientation == 2)
        this.loc.x += delta.x;
    else if (this.orientation == 3)
        this.loc.y -= delta.y;
    else if (this.orientation == 4)
        this.loc.x -= delta.x;
}

module.exports.class = Player;