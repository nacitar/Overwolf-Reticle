// TODO: google closure?  dojo?
var nx = nx || {};

/**
 * SVG operation namespace
 */
nx.svg = nx.svg || {};

// DEPENDS: common.js

// TODO: make us pass a shape enum type to Shape()
// TODO: need to remove stroke if size of object is 0 in adjustOutline

/**
 * Wrapper for SVG circle/rect shapes, allowing an outline.
 * @param {Surface} surface a Snap.svg drawing surface.
 * @param {?boolean} isCircle True if making a circle, false otherwise.
 * @constructor
 */
nx.svg.Shape = function(surface, isCircle) {
  if (isCircle) {
    this.outline = surface.circle();
    this.shape = surface.circle();
  } else {
    this.outline = surface.rect();
    this.shape = surface.rect();
  }
  this.outlineThickness = 0;
  this.outlineColor = '#FF00FF';
};
/**
 * Adds the shape to the provided Snap.svg group.
 * @param {Element} group A Snap.svg group element.
 */
nx.svg.Shape.prototype.addToGroup = function(group) {
  group.add(this.outline, this.shape);
};
/**
 * Updates the outline shape's settings to match the real object.
 * @private
 */
nx.svg.Shape.prototype.adjustOutline_ = function() {
  var stroke = this.shape.attr('stroke') || 'none';
  var strokeWidth = 0;
  if (stroke != 'none') {
    strokeWidth = parseInt(this.shape.attr('strokeWidth')) || 0;
  }
  var isStroke = stroke != 'none' && strokeWidth > 0;

  this.outline.attr({stroke: this.outlineColor});
  this.outline.attr({strokeWidth: strokeWidth + this.outlineThickness * 2});
};
/**
 * Sets/gets the shape's attributes.
 * @param {*} data A string key to retrieve or an object to set.
 * @return {nx.svg.Shape} this.
 */
nx.svg.Shape.prototype.attr = function(data) {
  if (typeof data == 'string') {
    return this.shape.attr(data);
  }
  this.shape.attr(data);
  this.outline.attr(data);
  this.adjustOutline_();
  return this;
};
/**
 * Sets the outline options for the shape.
 * @param {string} color The color of the outline.
 * @param {number} thickness The thickness of the outline.
 * @return {nx.svg.Shape} this.
 */
nx.svg.Shape.prototype.setOutline = function(color, thickness) {
  this.outlineColor = color;
  this.outlineThickness = parseInt(thickness);
  this.adjustOutline_();
  return this;
};
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

  // Make a group for everything
  this.reticleGroup = this.surface.g();
  // Make a group for the cross
  this.cross = this.surface.g();
  // Make and add the shapes
  this.outerCircle = new nx.svg.Shape(this.surface, true);
  this.outerCircle.addToGroup(this.reticleGroup);
  this.centerDot = new nx.svg.Shape(this.surface, true);
  this.centerDot.addToGroup(this.reticleGroup);
  this.centerDot.addToGroup(this.reticleGroup);
  // Cross group goes into the main group
  this.reticleGroup.add(this.cross);
  // Fill the cross group
  this.crossTop = new nx.svg.Shape(this.surface);
  this.crossTop.addToGroup(this.cross);
  this.crossBottom = new nx.svg.Shape(this.surface);
  this.crossBottom.addToGroup(this.cross);
  this.crossLeft = new nx.svg.Shape(this.surface);
  this.crossLeft.addToGroup(this.cross);
  this.crossRight = new nx.svg.Shape(this.surface);
  this.crossRight.addToGroup(this.cross);

  this.center = {x: 0, y: 0};
  this.currentPeriod_ = 0;
};
/**
 * Updates the stored coordinates for the center of the surface.
 * @return {boolean} True if the center changed, false otherwise.
 */
nx.Reticle.prototype.updateCenter = function() {
  // NOTE: SVG elements don't have a CSS layout box, so using them to get the
  // size of the canvas does not work correctly.  We use the parentNode
  // instead.  Needed this to make firefox happy.
  // see: https://bugzilla.mozilla.org/show_bug.cgi?id=874811
  var size = nx.elementSize(this.surface.node.parentNode);
  var newCenter = new nx.Point(size.width / 2, size.height / 2);
  if (this.center.x != newCenter.x || this.center.y != newCenter.y) {
    this.center = newCenter;
    return true;
  }
  return false;
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
 * Starts spinning the reticle cross, updating the center and speed as
 * needed.
 */
nx.Reticle.prototype.spin = function() {
  this.setRotation(0);
  // Animate the remainder of the rotation at the current period's speed.
  this.cross.animate(
      {transform: this.toTransform(360, this.center)},
      this.currentPeriod_,
      nx.bind(this, 'spin'));
};
/**
 * Renders the reticle using the provided settings.
 * @param {Object} data An object whose properties define the reticle settings.
 */
nx.Reticle.prototype.render = function(data) {
  var hasNewCenter = this.updateCenter();

  // Set opacity reticle-wide; avoids blend issues with overlapping shapes.
  this.reticleGroup.attr({opacity: data.opacity});

  this.outerCircle.attr({
      cx: this.center.x,
      cy: this.center.y,
      r: data.circleRadius,
      fill: 'none',
      stroke: data.circleColor,
      visibility: this.toVisibility(data.circleEnabled),
      strokeWidth: data.circleThickness});
  this.outerCircle.setOutline(data.circleStrokeColor, data.circleStrokeSize);

  this.centerDot.attr({
      cx: this.center.x,
      cy: this.center.y,
      r: data.dotRadius,
      fill: data.dotColor,
      visibility: this.toVisibility(data.dotEnabled)});
  this.centerDot.setOutline(data.dotStrokeColor, data.dotStrokeSize);

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
      transform: 't' + [halfThickness, negativeOffset]});

  this.crossBottom.attr(cross).attr(topBottom).attr({
      transform: 't' + [halfThickness, data.crossSpread]});

  this.crossLeft.attr(cross).attr(leftRight).attr({
      transform: 't' + [negativeOffset, halfThickness]});

  this.crossRight.attr(cross).attr(leftRight).attr({
      transform: 't' + [data.crossSpread, halfThickness]});

  this.crossTop.setOutline(data.crossStrokeColor, data.crossStrokeSize);
  this.crossBottom.setOutline(data.crossStrokeColor, data.crossStrokeSize);
  this.crossLeft.setOutline(data.crossStrokeColor, data.crossStrokeSize);
  this.crossRight.setOutline(data.crossStrokeColor, data.crossStrokeSize);

  var period = parseInt(data.crossSpinPeriod);
  if (period < 0) {
    period = 0;
  }
  if (hasNewCenter || period != this.currentPeriod_) {
    if (period > 0) {
      this.currentPeriod_ = period;
      this.spin();
    } else {
      this.currentPeriod_ = 0;
      this.setRotation(data.crossRotation);
    }
  }
};
