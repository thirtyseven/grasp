// Generated by LiveScript 1.3.1
(function(){
  var ref$, sort, names, unchars, words, unwords, path, EventEmitter, grasp, StdIn, textFormat, i$, len$, aliases, runCommand, argsRegex, run, slice$ = [].slice;
  ref$ = require('prelude-ls'), sort = ref$.sort, names = ref$.names, unchars = ref$.unchars, words = ref$.words, unwords = ref$.unwords;
  path = require('path');
  EventEmitter = require('events').EventEmitter;
  grasp = require('grasp');
  StdIn = (function(superclass){
    var prototype = extend$((import$(StdIn, superclass).displayName = 'StdIn', StdIn), superclass).prototype, constructor = StdIn;
    function StdIn(data){
      var this$ = this instanceof ctor$ ? this : new ctor$;
      this$.data = data != null
        ? data
        : [];
      this$.emitData = bind$(this$, 'emitData', prototype);
      this$.done = false;
      return this$;
    } function ctor$(){} ctor$.prototype = prototype;
    prototype.push = function(it){
      return this.data.push(it);
    };
    prototype.finish = function(){
      return this.done = true;
    };
    prototype.emitData = function(){
      if (this.data.length) {
        this.emit('data', this.data.shift());
      }
      if (!this.data.length && this.done) {
        clearInterval(this.interval);
        return this.emit('end');
      }
    };
    prototype.resume = function(){
      return this.interval = setInterval(this.emitData, 0);
    };
    prototype.setEncoding = function(){};
    return StdIn;
  }(EventEmitter));
  textFormat = {};
  for (i$ = 0, len$ = (ref$ = ['green', 'cyan', 'magenta', 'red', 'bold']).length; i$ < len$; ++i$) {
    (fn$.call(this, ref$[i$]));
  }
  aliases = {
    '..': ['cd', ['..']],
    '...': ['cd', ['../..']],
    '....': ['cd', ['../../..']],
    'l': ['ls', []],
    'help': ['grasp', ['--help']]
  };
  runCommand = function(arg$, arg1$){
    var fs, process, term, callback, error, stdin, exit, command, args, mvCp, writeAppend, ref$, _console, names, output, res$, i$, len$, name, target, targetPath, e, file, recursive, filename, $demoContainer, $term, cancel, save;
    fs = arg$.fs, process = arg$.process, term = arg$.term, callback = arg$.callback, error = arg$.error, stdin = arg$.stdin, exit = arg$.exit;
    command = arg1$[0], args = slice$.call(arg1$, 1);
    mvCp = function(cmd, args){
      var i$, sources, dest, destIsDir, e, len$, source, destPath;
      sources = 0 < (i$ = args.length - 1) ? slice$.call(args, 0, i$) : (i$ = 0, []), dest = args[i$];
      try {
        destIsDir = fs.lstatSync(dest).isDirectory();
      } catch (e$) {
        e = e$;
        destIsDir = false;
      }
      if (destIsDir) {
        for (i$ = 0, len$ = sources.length; i$ < len$; ++i$) {
          source = sources[i$];
          destPath = path.join(dest, path.basename(source));
          try {
            if (cmd === 'mv') {
              fs.mvSync(source, destPath);
            } else {
              fs.cpSync(source, destPath);
            }
          } catch (e$) {
            e = e$;
            error(cmd + ": " + e.message);
          }
        }
      } else {
        if (sources.length === 1) {
          source = sources[0];
          try {
            if (cmd === 'mv') {
              fs.mvSync(source, dest);
            } else {
              fs.cpSync(source, dest);
            }
          } catch (e$) {
            e = e$;
            error(cmd + ": " + e.message);
          }
        } else {
          error(cmd + ": target '" + dest + "' is not a directory");
        }
      }
    };
    writeAppend = function(cmd, args){
      var output;
      output = '';
      stdin.on('data', (function(it){
        return output += it;
      }));
      stdin.on('end', function(){
        var i$, ref$, len$, targetPath, e;
        for (i$ = 0, len$ = (ref$ = args).length; i$ < len$; ++i$) {
          targetPath = ref$[i$];
          try {
            fs[cmd + "FileSync"](targetPath, output);
          } catch (e$) {
            e = e$;
            error("Failed " + cmd + "ing to " + targetPath);
          }
        }
        return exit();
      });
      return stdin.resume();
    };
    if (command in aliases) {
      ref$ = aliases[command], command = ref$[0], args = ref$[1];
    }
    switch (command) {
    case 'grasp':
      _console = {
        log: callback,
        warn: callback,
        error: callback,
        time: function(){},
        timeEnd: function(){}
      };
      grasp({
        args: unwords(args),
        error: error,
        callback: callback,
        exit: exit,
        stdin: stdin,
        textFormat: textFormat,
        fs: fs,
        console: _console
      });
      break;
    case 'clear':
      term.clear();
      break;
    case 'pwd':
      callback(process.cwd());
      break;
    case 'ls':
      names = fs.readdirSync(args[0] || '.');
      res$ = [];
      for (i$ = 0, len$ = (ref$ = sort(names)).length; i$ < len$; ++i$) {
        name = ref$[i$];
        if (fs.lstatSync(name).isDirectory()) {
          res$.push(textFormat.bold(name));
        } else {
          res$.push(name);
        }
      }
      output = res$;
      if (output.length) {
        callback(unwords(output));
      }
      break;
    case 'cd':
      target = args[0] || '/';
      targetPath = target === '-'
        ? process.previousCwd()
        : path.resolve(process.cwd(), target);
      try {
        if (fs.lstatSync(targetPath).isDirectory()) {
          process.chdir(targetPath);
        } else {
          error("cd: " + targetPath + ": Not a directory");
        }
      } catch (e$) {
        e = e$;
        error("cd: " + targetPath + ": No such file or directory");
      }
      break;
    case 'mkdir':
      targetPath = args[0];
      try {
        fs.mkdirSync(targetPath);
      } catch (e$) {
        e = e$;
        error("mkdir: " + e.message);
      }
      break;
    case 'cat':
      output = [];
      for (i$ = 0, len$ = args.length; i$ < len$; ++i$) {
        file = args[i$];
        try {
          output.push(fs.readFileSync(file));
        } catch (e$) {
          e = e$;
          error("cat: " + e.message);
        }
      }
      callback(unchars(output));
      break;
    case 'echo':
      callback(unwords(args));
      break;
    case 'touch':
      try {
        fs.writeFileSync(args[0], '');
      } catch (e$) {
        e = e$;
        error("touch: " + e.message);
      }
      break;
    case 'rm':
      if (args[0] === '-r') {
        args.shift();
        recursive = true;
      } else {
        recursive = false;
      }
      for (i$ = 0, len$ = args.length; i$ < len$; ++i$) {
        target = args[i$];
        try {
          fs.unlinkSync(target, recursive);
        } catch (e$) {
          e = e$;
          error(e.message);
        }
      }
      break;
    case 'rmdir':
      for (i$ = 0, len$ = args.length; i$ < len$; ++i$) {
        target = args[i$];
        try {
          fs.rmdirSync(target);
        } catch (e$) {
          e = e$;
          error(e.message);
        }
      }
      break;
    case 'cp':
      mvCp('cp', args);
      break;
    case 'mv':
      mvCp('mv', args);
      break;
    case 'write':
      writeAppend('write', args);
      break;
    case 'append':
      writeAppend('append', args);
      break;
    case 'edit':
      filename = args[0];
      try {
        output = fs.readFileSync(filename);
      } catch (e$) {
        e = e$;
        output = '';
      }
      $demoContainer = $('#demo-container');
      $term = $('#demo-terminal');
      $term.hide();
      $demoContainer.append("<div class=\"edit-file\">\n  <textarea class=\"term\">" + output + "</textarea>\n  <div class=\"edit-buttons\">\n    <button type=\"button\" class=\"btn btn-primary action-save\">Save</button>\n    <button type=\"button\" class=\"btn btn-default action-cancel\">Cancel</button>\n  </div>\n</div>");
      $demoContainer.find('.edit-file textarea').focus();
      cancel = function(){
        $('.edit-file').remove();
        $term.show();
        $term.click();
        return exit();
      };
      save = function(){
        fs.writeFileSync(filename, $demoContainer.find('.edit-file textarea').val());
        $demoContainer.find('.edit-file').remove();
        $term.show();
        $term.click();
        return exit();
      };
      $demoContainer.find('.edit-file .action-cancel').click(cancel);
      $demoContainer.find('.edit-file .action-save').click(save);
      break;
    default:
      error("Invalid command: " + command + " " + unwords(args));
    }
    if (command !== 'grasp' && command !== 'edit' && command !== 'write') {
      exit();
    }
  };
  argsRegex = /'(?:[^']|\\')+'|"(?:[^"]|\\")+"|\||<|>>|>|;|[^\s\|<>;]+/g;
  run = function(options, args){
    var term, tokens, commands, sequence, tokensSoFar, token, i$, len$, lastI, stdin, j$, len1$, i, command, ref$, callback, exit, runCommandOptions;
    term = options.term;
    term.pause();
    args = args.trim();
    ga('send', 'event', 'demo', 'run', 'args', args);
    tokens = args.match(argsRegex);
    if (tokens[tokens.length - 1] !== ';') {
      tokens.push(';');
    }
    commands = [];
    sequence = [];
    tokensSoFar = [];
    while (tokens.length) {
      token = tokens.shift();
      switch (token) {
      case '|':
        sequence.push(tokensSoFar);
        tokensSoFar = [];
        break;
      case ';':
        if (tokensSoFar.length) {
          sequence.push(tokensSoFar);
        }
        commands.push(sequence);
        tokensSoFar = [];
        sequence = [];
        break;
      case '<':
        sequence.push(['cat', tokens.shift()]);
        break;
      case '>':
        sequence.push(tokensSoFar);
        tokensSoFar = [];
        sequence.push(['write', tokens.shift()]);
        break;
      case '>>':
        sequence.push(tokensSoFar);
        tokensSoFar = [];
        sequence.push(['append', tokens.shift()]);
        break;
      default:
        tokensSoFar.push(token);
      }
    }
    for (i$ = 0, len$ = commands.length; i$ < len$; ++i$) {
      sequence = commands[i$];
      lastI = sequence.length - 1;
      stdin = new StdIn;
      for (j$ = 0, len1$ = sequence.length; j$ < len1$; ++j$) {
        i = j$;
        command = sequence[j$];
        ref$ = i === lastI
          ? [stdin, options.callback, fn$]
          : (stdin = new StdIn, [stdin, fn1$, fn2$]), stdin = ref$[0], callback = ref$[1], exit = ref$[2];
        runCommandOptions = {
          fs: options.fs,
          process: options.process,
          term: options.term,
          callback: callback,
          error: options.error,
          stdin: stdin,
          exit: exit
        };
        runCommand(runCommandOptions, command);
      }
    }
    function fn$(){
      return term.resume();
    }
    function fn1$(it){
      return stdin.push(it);
    }
    function fn2$(){
      stdin.finish();
      return term.resume();
    }
  };
  module.exports = {
    run: run
  };
  function bind$(obj, key, target){
    return function(){ return (target || obj)[key].apply(obj, arguments) };
  }
  function extend$(sub, sup){
    function fun(){} fun.prototype = (sub.superclass = sup).prototype;
    (sub.prototype = new fun).constructor = sub;
    if (typeof sup.extended == 'function') sup.extended(sub);
    return sub;
  }
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
  function fn$(name){
    textFormat[name] = function(it){
      return "<span class='" + name + "'>" + it + "</span>";
    };
  }
}).call(this);
