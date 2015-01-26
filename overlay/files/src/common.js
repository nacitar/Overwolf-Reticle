goog.provide('overlay.common');
goog.require('nx');

/**
 * Default data for rendering the reticle.
 * @type {Object}
 */
overlay.common.defaultSettings = {
  'shapeRendering': 'geometricPrecision',
  'opacity': '1.0',
  'crossEnabled': true,
  'crossColor': '#0000FF',
  'crossStrokeColor': '#FFFFFF',
  'crossLength': '8',
  'crossSpread': '7',
  'crossThickness': '2',
  'crossStrokeSize': '1',
  'crossSpinPeriod': '1000',
  'crossRotation': '0',
  'centerEnabled': true,
  'centerShape': 'circle',
  'centerColor': '#0000FF',
  'centerStrokeColor': '#FFFFFF',
  'centerDiameter': '4',
  'centerStrokeSize': '1',
  'circleEnabled': true,
  'circleColor': '#0000FF',
  'circleStrokeColor': '#FFFFFF',
  'circleDiameter': '38',
  'circleThickness': '1',
  'circleStrokeSize': '1',
  'imageEnabled': true,
  'imageURL': '',
  'imageScale': '1'
};

/**
 * Retrieves the specified setting from localStorage, falling back to defaults
 * otherwise.
 * @param {string} key The key.
 * @return {*} The value.
 */
overlay.common.getSetting = function(key) {
  var value = null;
  if (overlay.common.defaultSettings.hasOwnProperty(key)) {
    value = nx.storage.get(key);
    if (value === null) {
      value = overlay.common.defaultSettings[key];
      nx.storage.set(key, value);
    }
  }
  return value;
};

