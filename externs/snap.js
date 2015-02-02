
/**
 * @param {*=} w
 * @param {*=} h
 * @return {Paper} The surface
 */
var Snap = function(w,h) {};

/**
 * @constructor
 */
var Paper = function() {};

/**
 * @param {*=} ms
 * @param {*=} easing
 * @param {*=} callback
 */
Paper.prototype.animate = function(
    from, to, setter, ms, easing, callback) {};
/** @param {*=} value */
Paper.prototype.attr = function(params, value) {};
Paper.prototype.stop = function() {};
/** @param {?Paper} el */
Paper.prototype.add = function(el) {};
/** @public {Node} */
Paper.prototype.node = null;
/** @return {Paper} the group */
Paper.prototype.group = function() {};
/** @return {Paper} the circle */
Paper.prototype.circle = function() {};
/** @return {Paper} the rect */
Paper.prototype.rect = function() {};
/** @return {Paper} the image */
Paper.prototype.image = function() {};
/** @return {Paper} an svg element */
Paper.prototype.svg = function() {};
