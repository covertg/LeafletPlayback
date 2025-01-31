L.Playback = L.Playback || {};

L.Playback.Clock = L.Class.extend({

  initialize: function (trackController, callback, options) {
    this._trackController = trackController;
    this._callbacksArry = [];
    if (callback) this.addCallback(callback);
    L.setOptions(this, options);
    this._speed = this.options.speed;
    this._tickLen = this.options.tickLen;
    this._cursor = this._trackController.getStartTime();
    this._transitionTime = this._tickLen / this._speed;
  },

  _tick: function (self) {
    self._trackController.tock(self._cursor, self._transitionTime);
    if (self._cursor >= self._trackController.getEndTime()) {
      self.setCursor(self._trackController.getEndTime());
      self.stop();
    } else {
      self._cursor += self._tickLen;
    }
    self._callbacks(self._cursor);
  },

  _callbacks: function(cursor) {
    var arry = this._callbacksArry;
    for (var i=0, len=arry.length; i<len; i++) {
      arry[i](cursor);
    }
  },

  addCallback: function(fn) {
    this._callbacksArry.push(fn);
  },

  start: function () {
    if (this.isPlaying()) return;
    if (this._cursor >= this._trackController.getEndTime())
        this.setCursor(this._trackController.getStartTime());
    this.playControl._button.innerHTML = 'Stop';
    this._intervalID = window.setInterval(
      this._tick, 
      this._transitionTime, 
      this);
  },

  stop: function () {
    if (!this.isPlaying()) return;
    clearInterval(this._intervalID);
    this._intervalID = null;
    this.playControl._button.innerHTML = 'Play';
  },

  getSpeed: function() {
    return this._speed;
  },

  isPlaying: function() {
    return this._intervalID ? true : false;
  },

  setSpeed: function (speed) {
    this._speed = speed;
    this._transitionTime = this._tickLen / speed;
    if (this.isPlaying()) {
      this.stop();
      this.start();
    }
  },

  setCursor: function (ms) {
    var time = parseInt(ms);
    if (!time) return;
    var mod = time % this._tickLen;
    if (mod !== 0) {
      time += this._tickLen - mod;
    }
    this._cursor = time;
    this._trackController.tock(this._cursor, 0);
    this._callbacks(this._cursor);
  },

  getTime: function() {
    return this._cursor;
  },

  getStartTime: function() {
    return this._trackController.getStartTime();
  },

  getEndTime: function() {
    return this._trackController.getEndTime();
  },

  getTickLen: function() {
    return this._tickLen;
  }

});
