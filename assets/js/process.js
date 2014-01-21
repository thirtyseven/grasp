// Generated by LiveScript 1.2.0
(function(){
  var path, Process;
  path = require('path');
  module.exports = Process = (function(){
    Process.displayName = 'Process';
    var prototype = Process.prototype, constructor = Process;
    function Process(){
      this._cwd = '/';
    }
    prototype.stdout = {};
    prototype.cwd = function(){
      return this._cwd;
    };
    prototype.previousCwd = function(){
      return this._previousCwd;
    };
    prototype.chdir = function(dir){
      this._previousCwd = this._cwd;
      this._cwd = path.resolve(this._cwd, dir);
    };
    return Process;
  }());
}).call(this);
