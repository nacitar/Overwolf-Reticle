goog.provide('nx.svg');
goog.require('nx');

/**
 * An enum to identify types of shapes.
 * @enum {number}
 */
nx.svg.ShapeType = {CIRCLE: 0, RECTANGLE: 1};
/**
 * Wrapper for SVG circle/rect shapes, allowing an outline.
 * @param {Paper} paper a Snap.svg drawing paper.
 * @param {nx.svg.ShapeType} shapeType The type of shape to create.
 * @constructor
 */
nx.svg.Shape = function(paper, shapeType) {
  this.svg = paper.svg();
  this.svg.attr({'overflow': 'visible'});
  switch (shapeType) {
    case nx.svg.ShapeType.CIRCLE:
      this.outline = this.svg.circle();
      this.shape = this.svg.circle();
      break;
    case nx.svg.ShapeType.RECTANGLE:
      this.outline = this.svg.rect();
      this.shape = this.svg.rect();
      break;
    default:
      throw 'Invalid shape specified to nx.svg.Shape constructor.';
  }
  this.type = shapeType;
  this.outlineThickness = 0;
  this.outlineColor = '#FF00FF';
};
/**
 * Retrieves the requested attribute from the shape, providing a default value
 * if no value is set.  If the value is a pixel value, it is returned simply as
 * a number.  If the value is a number string, it is parsed and converted to a
 * number.
 * @param {string} key The name of the attribute to retrieve.
 * @param {?*} opt_default The value to return if the key is not set.
 * @return {*} The value.
 */
nx.svg.Shape.prototype.getAttr = function(key, opt_default) {
  var value = this.shape.attr(key);
  if (value == null) {
    // prefer null over undefined.
    value = nx.default(opt_default, null);
  } else if (/px$/.test(value)) {
    // remove "px" from pixel values
    var parsed = parseFloat(value);
    if (value == parsed + 'px') {
      return parsed;
    }
  } else if (nx.isNumber(value)) {
    value = parseFloat(value);
  }
  return value;
};
/**
 * Adds the shape to the provided Snap.svg group.
 * @param {Element} group A Snap.svg group element.
 */
nx.svg.Shape.prototype.addToGroup = function(group) {
  group.add(this.svg);
};
/**
 * Updates the outline shape's settings to match the real object.
 * @private
 */
nx.svg.Shape.prototype.adjustOutline_ = function() {
  var stroke = this.getAttr('stroke', 'none');
  var strokeWidth = 0;
  if (stroke != 'none') {
    strokeWidth = this.getAttr('strokeWidth', 0);
  }
  var isZeroSize = ((this.type == nx.svg.ShapeType.RECTANGLE &&
          (!this.getAttr('width', 0) || !this.getAttr('height', 0))) ||
      (this.type == nx.svg.ShapeType.CIRCLE && !this.getAttr('r', 0)));
  if (isZeroSize) {
    this.outline.attr({'stroke': 'none'});
  } else {
    this.outline.attr({'stroke': this.outlineColor});
    this.outline.attr({'strokeWidth': strokeWidth + this.outlineThickness * 2});
  }
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
  this.outlineThickness = parseFloat(thickness);
  this.adjustOutline_();
  return this;
};


/////////////////////////////////////

/*
nx.svg.Group = function(snapGroup) {
  this.group = snapGroup;
};

nx.svg.Group.prototype.add = function(element

nx.svg.Canvas = function(elementId) {
  this.id = elementId;
  this.paper = Snap(this.element());
};

nx.svg.Canvas.prototype.element = function() {
  return document.getElementById(this.id);
};

nx.svg.Canvas.prototype.group = function() {
  // instanceof shape
  return new nx.svg.Group(this.paper.g());
};
*/

