goog.provide('overlay.common');
goog.require('nx');

/**
 * Default data for rendering the reticle.
 * @type {Object}
 */
overlay.common.defaultSettings = {
  'shapeRendering': 'crispEdges',
  'opacity': '1.0',
  'crossEnabled': true,
  'crossColor': '#0000FF',
  'crossStrokeColor': '#FFFFFF',
  'crossLength': '8',
  'crossSpread': '7',
  'crossThickness': '2',
  'crossStrokeSize': '1',
  'crossSpinPeriod': '0',
  'crossRotation': '0',
  'centerEnabled': true,
  'centerShape': 'square',
  'centerColor': '#0000FF',
  'centerStrokeColor': '#FFFFFF',
  'centerDiameter': '4',
  'centerStrokeSize': '1',
  'circleEnabled': false,
  'circleColor': '#0000FF',
  'circleStrokeColor': '#FFFFFF',
  'circleDiameter': '38',
  'circleThickness': '1',
  'circleStrokeSize': '1',
  'imageEnabled': false,
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

/**
 * The signal invoked when the GameInfo changes.
 * @type {nx.signal}
 */
overlay.common.eventGameInfo = new nx.signal();
/**
 * Invoked when new GameInfo has been retrieved.
 * @param {GameInfo} gameInfo
 * @private
 */
overlay.common.onGameInfo_ = function(gameInfo) {
  overlay.common.game = gameInfo;
  overlay.common.eventGameInfo.emit();
};
/**
 * Invoked when a GameInfo change is reported.
 * @param {GameInfoChangeData} changeData The change data.
 * @private
 */
overlay.common.onGameInfoUpdated_ = function(changeData) {
  overlay.common.onGameInfo_(changeData && changeData.gameInfo || null);
};
/**
 * Indicates whether or not we're listening for GameInfo changes.
 * @type {boolean}
 * @private
 */
overlay.common.isListeningForGameInfo_ = false;
/**
 * Installs GameInfo monitoring hooks.  Fires eventGameInfo upon changes.
 */
overlay.common.listenForGameInfo = function() {
  // Only install once.
  if (!overlay.common.isListeningForGameInfo_) {
    overlay.common.isListeningForGameInfo_ = true;
    // Listen for new changes to the info
    overwolf.games.onGameInfoUpdated.addListener(
        overlay.common.onGameInfoUpdated_);
    // Retrieve the current info
    overwolf.games.getRunningGameInfo(overlay.common.onGameInfo_);
  }
};
