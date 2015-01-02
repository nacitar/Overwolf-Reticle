
goog.provide('overlay')

goog.require('nx')
goog.require('nx.ow')
goog.require('nx.svg')

/**
 * Constructor for a overlay.Reticle.
 * @param {string} surfaceElementId The id of the svg DOM element on which to
 *     render.
 * @constructor
 */
overlay.Reticle = function(surfaceElementId) {
  this.elementId = surfaceElementId;
  this.surface = Snap(this.element());

  // Make a group for everything
  this.reticleGroup = this.surface.group();
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

  this.currentPeriod_ = 0;
};
/**
 * Returns the svg DOM element to which we are rendering.
 * @return {Element} The DOM element.
 */
overlay.Reticle.prototype.element = function() {
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
overlay.Reticle.prototype.toVisibility = function(isVisible) {
  return isVisible ? 'visible' : 'hidden';
};
/**
 * Stops any current spinning animation applied to the reticle cross, setting
 * the degree of rotation to the one specified.
 * @param {number} degree How many degrees of rotation relative to 0.
 */
overlay.Reticle.prototype.setRotation = function(degree) {
  degree = degree % 360;
  this.cross.stop().attr({'transform': 'r' + degree + ',0,0'});
};
/**
 * Starts spinning the reticle cross, updating the center and speed as
 * needed.
 */
overlay.Reticle.prototype.spin = function() {
  this.setRotation(0);
  // Animate the remainder of the rotation at the current period's speed.
  this.cross.animate(
      {'transform': 'r360,0,0'},
      this.currentPeriod_,
      nx.bind(this, this.spin));
};
/**
 * Renders the reticle using the provided settings.
 * @param {Object} data An object whose properties define the reticle settings.
 */
overlay.Reticle.prototype.render = function(data) {
  // NOTE: SVG elements don't have a CSS layout box, so using them to get the
  // size of the canvas does not work correctly.  We use the parentNode
  // instead.  Needed this to make firefox happy.
  // see: https://bugzilla.mozilla.org/show_bug.cgi?id=874811
  var size = nx.nodeSize(this.surface.node.parentNode);

  // Set the rendering mode.
  this.element().setAttribute('shape-rendering', data['shapeRendering']);

  // Set opacity reticle-wide; avoids blend issues with overlapping shapes.
  // Set position here as well; avoids rotational animation bug when resizing,
  // but also simplifies the code in general.
  this.reticleGroup.attr({
    'opacity': data['opacity'],
    'transform': 't' + [size.width / 2, size.height / 2]});

  this.outerCircle.attr({
      'r': data['circleDiameter'] / 2.0,
      'fill': 'none',
      'stroke': data['circleColor'],
      'visibility': this.toVisibility(data['circleEnabled']),
      'strokeWidth': data['circleThickness']});
  this.outerCircle.setOutline(
      data['circleStrokeColor'], data['circleStrokeSize']);

  var halfCenterDiameter = data['centerDiameter'] / 2.0;
  this.centerDot.attr({
      'r': halfCenterDiameter,
      'fill': data['centerColor'],
      'visibility': this.toVisibility(data['centerEnabled'] &&
          data['centerShape'] == 'circle')});
  this.centerDot.setOutline(
      data['centerStrokeColor'], data['centerStrokeSize']);
  this.centerBox.attr({
      'width': data['centerDiameter'],
      'height': data['centerDiameter'],
      'fill': data['centerColor'],
      'visibility': this.toVisibility(data['centerEnabled'] &&
          data['centerShape'] == 'square'),
      'transform': 't' + [-halfCenterDiameter, -halfCenterDiameter]});
  this.centerBox.setOutline(
      data['centerStrokeColor'], data['centerStrokeSize']);

  // Offset for left/top offsets to gap from the center
  var negativeOffset = -data['crossLength'] - data['crossSpread'];
  var halfThickness = -(data['crossThickness'] / 2);
  var cross = {
      'fill': data['crossColor'],
      'visibility': this.toVisibility(data['crossEnabled']) };
  var topBottom = {
      'width': data['crossThickness'], 'height': data['crossLength']};
  var leftRight = {
      'width': data['crossLength'], 'height': data['crossThickness']};

  this.crossTop.attr(cross).attr(topBottom).attr({
      'transform': 't' + [halfThickness, negativeOffset]});
  this.crossBottom.attr(cross).attr(topBottom).attr({
      'transform': 't' + [halfThickness, data['crossSpread']]});
  this.crossLeft.attr(cross).attr(leftRight).attr({
      'transform': 't' + [negativeOffset, halfThickness]});
  this.crossRight.attr(cross).attr(leftRight).attr({
      'transform': 't' + [data['crossSpread'], halfThickness]});

  this.crossTop.setOutline(
      data['crossStrokeColor'], data['crossStrokeSize']);
  this.crossBottom.setOutline(
      data['crossStrokeColor'], data['crossStrokeSize']);
  this.crossLeft.setOutline(
      data['crossStrokeColor'], data['crossStrokeSize']);
  this.crossRight.setOutline(
      data['crossStrokeColor'], data['crossStrokeSize']);

  var period = parseInt(data['crossSpinPeriod'], 10);
  if (period != this.currentPeriod_) {
    if (period > 0) {
      this.currentPeriod_ = period;
      this.spin();
    } else {
      this.currentPeriod_ = 0;
      this.setRotation(data['crossRotation']);
    }
  }
};









/**
 * The overlay's reticle object.
 * @public {overlay.Reticle}
 */
overlay.reticle = null;
/**
 * The overlay's storage node for its settings.
 * @public {nx.StorageNode}
 */
overlay.settings = null;
/**
 * Renders the reticle.
 */
overlay.renderReticle = function() {
  console.log('Rendering reticle.');
  overlay.reticle.render(overlay.settings.data);
};
/**
 * Triggered then a hotkey is pressed.
 * @param {string} name The name of the hotkey that was triggered.
 */
overlay.onHotkeyPressed = function(name) {
  if (name == 'reticle_menu') {
    console.log('Reticle menu hotkey triggered.');
    overlay.settings.setVisible(true);
  }
};
/**
 * Invoked when the reticle settings have changed.
 */
overlay.onDataChanged = function() {
  console.log('Data changed.');
  overlay.renderReticle();
};
/**
 * Invoked when the window is resized.
 */
overlay.onResize = function() {
  console.log('Window resized.');
  overlay.renderReticle();
};
/**
 * Invoked when game state changes.  Used when in overwolf.
 */
overlay.onGameStateChanged = function() {
  var width, height;
  if (nx.ow.gameInfo()) {
    width = nx.ow.gameInfo().width;
    height = nx.ow.gameInfo().height;
  } else {
    width = window.screen.width;
    height = window.screen.height;
  }
  // Resize the window, triggering onResize()
  nx.ow.setWindowRect(overlay.windowId, 0, 0, width, height);
};
/**
 * Hides the settings window if you're in a game.
 */
overlay.hideSettings = function() {
  if (nx.ow.isInOverwolf()) {
    overlay.settings.setVisible(false);
  }
};
/**
 * Invoked when a window is retrieved; used to retrieve initial game
 * information and to use it to resize the overlay window.
 * @param {string} name The name of the window that was retrieved.
 * @param {string} id The id of the window that was retrieved.
 */
overlay.onWindowRetrieved = function(name, id) {
  if (name != 'MainWindow' || overlay.windowId) return;
  overlay.windowId = id;
  // GameState handler
  nx.ow.setGameStateChangedCallback(overlay.onGameStateChanged);
  // Get initial state, which also triggers the change event.
  nx.ow.updateGameInfo();
};
/**
 * Initializes the reticle overlay.
 * @param {string} surfaceId The id of the SVG surface element.
 * @param {string} storageKey The storage key to store the settings under.
 * @param {string} nodeId The id of a parent node of the settings fields.
 */
overlay.init = function(surfaceId, storageKey, nodeId) {
  if (!nx.ow.isInOverwolf()) {
    // If we're not in-game, set a background color.  Setting one in game
    // makes the background non-transparent.
    document.body.bgColor = 'black';
  }
  overlay.reticle = new overlay.Reticle(surfaceId);
  overlay.settings = new nx.StorageNode(storageKey, nodeId);
  overlay.settings.accessors().forEach(function(accessor) {
    if (accessor.fieldType() == nx.FieldType.COLOR) {
      var element = accessor.element();
      // If doing this before auto-binding, manual bind.
      if (!element.color) {
        element.color = new jscolor.color(element);
      }
      // Use our settings
      nx.copyProperties(element.color, {
        'hash': true,
        'pickerClosable': true,
        'onImmediateChange':
            nx.bind(overlay.settings, overlay.settings.onDataChanged)
      });
      // Force reprocessing.
      accessor.set(accessor.get());
    }
  });
  // We just changed the data for color fields, so update it.
  overlay.settings.onDataChanged();

  // Resize handler
  window.addEventListener('resize', overlay.onResize);

  overlay.settings.load();
  overlay.settings.setOnChangeListener(overlay.onDataChanged);

  if (nx.ow.isInOverwolf()) {
    // Register hotkey
    overwolf.settings.registerHotKey('reticle_menu', function(result) {
        if (result.status == 'success') {
          overlay.onHotkeyPressed('reticle_menu');
        }
    });
    nx.ow.getWindowId('MainWindow', overlay.onWindowRetrieved);
  } else {
    // Initial view status
    overlay.settings.setVisible(true);
  }
  // Initial render
  overlay.renderReticle();
};

// Exports
window['main'] = {
  'init': overlay.init,
  'onDataChanged': overlay.onDataChanged
};
