goog.provide('overlay');
goog.require('nx');
goog.require('nx.Reticle');
goog.require('overlay.common');

/**
 * The settings window
 * @type {?ODKWindow}
 */
overlay.settingsWindow = null;
/**
 * The nx.Reticle object.
 * @type {nx.Reticle}
 */
overlay.reticle = null;
/**
 * Renders the reticle with the current settings.
 */
overlay.render = function() {
  overlay.reticle.render();
};
/**
 * Triggered when stored data changes.
 * @param {string} key The key whose value changed.
 * @param {*} newValue The new value.
 * @param {*} oldValue The old value.
 */
overlay.onStorageChanged = function(key, newValue, oldValue) {
  if (overlay.common.defaultReticleSettings.hasOwnProperty(key)) {
    // In IE, the actual storage value is not updated yet, so delay rendering
    // such that the new value will be present when it executes.
    setTimeout(overlay.render, 0);
  }
};
/**
 * Triggered then a hotkey is pressed.
 * @param {string} name The name of the hotkey that was triggered.
 */
overlay.onHotkeyPressed = function(name) {
  if (name === 'reticleSettings') {
    console.log('Reticle menu hotkey triggered.');
    if (overlay.settingsWindow) {
      overwolf.windows.restore(overlay.settingsWindow.id);
    }
  }
};
/**
 * Positions the overlay window so that it is centered.
 */
overlay.positionWindow = function() {
  var dest;
  if (!overlay.common.game || !overlay.common.game.isRunning) {
    console.log('Positioning: using screen.');
    dest = window.screen;
  } else {
    console.log('Positioning: using game window.');
    dest = overlay.common.game;
  }
  // Get center the overlay on the game window using integral offsets.
  var x = (dest.width - nx.odkWindow.width) / 2 | 0;
  var y = (dest.height - nx.odkWindow.height) / 2 | 0;
  overwolf.windows.changePosition(nx.odkWindow.id, x, y);
};

/**
 * Initializes the overlay.
 */
overlay.initialize = function() {
  if (window.overwolf) {
    overlay.common.eventGameInfo.connect(new nx.Slot(overlay.positionWindow));
    overlay.common.listenForGameInfo();

    overwolf.windows.obtainDeclaredWindow('SettingsWindow', function(result) {
        if (result.status === 'success') {
          overlay.settingsWindow = result.window;
        }
    });
    overwolf.settings.registerHotKey('reticleSettings', function(result) {
        if (result.status === 'success') {
          overlay.onHotkeyPressed('reticleSettings');
        }
    });
  } else {
    document.body.bgColor = 'black';
  }
  overlay.reticle = new nx.Reticle('reticleSurface');
  nx.storage.eventChange.connect(new nx.Slot(
      /** @type {function(...*)} */ (overlay.onStorageChanged)));
  overlay.reticle.setDataCallback(overlay.common.getSetting);
  overlay.render();
};

// Register initialization code.
nx.eventInitialize.connect(new nx.Slot(overlay.initialize));
