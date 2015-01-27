goog.provide('nx.Reticle');

goog.require('nx');
goog.require('nx.svg');

/* TODO: document settings */

/**
 * Constructor for a nx.Reticle.
 * @param {string} surfaceElementId The id of the svg DOM element on which to
 *     render.
 * @constructor
 */
nx.Reticle = function(surfaceElementId) {
  this.elementId = surfaceElementId;
  this.surface = Snap(this.element());

  // Make a group for everything
  this.reticleGroup = this.surface.svg();
  // Initialize the attributes
  this.reticleGroup.attr({'x': '50%', 'y': '50%', 'overflow': 'visible'});
  // Make a group for the cross
  this.cross = this.surface.group();
  // Make and add the shapes
  this.outerCircle = new nx.svg.Shape(this.surface, nx.svg.ShapeType.CIRCLE);
  this.outerCircle.addToGroup(this.reticleGroup);
  this.centerDot = new nx.svg.Shape(this.surface, nx.svg.ShapeType.CIRCLE);
  this.centerDot.addToGroup(this.reticleGroup);
  this.centerDot.addToGroup(this.reticleGroup);
  this.centerBox = new nx.svg.Shape(this.surface, nx.svg.ShapeType.RECTANGLE);
  this.centerBox.addToGroup(this.reticleGroup);
  this.centerBox.addToGroup(this.reticleGroup);
  // Cross group goes into the main group
  this.reticleGroup.add(this.cross);
  // Fill the cross group
  this.crossTop = new nx.svg.Shape(this.surface, nx.svg.ShapeType.RECTANGLE);
  this.crossTop.addToGroup(this.cross);
  this.crossBottom = new nx.svg.Shape(this.surface, nx.svg.ShapeType.RECTANGLE);
  this.crossBottom.addToGroup(this.cross);
  this.crossLeft = new nx.svg.Shape(this.surface, nx.svg.ShapeType.RECTANGLE);
  this.crossLeft.addToGroup(this.cross);
  this.crossRight = new nx.svg.Shape(this.surface, nx.svg.ShapeType.RECTANGLE);
  this.crossRight.addToGroup(this.cross);

  this.image = this.surface.image();
  this.reticleGroup.add(this.image);

  this.rawImage = new Image();
  this.rawImage.onload = nx.bind(this, this.updateImage);
  this.rawImage.onerror = nx.bind(this, this.clearImage);

  this.currentPeriod_ = 0;
  this.imageScale_ = 1;
  this.imageURL_ = '';
};
/**
 * Called when the image loads or needs updating.
 */
nx.Reticle.prototype.updateImage = function() {
  console.log('Loaded: ' + [this.rawImage.width, this.rawImage.height]);
  var width = this.rawImage.width;
  var height = this.rawImage.height;
  this.image.attr({
    'width': width,
    'height': height,
    'xlink:href': this.imageURL_,
    'transform': 't' + [-width / 2, -height / 2] + ' s' + this.imageScale_});
};
/**
 * Called when the image needs to be cleared.
 */
nx.Reticle.prototype.clearImage = function() {
  this.rawImage.removeAttribute('src');
  this.image.attr({
    'width': 0,
    'height': 0});
  // snap won't let you clear href... do it at the DOM level.
  this.image.node.removeAttribute('href');
};
/**
 * Returns the svg DOM element to which we are rendering.
 * @return {Element} The DOM element.
 */
