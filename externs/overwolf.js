/*
 * Copyright (C) 2014 Jacob McIntosh <nacitar at ubercpp dot com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Definitions for the overwolf API.
 * @externs
 */

/**
 * namespace
 * Provides streaming functions.
 * @const
 */
var overwolf = {};
overwolf.version = '0.81.70';

// TODO: StreamSettings, StreamParams, StreamAudioOptions, WatermarkSettings
overwolf.streaming = {};
/** @param {Function=} callback */
overwolf.streaming.start = function(settings, callback) {};
/** @param {Function=} callback */
overwolf.streaming.stop = function(streamId, callback) {};
/** @param {Function=} callback */
overwolf.streaming.changeVolume = function(streamId, audioOptions, callback) {};
/** @param {Function=} callback */
overwolf.streaming.setWatermarkSettings = function(settings, callback) {};
overwolf.streaming.getWatermarkSettings = function(callback) {};
overwolf.streaming.getWindowStreamingMode = function(windowId, callback) {};
overwolf.streaming.setWindowStreamingMode = function(
    windowId, streamingMode, callback) {};
overwolf.streaming.setBRBImage = function(
    streamId, image, backgroundColor, callback) {};

overwolf.streaming.onStopStreaming = {};
overwolf.streaming.onStopStreaming.addListener = function(callback) {};
overwolf.streaming.onStopStreaming.removeListener = function(callback) {};

overwolf.streaming.onStreamingError = {};
overwolf.streaming.onStreamingError.addListener = function(callback) {};
overwolf.streaming.onStreamingError.removeListener = function(callback) {};

overwolf.streaming.enums = {};
overwolf.streaming.enums.StreamingProvider = {Twitch: 'Twitch'};
overwolf.streaming.enums.StreamingMode = {
  WhenVisible: 'WhenVisible', Always: 'Always', Never: 'Never'};

overwolf.windows = {};
/** @param {Function=} callback */
overwolf.windows.getCurrentWindow = function(callback) {};
/** @param {Function=} callback */
overwolf.windows.obtainDeclaredWindow = function(windowName, callback) {};
overwolf.windows.dragMove = function(windowId) {};
overwolf.windows.dragResize = function(windowId, edge) {};
/** @param {Function=} callback */
overwolf.windows.changeSize = function(windowId, width, height, callback) {};
/** @param {Function=} callback */
overwolf.windows.changePosition = function(windowId, left, top, callback) {};
/** @param {Function=} callback */
overwolf.windows.close = function(windowId, callback) {};
/** @param {Function=} callback */
overwolf.windows.minimize = function(windowId, callback) {};
/** @param {Function=} callback */
overwolf.windows.maximize = function(windowId, callback) {};
/** @param {Function=} callback */
overwolf.windows.restore = function(windowId, callback) {};

overwolf.settings = {};
overwolf.settings.getHotKey = function(featureId, callback) {};
overwolf.settings.registerHotKey = function(actionId, callback) {};

overwolf.media = {};
/** @param {Function=} callback */
overwolf.media.takeScreenshot = function(callback) {};
/** @param {Function=} callback */
overwolf.media.shareImage = function(image, description, callback) {};

overwolf.media.onScreenshotTaken = {};
overwolf.media.onScreenshotTaken.addListener = function(callback) {};
overwolf.media.onScreenshotTaken.removeListener = function(callback) {};

overwolf.games = {};
overwolf.games.getRunningGameInfo = function(callback) {};

overwolf.games.onGameInfoUpdated = {};
overwolf.games.onGameInfoUpdated.addListener = function(callback) {};
overwolf.games.onGameInfoUpdated.removeListener = function(callback) {};

overwolf.games.onGameLaunched = {};
overwolf.games.onGameLaunched.addListener = function(callback) {};
overwolf.games.onGameLaunched.removeListener = function(callback) {};

overwolf.games.onMajorFrameRateChange = {};
overwolf.games.onMajorFrameRateChange.addListener = function(callback) {};
overwolf.games.onMajorFrameRateChange.removeListener = function(callback) {};

overwolf.extensions = {};
overwolf.extensions.launch = function(uid, parameter) {};
overwolf.extensions.getService = function(id, callback) {};
overwolf.extensions.current = null;

overwolf.profile = {};
overwolf.profile.getCurrentUser = function(callback) {};
overwolf.profile.openLoginDialog = function() {};

overwolf.profile.onLoginStateChanged = {};
overwolf.profile.onLoginStateChanged.addListener = function(callback) {};
overwolf.profile.onLoginStateChanged.removeListener = function(callback) {};

overwolf.utils = {};
overwolf.utils.placeOnClipboard = function(data) {};

/** @constructor */
var GameInfo = function() {};
GameInfo.prototype.isInFocus = true;
GameInfo.prototype.isRunning = true;
GameInfo.prototype.allowsVideoCapture = true;
GameInfo.prototype.title = '';
GameInfo.prototype.id = 0;
GameInfo.prototype.width = 0;
GameInfo.prototype.height = 0;
GameInfo.prototype.renderers = [];

/** @constructor */
var GameInfoChangeData = function() {};
/** @public {?GameInfo} */
GameInfoChangeData.prototype.gameInfo = null;
GameInfoChangeData.prototype.resolutionChanged = true;
GameInfoChangeData.prototype.focusChanged = true;
GameInfoChangeData.prototype.runningChanged = true;
GameInfoChangeData.prototype.gameChanged = true;

/** @constructor */
var ODKWindow = function() {};
ODKWindow.prototype.id = '';
ODKWindow.prototype.width = 0;
ODKWindow.prototype.height = 0;
ODKWindow.prototype.top = 0;
ODKWindow.prototype.left = 0;
ODKWindow.prototype.isVisible = false;
