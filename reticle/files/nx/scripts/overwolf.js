// TODO: google closure?  dojo?
var nx = nx || {};
/**
 * Namespace for overwolf stuff
 */
nx.ow = nx.ow || {};

// DEPENDS: common.js

/**
 * Indicates if we are running in overwolf or not.
 * @return {boolean} True if we are running in overwolf, false otherwise.
 */
nx.ow.isInOverwolf = function() {
  return (typeof(overwolf) != 'undefined');
};
/**
 * The current GameInfoChangeData from overwolf.
 * @public {GameInfoChangeData}
 */
nx.ow.gameInfoChangeData = null;
/**
 * Stores the user's callback for game state changes.  Should really be an
 * event, though.
 * @private {Function}
 */
nx.ow.gameStateChangedCallback_ = null;
/**
 * Provides current GameInfo from overwolf.
 * @return {GameInfo} The game info.
 */
nx.ow.gameInfo = function() {
  return (nx.ow.gameInfoChangeData && nx.ow.gameInfoChangeData.gameInfo);
};
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
  nx.ow.gameInfoChangeData = gameInfoChangeData;
  nx.ow.gameStateChangedCallback_ && nx.ow.gameStateChangedCallback_();
};
/**
 * Indicates if we are in a game or not.
 * @return {boolean} True if a game is focused, false otherwise.
 */
nx.ow.isGameFocused = function() {
  return Boolean(nx.ow.gameInfo() && nx.ow.gameInfo().isInFocus);
};
/**
 * Triggers the onGameInfoUpdated handler.
 * @param {?Object} gameInfo A GameInfo object from overwolf, or null.
 * @private
 */
nx.ow.onGameInfoRetrieved_ = function(gameInfo) {
  nx.ow.onGameInfoUpdated_({
      gameInfo: gameInfo,
      resolutionChanged: true,
      focusChanged: true,
      runningChanged: true,
      gameChanged: true });
};
/**
 * Retrieves fresh game information, causing a change event that indicates
 * everything has changed.
 */
nx.ow.updateGameInfo = function() {
  if (nx.ow.isInOverwolf()) {
    overwolf.games.getRunningGameInfo(nx.ow.onGameInfoRetrieved_);
  }
};
/**
 * Retrieves the id for a window from its name, invoking a callback with the
 * name and id.
 * @param {string} name The name of the window.
 * @param {Function} callback The callback to invoke, taking a name and id.
 */
nx.ow.getWindowId = function(name, callback) {
  if (nx.ow.isInOverwolf()) {
    overwolf.windows.obtainDeclaredWindow(name, function(result) {
      if (result.status === 'success') {
        // Overwolf puts an extra suffix _<name> on the id returned here, even
        // though it is not present when retrieving the current window and also
        // even though using it with the suffix breaks every window-id
        // accepting function.  Remove this suffix.
        var id = result.window.id;
        var suffix = '_' + name;
        var re = new RegExp(nx.escapeRegExp(suffix) + '$');
        // Check if the extra suffix is present
        if (re.test(id)) {
          // Remove the extra suffix
          id = id.slice(0, -suffix.length);
        }
        callback(name, id);
      } else {
        callback(name, null);
      }
    });
  }
};
/**
 * Attempts to move the specified window the the requested position and to
 * resize it to the requested size.
 * @param {string} id The window id.
 * @param {number} x The x coordinate.
 * @param {number} y The y coordinate.
 * @param {number} width The width.
 * @param {number} height The height.
 */
nx.ow.setWindowRect = function(id, x, y, width, height) {
  if (!nx.ow.isInOverwolf()) return;
  overwolf.windows.changePosition(id, x, y);
  overwolf.windows.changeSize(id, width, height);
};

// INITIALIZATION
(function() {
  // Add a listener and initialize the game state information.
  if (nx.ow.isInOverwolf()) {
    overwolf.games.onGameInfoUpdated.addListener(nx.ow.onGameInfoUpdated_);
  }
})();