nx.Reticle.prototype.element = function() {
  var element = document.getElementById(this.elementId);
  if (!element) {
    throw 'Could not find a SVG DOM Element with id of ' + this.elementId;
  }
  return element;
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
 * Stops any current spinning animation applied to the reticle cross, setting
 * the degree of rotation to the one specified.
 * @param {number} degree How many degrees of rotation relative to 0.
 */
nx.Reticle.prototype.setRotation = function(degree) {
  degree = degree % 360;
  this.cross.stop().attr({'transform': 'r' + degree + ',0,0'});
};
/**
 * Starts spinning the reticle cross, updating the center and speed as
 * needed.
 */
nx.Reticle.prototype.spin = function() {
  this.setRotation(0);
  // Animate the remainder of the rotation at the current period's speed.
  this.cross.animate(
      {'transform': 'r360,0,0'},
      this.currentPeriod_,
      nx.bind(this, this.spin));
};

/**
 * Sets the callback to invoke when the value of a given setting is needed.
 * @param {function(string)} callback A callback accepting a setting name.
 */
nx.Reticle.prototype.setDataCallback = function(callback) {
  this.dataCallback = callback;
};

/**
 * Returns the current value for a given setting, using the data callback.
 * @param {string} key The name of the setting.
 * @return {*} The value of the setting.
 */
nx.Reticle.prototype.setting = function(key) {
  return this.dataCallback(key);
};

/**
 * Renders the reticle using the provided settings.
 */
nx.Reticle.prototype.render = function() {
  // Set the rendering mode.
  this.reticleGroup.attr({'shape-rendering': this.setting('shapeRendering')});

  // Set opacity reticle-wide; avoids blend issues with overlapping shapes.
  // Set position here as well; avoids rotational animation bug when resizing,
  // but also simplifies the code in general.

  this.outerCircle.attr({
      'r': parseInt(this.setting('circleDiameter'), 10) / 2.0,
      'fill': 'none',
      'stroke': this.setting('circleColor'),
      'visibility': this.toVisibility(
          /** @type {boolean} */ (this.setting('circleEnabled'))),
      'strokeWidth': this.setting('circleThickness')});
  this.outerCircle.setOutline(
      /** @type {string} */ (this.setting('circleStrokeColor')),
      /** @type {number} */ (this.setting('circleStrokeSize')));

  var halfCenterDiameter = parseInt(this.setting('centerDiameter'), 10) / 2.0;
  this.centerDot.attr({
      'r': halfCenterDiameter,
      'fill': this.setting('centerColor'),
      'visibility': this.toVisibility(
          /** @type {boolean} */ (this.setting('centerEnabled')) &&
          this.setting('centerShape') === 'circle')});
  this.centerDot.setOutline(
      /** @type {string} */ (this.setting('centerStrokeColor')),
      /** @type {number} */ (this.setting('centerStrokeSize')));
  this.centerBox.attr({
      'width': this.setting('centerDiameter'),
      'height': this.setting('centerDiameter'),
      'fill': this.setting('centerColor'),
      'visibility': this.toVisibility(
        /** @type {boolean} */ (this.setting('centerEnabled')) &&
          this.setting('centerShape') === 'square'),
      'transform': 't' + [-halfCenterDiameter, -halfCenterDiameter]});
  this.centerBox.setOutline(
      /** @type {string} */ (this.setting('centerStrokeColor')),
      /** @type {number} */ (this.setting('centerStrokeSize')));

  // Offset for left/top offsets to gap from the center
  var negativeOffset = -(
      parseInt(this.setting('crossLength'), 10) +
      parseInt(this.setting('crossSpread'), 10));
  var halfThickness = -(
      /** @type {number} */ (this.setting('crossThickness')) / 2);

  var crossEnabled = /** @type {boolean} */ this.setting('crossEnabled');
  var cross = {
      'fill': this.setting('crossColor'),
      'visibility': this.toVisibility(crossEnabled)};
  var topBottom = {
      'width': this.setting('crossThickness'),
      'height': this.setting('crossLength')};
  var leftRight = {
      'width': this.setting('crossLength'),
      'height': this.setting('crossThickness')};

  this.crossTop.attr(cross).attr(topBottom).attr({
      'transform': 't' + [halfThickness, negativeOffset]});
  this.crossBottom.attr(cross).attr(topBottom).attr({
      'transform': 't' + [halfThickness, this.setting('crossSpread')]});
  this.crossLeft.attr(cross).attr(leftRight).attr({
      'transform': 't' + [negativeOffset, halfThickness]});
  this.crossRight.attr(cross).attr(leftRight).attr({
      'transform': 't' + [this.setting('crossSpread'), halfThickness]});

  this.crossTop.setOutline(
      /** @type {string} */ (this.setting('crossStrokeColor')),
      /** @type {number} */ (this.setting('crossStrokeSize')));
  this.crossBottom.setOutline(
      /** @type {string} */ (this.setting('crossStrokeColor')),
      /** @type {number} */ (this.setting('crossStrokeSize')));
  this.crossLeft.setOutline(
      /** @type {string} */ (this.setting('crossStrokeColor')),
      /** @type {number} */ (this.setting('crossStrokeSize')));
  this.crossRight.setOutline(
      /** @type {string} */ (this.setting('crossStrokeColor')),
      /** @type {number} */ (this.setting('crossStrokeSize')));

  var period = (
      crossEnabled ? parseInt(this.setting('crossSpinPeriod'), 10) : 0);

  if (period > 0) {
    if (period != this.currentPeriod_) {
      this.currentPeriod_ = period;
      this.spin();
    } else {
      this.currentPeriod_ = period;
    }
  } else {
    this.currentPeriod_ = 0;
    this.setRotation(parseInt(this.setting('crossRotation'), 10));
  }
  this.imageScale_ = parseFloat(this.setting('imageScale'));
  this.imageURL_ = this.setting('imageURL');
  if (this.rawImage.src != this.imageURL_) {
    this.clearImage();
  }
  this.image.attr({
      'visibility' : this.toVisibility(
          /** @type {boolean} */ (this.setting('imageEnabled')))});
  this.rawImage.src = this.imageURL_;
  this.updateImage();
};
