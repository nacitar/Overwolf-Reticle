// TODO: google closure?  dojo?
var nx = nx || {};

// DEPENDS: common.js

/**
 * Constructor for a nx.Reticle.
 * @param {number} surfaceElementId The id of the svg DOM element on which to
 *    render.
 * @constructor
 */
nx.Reticle = function(surfaceElementId) {
  var element = document.getElementById(surfaceElementId);
  if (!element) {
    throw 'Could not find a SVG DOM Element with id of ' + surfaceElementId;
  }
  this.surface = Snap(element);

  this.outerCircle = this.surface.circle();
  this.centerDot = this.surface.circle();

  this.crossTop = this.surface.rect();
  this.crossBottom = this.surface.rect();
  this.crossLeft = this.surface.rect();
  this.crossRight = this.surface.rect();

  this.cross = this.surface.g(
      this.crossTop, this.crossBottom, this.crossLeft, this.crossRight);

  this.center = {x: 0, y: 0};
  this.currentPeriod_ = 0;
};
/**
 * Updates the stored coordinates for the center of the surface.
 */
nx.Reticle.prototype.updateCenter = function() {
  // NOTE: SVG elements don't have a CSS layout box, so using them to get the
  // size of the canvas does not work correctly.  We use the parentNode
  // instead.  Needed this to make firefox happy.
  // see: https://bugzilla.mozilla.org/show_bug.cgi?id=874811
  var size = nx.elementSize(this.surface.node.parentNode);
  this.center = new nx.Point(size.width / 2, size.height / 2);
};
/**
 * Helper function to convert booleans to visibilty states.
 * @param {boolean} isVisible True if visible, false otherwise.
 * @return {string} The css visibility string 'visible' or 'hidden'.
 */
nx.Reticle.prototype.toVisibility = function(isVisible) {
  return isVisible ? 'visible' : 'hidden';
};
/**
 * Helper function to convert a degree of rotation and a midpoint into an SVG
 * transform string.
 * @param {number} degree How many degrees of rotation.
 * @param {nx.Point} center The point around which to rotate.
 * @return {string} The transform string.
 */
nx.Reticle.prototype.toTransform = function(degree, center) {
  return 'r' + degree + ',' + center.x + ',' + center.y;
};
/**
 * Stops any current spinning animation applied to the reticle cross, setting
 * the degree of rotation to the one specified.
 * @param {number} degree How many degrees of rotation relative to 0.
 */
nx.Reticle.prototype.setRotation = function(degree) {
  degree = degree % 360;
  this.cross.stop().attr({transform: this.toTransform(degree, this.center)});
};
/**
 * Starts spinning the reticle cross with the period last used by render()
 */
nx.Reticle.prototype.startSpin = function() {
  this.setRotation(this.rotation());
  // Animate the remainder of the rotation at the current period's speed.
  this.cross.animate(
      {transform: this.toTransform(360, this.center)},
      this.currentPeriod_ * (1 - this.rotation() / 360),
      nx.bind(this, 'startSpin'));
};
/**
 * Returns the current degree of rotation for the cross.
 * @return {number} The degree of rotation [0, 360).
 */
nx.Reticle.prototype.rotation = function() {
  if (this.cross.matrix) {
    return this.cross.matrix.split().rotate % 360;
  }
  return 0;
};
/**
 * Renders the reticle using the provided settings.
 * @param {Object} data An object whose properties define the reticle settings.
 */
nx.Reticle.prototype.render = function(data) {
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
  var halfThickness = -(data.crossThickness / 2);
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


  this.currentPeriod_ = parseInt(data.crossSpinPeriod);

  // also fixes the rotational center.
  this.setRotation(this.rotation());

  if (this.currentPeriod_ > 0) {
    this.startSpin();
  } else {
    this.currentPeriod_ = 0;
    this.setRotation(data.crossRotation);
  }
};
