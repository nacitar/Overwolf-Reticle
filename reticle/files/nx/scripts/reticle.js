// TODO: google closure?  dojo?
var nx = nx || {};

// DEPENDS: common.js

/**
 * Constructor for a reticle.
 * @param element The DOM element of the SVG surface on which to render.
 */
nx.reticle = function(surface) {
  this.surface = surface;

  this.outerCircle = this.surface.circle();
  this.centerDot = this.surface.circle();

  this.crossTop = this.surface.rect();
  this.crossBottom = this.surface.rect();
  this.crossLeft = this.surface.rect();
  this.crossRight = this.surface.rect();

  this.cross = this.surface.g(
      this.crossTop, this.crossBottom, this.crossLeft, this.crossRight);

  this.center = {x: 0, y: 0};

  this.lastSpinSpeed_ = 0;
  // Initialize
  this.updateCenter();
};
/**
 * Updates the stored coordinates for the center of the surface.
 */
nx.reticle.prototype.updateCenter = function() {
  // NOTE: SVG elements don't have a CSS layout box, so using them to get the
  // size of the canvas does not work correctly.  We use the parentNode
  // instead.  Needed this to make firefox happy.
  // see: https://bugzilla.mozilla.org/show_bug.cgi?id=874811
  var size = nx.elementSize(this.surface.node.parentNode);
  this.center = {x: size.width / 2, y: size.height / 2};
};
/**
 * Helper function to convert booleans to visibilty states.
 * @param {boolean} isVisible True if visible, false otherwise.
 */
nx.reticle.prototype.toVisibility = function (isVisible) {
  return isVisible ? 'visible' : 'hidden'
};
/**
 * Stops any current spinning animation applied to the reticle cross.
 */
nx.reticle.prototype.stopSpin = function() {
  this.cross.stop().attr({transform: 'r0,'+this.center.x+','+this.center.y});
};
/**
 * Starts spinning the reticle cross at the speed last used by render()
 */
nx.reticle.prototype.startSpin = function() {
  this.stopSpin();
  this.cross.animate({transform: 'r360,'+this.center.x+','+this.center.y},
      this.lastSpinSpeed_, nx.bind(this,'animationEnded'));
};
/**
 * Callback triggered when the reticle cross animation ends; simply restarts
 * the animation to give it an infinite looping.
 */
nx.reticle.prototype.animationEnded = function() {
  this.stopSpin();
  this.startSpin();
};
/**
 * Renders the crosshair using the provided settings.
 * @param {Object} data An object whose properties define the reticle settings.
 */
nx.reticle.prototype.render = function (data) {
  this.updateCenter();
  this.outerCircle.attr({
      cx: this.center.x,
      cy: this.center.y,
      r: data.circleRadius,
      fill: 'none',
      stroke: data.circleColor,
      visibility: this.toVisibility(data.circleEnabled),
      strokeWidth: data.circleThickness});

  this.centerDot.attr({
      cx: this.center.x,
      cy: this.center.y,
      r: data.dotRadius,
      fill: data.dotColor,
      stroke: data.dotColor,
      visibility: this.toVisibility(data.dotEnabled),
      strokeWidth: 1});

  // Offset for left/top offsets to gap from the center
  var negativeOffset = -data.crossLength - data.crossSpread;
  var halfThickness = -(data.crossThickness/2);
  var cross = {
      x: this.center.x,
      y: this.center.y,
      fill: data.crossColor,
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
    this.lastSpinSpeed_ = speed;
    this.startSpin();
  } else {
    this.stopSpin();
  }
};
