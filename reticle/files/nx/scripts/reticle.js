// TODO: google closure?  dojo?
var nx = nx || {};

// DEPENDS: common.js

// TODO: document this

/**
 * Constructor for a reticle.
 * @param element The DOM element of the SVG surface on which to render.
 */
nx.reticle = function(surface) {
  this.surface = surface;

  this.outerCircle = this.surface.circle(0, 0, 0);
  this.centerDot = this.surface.circle(0, 0, 0);

  this.crossTop = this.surface.rect(0, 0, 0, 0);
  this.crossBottom = this.surface.rect(0, 0, 0, 0);
  this.crossLeft = this.surface.rect(0, 0, 0, 0);
  this.crossRight = this.surface.rect(0, 0, 0, 0);

  this.cross = this.surface.g(
      this.crossTop, this.crossBottom, this.crossLeft, this.crossRight);

  this.lastSpinSpeed = 0;
  this.center = {x: 0, y: 0};

  this.updateCenter = function() {
    var size = nx.elementSize(this.surface.node);
    this.center = {x: size.width / 2, y: size.height / 2};
  };

  this.formatColor = function (color) {
    return '#'+color;
  }
  this.toVisibility = function (bool) {
    return bool ? 'visible' : 'hidden'
  };
  this.render = function (data) {
    this.updateCenter();

    this.outerCircle.attr({
        cx: this.center.x,
        cy: this.center.y,
        r: data.circleRadius,
        fill: 'none',
        stroke: this.formatColor(data.circleColor),
        visibility: this.toVisibility(data.circleEnabled),
        strokeWidth: data.circleThickness});

    this.centerDot.attr({
        cx: this.center.x,
        cy: this.center.y,
        r: data.dotRadius,
        fill: this.formatColor(data.dotColor),
        stroke: this.formatColor(data.dotColor),
        visibility: this.toVisibility(data.dotEnabled),
        strokeWidth: 1});

    // Offset for left/top offsets to gap from the center
    var negativeOffset = -data.crossLength - data.crossSpread;
    var halfThickness = -(data.crossThickness/2);
    var cross = {
        x: this.center.x,
        y: this.center.y,
        fill: this.formatColor(data.crossColor),
        visibility: this.toVisibility(data.crossEnabled) };

    var topBottom = {width: data.crossThickness, height: data.crossLength};
    var leftRight = {width: data.crossLength, height: data.crossThickness};

    this.crossTop.attr(cross).attr(topBottom).attr({
        width: data.crossThickness,
        height: data.crossLength,
        transform: 't' + [halfThickness, negativeOffset]});

    this.crossBottom.attr(cross).attr(topBottom).attr({
        x: this.center.x,
        y: this.center.y,
        width: data.crossThickness,
        height: data.crossLength,
        transform: 't' + [halfThickness, data.crossSpread]});

    this.crossLeft.attr(cross).attr(leftRight).attr({
        x: this.center.x,
        y: this.center.y,
        transform: 't' + [negativeOffset, halfThickness]});

    this.crossRight.attr(cross).attr(leftRight).attr({
        x: this.center.x,
        y: this.center.y,
        width: data.crossLength,
        height: data.crossThickness,
        transform: 't' + [data.crossSpread, halfThickness]});

    var speed = parseInt(data.crossSpinSpeed);
    if (speed > 0) {
      this.lastSpinSpeed = speed;
      this.startSpin();
    } else {
      this.stopSpin();
    }
  };

  this.stopSpin = function() {
    this.cross.stop().attr({transform: 'r0,'+this.center.x+','+this.center.y});
  };

  this.startSpin = function() {
    this.stopSpin();
    this.cross.animate({transform: 'r360,'+this.center.x+','+this.center.y},
        this.lastSpinSpeed, nx.bind(this,'animationEnded'));
  };

  this.animationEnded = function() {
    this.stopSpin();
    this.startSpin();
  };

  // Initialize
  this.updateCenter();
};


