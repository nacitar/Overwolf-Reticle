
goog.provide('overlay');
goog.require('nx');

overlay.window = null;
overlay.settingsWindow = null;
overlay.game = null;

overlay.positionWindow = function() {
  var dest
  if (!overlay.game || !overlay.game.isRunning) {
    console.log ('Positioning: using screen.');
    dest = window.screen;
  } else {
    console.log ('Positioning: using game window.');
    dest = overlay.game;
  }
  //overwolf.windows.restore(overlay.window.id);
  // Get center the overlay on the game window using integral offsets.
  var x = (dest.width - overlay.window.width) / 2 | 0;
  var y = (dest.height - overlay.window.height) / 2 | 0;
  overwolf.windows.changePosition(overlay.window.id, x, y);
};

overlay.onGameInfo = function(gameInfo) {
  overlay.game = gameInfo;
  overlay.positionWindow();
};

overlay.onGameInfoUpdated = function(changeData) {
  overlay.onGameInfo(changeData && changeData.gameInfo || null);
};

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

overlay.reticle = null;

overlay.render = function() {
  overlay.reticle.render();
};
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


overlay.init = function() {
  overlay.reticle = new nx.Reticle('reticleSurface');
  // Initialize stored settings
  nx.forEachProperty(nx.Reticle.defaultData, function(key, value) {
    var stored = nx.storage.get(key);
    if (stored === null) {
      nx.storage.set(key, value);
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

