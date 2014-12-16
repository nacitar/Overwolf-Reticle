// TODO: google closure?  dojo?
var nx = nx || {};
nx.ow = nx.ow || {};

// DEPENDS: common.js

/**
 * @return {boolean} True if we are running in overwolf, false otherwise.
 */
nx.ow.inOverwolf = function() {
  return (typeof(overwolf) != "undefined");
};
/**
 * Indicates whether a game is focused or not.
 * @private {boolean}
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
 * @param callback The function to be invoked.
 */
nx.ow.setGameStateChangedCallback = function(callback) {
  nx.ow.gameStateChangedCallback_ = callback;
};
/**
 * Callback for overwolf's onGameInfoUpdated.
 * @private {Function}
 */
nx.ow.onGameInfoUpdated_ = function(info) {
  if (Boolean(info && info.isInFocus) != nx.ow.isInGame) {
    nx.ow.isInGame = !nx.ow.isInGame;
    nx.ow.gameStateChangedCallback_ && nx.ow.gameStateChangedCallback_();
  }
};
/**
 * For testing, allows you to simulate overwolf having changed the game state.
 * @param {boolean} isInGame True if indicating being in a game.
 */
nx.ow.setGameState = function (isInGame) {
  info={isInFocus: Boolean(isInGame)}
  nx.ow.onGameInfoUpdated_(info);
};
/**
 * Attempts to set the window to be at (0,0) and to match the screen size.
 */
nx.ow.setFullScreen = function() {
  if (!nx.ow.inOverwolf()) return;

  overwolf.windows.getCurrentWindow(function(result) {
    if (result.status === 'success') {
      var size=nx.screenSize();
      overwolf.windows.changePosition(result.window.id, 0, 0);
      overwolf.windows.changeSize(result.window.id, size.width, size.height);
    }
  });
};
// INITIALIZATION
(function () {
  // Add a listener and initialize the game state information.
  if (nx.ow.inOverwolf()) {
    overwolf.games.onGameInfoUpdated.addListener(nx.ow.onGameInfoUpdated);
    overwolf.games.getRunningGameInfo(nx.ow.onGameInfoUpdated)
  };
})();
