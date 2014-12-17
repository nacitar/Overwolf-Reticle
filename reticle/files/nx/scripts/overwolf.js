// TODO: google closure?  dojo?
var nx = nx || {};
/**
 * Namespace for overwolf stuff
 */
nx.ow = nx.ow || {};

// DEPENDS: common.js

/**
 * Indicates if we are running in overwolfoor not.
 * @return {boolean} True if we are running in overwolf, false otherwise.
 */
nx.ow.inOverwolf = function() {
  return (typeof(overwolf) != 'undefined');
};
/**
 * Indicates whether a game is focused or not.
 * @public {boolean}
 */
nx.ow.isInGame = false;
/**
 * Stores the user's callback for game state changes.  Should really be an
 * event, though.
 * @private {Function}
 */
nx.ow.gameStateChangedCallback_ = null;
/**
 * Sets the callback to be invokes when the game state changes.
 * @param {Function} callback The function to be invoked.
 */
nx.ow.setGameStateChangedCallback = function(callback) {
  nx.ow.gameStateChangedCallback_ = callback;
};
/**
 * Callback for overwolf's onGameInfoUpdated.
 * @param {Object} gameInfoChangeData The GameInfoChangeData from overwolf.
 * @private {Function}
 */
nx.ow.onGameInfoUpdated_ = function(gameInfoChangeData) {
  var gameInfo = gameInfoChangeData.gameInfo;
  if (Boolean(gameInfo && gameInfo.isInFocus) != nx.ow.isInGame) {
    nx.ow.isInGame = !nx.ow.isInGame;
    nx.ow.gameStateChangedCallback_ && nx.ow.gameStateChangedCallback_();
  }
};
/**
 * Triggers the onGameInfoUpdated handler.
 * @param {?Object} gameInfo A GameInfo object from overwolf, or null.
 */
nx.ow.updateGameInfo = function(gameInfo) {
  nx.ow.onGameInfoUpdated_({
      gameInfo: gameInfo,
      resolutionChanged: true,
      focusChanged: true,
      runningChanged: true,
      gameChanged: true });
};
/**
 * For testing, allows you to simulate overwolf having changed the game state.
 * @param {boolean} isInGame True if indicating being in a game.
 */
nx.ow.setGameState = function(isInGame) {
  info = {isInFocus: Boolean(isInGame)};
  nx.ow.onGameInfoUpdated_(info);
};
/**
 * Attempts to set the window to be at (0,0) and to match the screen size.
 */
nx.ow.setFullScreen = function() {
  if (!nx.ow.inOverwolf()) return;

  overwolf.windows.getCurrentWindow(function(result) {
    if (result.status === 'success') {
      var size = nx.screenSize();
      overwolf.windows.changePosition(result.window.id, 0, 0);
      overwolf.windows.changeSize(result.window.id, size.width, size.height);
    }
  });
};

// INITIALIZATION
(function() {
  // Add a listener and initialize the game state information.
  if (nx.ow.inOverwolf()) {
    overwolf.games.onGameInfoUpdated.addListener(nx.ow.onGameInfoUpdated_);
    overwolf.games.getRunningGameInfo(nx.ow.updateGameInfo);
  }
})();
