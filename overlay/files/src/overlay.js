
goog.provide('overlay');
goog.require('nx');
goog.require('nx.Reticle');

/**
 * The overlay window.
 * @type {?ODKWindow}
 */
overlay.window = null;
/**
 * The settings window
 * @type {?ODKWindow}
 */
overlay.settingsWindow = null;
/**
 * The game information.
 * @type {?GameInfo}
 */
overlay.game = null;
/**
 * The nx.Reticle object.
 * @type {nx.Reticle}
 */
overlay.reticle = null;
/**
 * Positions the overlay window so that it is centered.
 */
overlay.positionWindow = function() {
  var dest;
  if (!overlay.game || !overlay.game.isRunning) {
    console.log('Positioning: using screen.');
    dest = window.screen;
  } else {
    console.log('Positioning: using game window.');
    dest = overlay.game;
  }
  // Get center the overlay on the game window using integral offsets.
  var x = (dest.width - overlay.window.width) / 2 | 0;
  var y = (dest.height - overlay.window.height) / 2 | 0;
  overwolf.windows.changePosition(overlay.window.id, x, y);
};

/**
 * Invoked when new GameInfo has been retrieved.
 * @param {GameInfo} gameInfo
 */
overlay.onGameInfo = function(gameInfo) {
  overlay.game = gameInfo;
  overlay.positionWindow();
};
/**
 * Invoked when a GameInfo change is reported.
 * @param {GameInfoChangeData} changeData The change data.
 */
overlay.onGameInfoUpdated = function(changeData) {
  overlay.onGameInfo(changeData && changeData.gameInfo || null);
};
/**
 * Invoked when the current window is retrieved; used for initialization.
 * @param {Object} result The overwolf result object.
 */
overlay.onCurrentWindow = function(result) {
  if (result.status === 'success' && result.window !== null) {
    var isFirstTime = (overlay.window === null);
    overlay.window = result.window;
    // Should only be invoked once, but for safety...
    if (isFirstTime) {
      // Listen for new changes to the info
      overwolf.games.onGameInfoUpdated.addListener(overlay.onGameInfoUpdated);
      // Retrieve the current info
      overwolf.games.getRunningGameInfo(overlay.onGameInfo);
    }
  }
};
/**
 * Renders the reticle with the current settings.
 */
overlay.render = function() {
  overlay.reticle.render();
};
/**
 * Triggered when stored data changes.
 * @param {Event} storageEvent The event information.
 */
overlay.onStorageEvent = function(storageEvent) {
  var key = storageEvent.key;
  console.log('Got storage event: ' + key);
  if (nx.Reticle.defaultData.hasOwnProperty(key)) {
    overlay.render();
  }
};
/**
 * Triggered then a hotkey is pressed.
 * @param {string} name The name of the hotkey that was triggered.
 */
overlay.onHotkeyPressed = function(name) {
  if (name == 'reticleMenu') {
    console.log('Reticle menu hotkey triggered.');
    if (overlay.settingsWindow) {
      overwolf.windows.restore(overlay.settingsWindow.id);
    }
  }
};
/**
 * Initializes the overlay.
 */
overlay.init = function() {
  overlay.reticle = new nx.Reticle('reticleSurface');
  // Initialize stored settings
  nx.forEachProperty(nx.Reticle.defaultData, function(key, value) {
    var stored = nx.storage.get(/** @type {string} */ (key));
    if (stored === null) {
      nx.storage.set(/** @type {string} */ (key), value);
    }
  });
  nx.storage.addListener(overlay.onStorageEvent);
  if (window.overwolf) {
    overwolf.windows.getCurrentWindow(overlay.onCurrentWindow);
    overwolf.windows.obtainDeclaredWindow('SettingsWindow', function(result) {
        if (result.status === 'success') {
          overlay.settingsWindow = result.window;
        }
    });
    overwolf.settings.registerHotKey('reticleMenu', function(result) {
        if (result.status === 'success') {
          overlay.onHotkeyPressed('reticleMenu');
        }
    });
  } else {
    document.body.bgColor = 'black';
  }
  overlay.reticle.setDataCallback(nx.storage.get);
  overlay.render();
};

