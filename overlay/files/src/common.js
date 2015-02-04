goog.provide('overlay.common');
goog.require('nx');

/**
 * Default reticle settings.
 * @type {Object}
 */
overlay.common.defaultReticleSettings = {
  'opacity': '1.0',
  'crossEnabled': true,
  'crossRendering': 'crispEdges',
  'crossColor': '#0000FF',
  'crossStrokeColor': '#FFFFFF',
  'crossLength': '8',
  'crossSpread': '7',
  'crossThickness': '2',
  'crossStrokeSize': '1',
  'crossSpinPeriod': '0',
  'crossRotation': '0',
  'centerEnabled': true,
  'centerRendering': 'crispEdges',
  'centerShape': 'square',
  'centerColor': '#0000FF',
  'centerStrokeColor': '#FFFFFF',
  'centerDiameter': '4',
  'centerStrokeSize': '1',
  'circleEnabled': false,
  'circleRendering': 'geometricPrecision',
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
 * Default general settings.
 * @type {Object}
 */
overlay.common.defaultGeneralSettings = {
  'streamingMode': 'Never'
};
/**
 * Retrieves the specified setting from localStorage, falling back to defaults
 * otherwise.
 * @param {string} key The key.
 * @return {*} The value.
 */
overlay.common.getSetting = function(key) {
  var value = null;
  if (overlay.common.defaultReticleSettings.hasOwnProperty(key) ||
      overlay.common.defaultGeneralSettings.hasOwnProperty(key)) {
    value = nx.storage.get(key);
    if (value === null) {
      value = nx.default(
          overlay.common.defaultReticleSettings[key],
          overlay.common.defaultGeneralSettings[key]);
    }
  }
  return value;
};

/**
 * The signal invoked when the GameInfo changes.
 * @type {nx.Signal}
 */
overlay.common.eventGameInfo = new nx.Signal();
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
/**
 * Sets the streaming mode of a window to the one in the 'streamingMode'
 * setting.
 * @param {string=} opt_windowId The overwolf window id, or by default the
 * current window id.
 * @param {string=} opt_mode The streaming mode, or by default the currently
 * stored value.
 */
overlay.common.setWindowStreamingMode = function(opt_windowId, opt_mode) {
  opt_windowId = /** @type {string} */ (
      nx.default(opt_windowId, nx.odkWindow.id));
  opt_mode = /** @type {string} */ (
      nx.default(opt_mode, overlay.common.getSetting('streamingMode')));
  overwolf.streaming.setWindowStreamingMode(
      opt_windowId,
      overwolf.streaming.enums.StreamingMode[opt_mode],
      function(result) {
        if (result.status === 'success') {
          console.log('Streaming mode set successfully.');
        }
      });
};
/**
 * Triggered when stored data changes.
 * @param {string} key The key whose value changed.
 * @param {*} newValue The new value.
 * @param {*} oldValue The old value.
 */
overlay.common.onStorageChanged = function(key, newValue, oldValue) {
  console.log('Common storage changed: ' + key + ' = ' + newValue);
  if (overlay.common.defaultGeneralSettings.hasOwnProperty(key)) {
    if (key === 'streamingMode') {
      if (window.overwolf) {
        overlay.common.setWindowStreamingMode();
      }
    }
  }
};
/**
 * Initializes common handling.
 */
overlay.common.initialize = function() {
  if (window.overwolf) {
    overlay.common.setWindowStreamingMode();
  }
  nx.storage.eventChange.connect(new nx.Slot(
        /** @type {function(...*)} */ (overlay.common.onStorageChanged)));
};

// Register initialization code.
nx.eventInitialize.connect(new nx.Slot(overlay.common.initialize));
