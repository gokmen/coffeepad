(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var CodeEditor, CoffeeEditor, SaveFileModal,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

CodeEditor = require('./editor');

SaveFileModal = require('./savemodal');

module.exports = CoffeeEditor = (function(_super) {
  __extends(CoffeeEditor, _super);

  function CoffeeEditor() {
    CoffeeEditor.__super__.constructor.call(this, {
      mode: "coffeescript"
    });
    this.histories = {};
    this.once('viewAppended', (function(_this) {
      return function() {
        return $(window).on("keydown", function(e) {
          if (e.which === 27) {
            $('body').removeClass('helpMode');
            return _this.cm.focus();
          }
        });
      };
    })(this));
  }

  CoffeeEditor.prototype.openFile = function(file) {
    return this.ready((function(_this) {
      return function() {
        if (!file) {
          return;
        }
        _this.histories[_this.fileName] = _this.cm.getDoc().getHistory();
        return _this.storage.getValue(file, function(content) {
          if (content == null) {
            content = "";
          }
          _this.cm.getDoc().clearHistory();
          _this.cm.setValue(content);
          if (_this.histories[file] != null) {
            _this.cm.getDoc().setHistory(_this.histories[file]);
          }
          _this.fileName = file;
          _this.storage.setValue("lastFile", file);
          return _this.cm.focus();
        });
      };
    })(this));
  };

  CoffeeEditor.prototype.compile = function(target) {
    var error;
    try {
      return target.cm.setValue(CoffeeScript.compile(this.cm.getValue(), {
        bare: true
      }));
    } catch (_error) {
      error = _error;
      if (this.getOption('logToConsole')) {
        return console.warn(error);
      }
    }
  };

  CoffeeEditor.prototype.saveFile = function(fileName, silence) {
    if (silence == null) {
      silence = false;
    }
    return this.storage.setValue(fileName, this.cm.getValue(), (function(_this) {
      return function() {
        var name;
        _this.storage.setValue("lastFile", fileName);
        _this.fileName = fileName;
        if (!silence) {
          name = _this.fileName.replace(/^file\-/, '');
          new KDNotificationView({
            title: "saved to " + name + "...",
            type: "tray"
          });
          _this.emit("fileSaved", _this.fileName);
        }
        return _this.cm.focus();
      };
    })(this));
  };

  CoffeeEditor.prototype.handleSaveAs = function(silence) {
    if (silence == null) {
      silence = false;
    }
    return new SaveFileModal((function(_this) {
      return function(err, fileName) {
        fileName = "file-" + fileName;
        if (err) {
          return _this.cm.focus();
        } else {
          return _this.saveFile(fileName, silence);
        }
      };
    })(this));
  };

  CoffeeEditor.prototype.handleSave = function(silence) {
    if (silence == null) {
      silence = false;
    }
    if (!this.fileName) {
      return this.handleSaveAs(silence);
    } else {
      return this.saveFile(this.fileName, silence);
    }
  };

  return CoffeeEditor;

})(CodeEditor);


},{"./editor":4,"./savemodal":10}],2:[function(require,module,exports){
var CPShortcutItemView, CoffeePadHeader,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

CPShortcutItemView = (function(_super) {
  var Mac;

  __extends(CPShortcutItemView, _super);

  function CPShortcutItemView() {
    return CPShortcutItemView.__super__.constructor.apply(this, arguments);
  }

  Mac = navigator.userAgent.indexOf("Mac OS X") > -1;

  CPShortcutItemView.prototype.partial = function() {
    var sc, scs, shortcut, title, _i, _j, _len, _len1, _ref, _ref1, _ref2;
    _ref = this.getData(), title = _ref[0], shortcut = _ref[1];
    scs = "";
    _ref1 = shortcut.split(" ");
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      shortcut = _ref1[_i];
      scs += " ";
      _ref2 = shortcut.split("+");
      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
        sc = _ref2[_j];
        scs += "<cite>" + sc + "</cite>+";
      }
      scs = scs.replace(/\+$/, "");
    }
    if (!Mac) {
      scs = scs.replace(/\Cmd/, "super");
    }
    return "<h2>" + title + "</h2>\n<div class='shortcuts'>" + scs + "</div>";
  };

  return CPShortcutItemView;

})(KDListItemView);

module.exports = CoffeePadHeader = (function(_super) {
  var CoffeePadShortcuts;

  __extends(CoffeePadHeader, _super);

  CoffeePadShortcuts = [["Run", "Cmd+Enter"], ["Save", "Cmd+S"], ["Save As", "Cmd+Shift+S"], ["Show Help", "Ctrl+H"], ["Toggle File List", "Ctrl+O"], ["Select Next File", "Alt+Down"], ["Select Previous File", "Alt+Up"], ["Toggle Javascript editor", "Ctrl+J"], ["Autocomplete if possible", "Ctrl+Space"], ["Go Subword Left", "Alt+Left"], ["Go Subword Right", "Alt+Right"], ["Scroll Line Up", "Cmd+Up"], ["Scroll Line Down", "Cmd+Down"], ["Split Selection ByLine", "Shift+Cmd+L"], ["Indent Less", "Shift+Tab"], ["Single Selection Top", "Esc"], ["Select Line", "Cmd+L"], ["Delete Line", "Shift+Cmd+K"], ["Insert Line Before", "Shift+Cmd+Enter"], ["Select Next Occurrence", "Cmd+D"], ["Select Scope", "Shift+Cmd+Space"], ["Select Between Brackets", "Shift+Cmd+M"], ["Go To Bracket", "Cmd+M"], ["Swap Line Up", "Shift+Cmd+Up"], ["Swap Line Down", "Shift+Cmd+Down"], ["Toggle Comment", "Cmd+/"], ["Join Lines", "Cmd+J"], ["Duplicate Line", "Shift+Cmd+D"], ["Transpose Chars", "Cmd+T"], ["Sort Lines", "F9"], ["Sort Lines Insensitive", "Cmd+F9"], ["Next Bookmark", "F2"], ["Prev Bookmark", "Shift+F2"], ["Toggle Bookmark", "Cmd+F2"], ["Clear Bookmarks", "Shift+Cmd+F2"], ["Select Bookmarks", "Alt+F2"], ["Wrap Lines", "Alt+Q"], ["Select Lines Upward", "Shift+Alt+Up"], ["Select Lines Downward", "Shift+Alt+Down"], ["Find Under", "Cmd+F3"], ["Find Under Previous", "Shift+Cmd+F3"], ["Fold", "Shift+Cmd+["], ["Unfold", "Shift+Cmd+]"], ["Replace", "Cmd+H"], ["Del Line Left", "Ctrl+K Cmd+Backspace"], ["Del Line Right", "Ctrl+K Cmd+K"], ["Upcase At Cursor", "Ctrl+K Cmd+U"], ["Downcase At Cursor", "Ctrl+K Cmd+L"], ["Set Sublime Mark", "Ctrl+K Cmd+Space"], ["Select To SublimeMark", "Ctrl+K Cmd+A"], ["Delete To SublimeMark", "Ctrl+K Cmd+W"], ["Swap With SublimeMark", "Ctrl+K Cmd+X"], ["Sublime Yank", "Ctrl+K Cmd+Y"], ["Clear Bookmarks", "Ctrl+K Cmd+G"], ["Show In Center", "Ctrl+K Cmd+C"], ["Unfold All", "Ctrl+K Cmd+j"], ["Unfold All", "Ctrl+K Cmd+0"]];

  function CoffeePadHeader(options) {
    if (options == null) {
      options = {};
    }
    options.cssClass = 'cp-header';
    CoffeePadHeader.__super__.constructor.call(this, options);
  }

  CoffeePadHeader.prototype.viewAppended = function() {
    this.addSubView(new KDView({
      cssClass: 'header-logo',
      partial: "<img src='images/coffeepad-logo.png'/>"
    }));
    this.addSubView(new KDView({
      cssClass: 'readme',
      partial: "<p>CoffeePad is actually nothing more than putting some awesome pieces together.\nIt provides live compiling for CoffeeScript to JavaScript with hints.</p>\n\n<p>It's built with <a href=\"https://koding.com\">Koding</a>'s Framework\n<a href=\"https://github.com/koding/kd\">KD</a>, uses\n<a href=\"http://codemirror.net/\">CodeMirror</a> as editor and\n<a href=\"http://coffeescript.org\">CoffeeScript</a>'s browser compiler.</p>\n\n<p>It can be used as <a href=\"https://chrome.google.com/webstore/detail/coffeepad/iomhnnbecciohkiilfebodfghbnpoopf\">Chrome extension</a> or a standalone web app from <a href=\"http://coffeepad.rocks/\">coffeepad.rocks</a>.\nIt keeps everyting in <code>localStorage</code> even in Chrome extension, which means there is no server dependency. Everything happens in your browser.</p>\n\n<p>You can fork it from <a href=\"https://github.com/gokmen/coffeepad\">https://github.com/gokmen/coffeepad</a></p>"
    }));
    this.addSubView(this.filterView = new KDInputView({
      title: "Filter",
      placeholder: "filter shortcuts",
      keyup: (function(_this) {
        return function() {
          var res, val;
          val = _this.filterView.getValue().replace(/cmd/, "⌘");
          res = CoffeePadShortcuts.filter(function(item) {
            return ((item.join("")).toLowerCase().indexOf(val)) > -1;
          });
          return _this.shortcutController.replaceAllItems(res);
        };
      })(this)
    }));
    this.addSubView(new KDButtonView({
      title: "X",
      cssClass: "clean-gray close-help",
      callback: this.parent.bound('toggleHelpMode')
    }));
    this.shortcutController = new KDListViewController({
      viewOptions: {
        itemClass: CPShortcutItemView
      }
    });
    this.shortcutController.replaceAllItems(CoffeePadShortcuts);
    return this.addSubView(this.shortcutController.getView());
  };

  return CoffeePadHeader;

})(KDView);


},{}],3:[function(require,module,exports){
var CPFileItem, CPMultipleChoice, CoffeeEditor, CoffeeExamples, CoffeePad, CoffeePadHeader, JSEditor, SaveFileModal, Storage,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

CoffeeEditor = require('./coffeeeditor');

JSEditor = require('./jseditor');

Storage = require('./storage');

SaveFileModal = require('./savemodal');

CoffeePadHeader = require('./coffeepad-header');

CPFileItem = require('./fileitem');

CPMultipleChoice = require('./multiplechoice');

CoffeeExamples = require('./examples');

module.exports = CoffeePad = (function(_super) {
  __extends(CoffeePad, _super);

  CoffeePad.Compilers = {
    "Coffee2Js": "Coffee2Js",
    "Js2Coffee": "Js2Coffee"
  };

  function CoffeePad(options, data) {
    if (options == null) {
      options = {};
    }
    options.cssClass = "main-view";
    CoffeePad.__super__.constructor.call(this, options, data);
    this.storage = new Storage();
    this.header = new CoffeePadHeader({
      parent: this
    });
    this.header.appendToDomBody();
    this.loadExamples();
  }

  CoffeePad.prototype.loadExamples = function() {
    return this.storage.filter(/file\-/, (function(_this) {
      return function(files) {
        var example, _i, _len, _results;
        if (files.length > 0) {
          return;
        }
        _results = [];
        for (_i = 0, _len = CoffeeExamples.length; _i < _len; _i++) {
          example = CoffeeExamples[_i];
          _results.push(_this.storage.setValue("file-" + example.title, example.content));
        }
        return _results;
      };
    })(this));
  };

  CoffeePad.prototype.viewAppended = function() {
    this.coffeeEditor = new CoffeeEditor;
    this.jsEditor = new JSEditor;
    this.jsEditor.ready(this.bound('attachListeners'));
    this.fileList = new KDListViewController({
      selection: true,
      viewOptions: {
        cssClass: "file-list",
        wrapper: true,
        itemClass: CPFileItem
      }
    });
    this.fileListView = this.fileList.getListView();
    this.splitView = new KDSplitView({
      cssClass: "split-view js-hidden",
      resizable: true,
      sizes: ["50%", "50%"],
      views: [this.coffeeEditor, this.jsEditor]
    });
    this.multipleChoice = new CPMultipleChoice({
      labels: ['JavaScript', 'Js2Coffee', 'Files'],
      cssClass: 'options-button',
      defaultValue: [],
      multiple: true,
      callback: (function(_this) {
        return function() {
          var added, removed, _ref;
          _ref = _this.multipleChoice._lastOperation, added = _ref.added, removed = _ref.removed;
          if ('JavaScript' === added) {
            _this.storage.setValue('hideJs', false);
            _this.splitView.showPanel(1, function() {
              _this.jsEditor.cm.refresh();
              _this.jsEditor.cm.setOption("lineWrapping", true);
              return _this.splitView.unsetClass("js-hidden");
            });
            _this.splitView.options.sizes = ["50%", "50%"];
          } else if ('JavaScript' === removed) {
            _this.storage.setValue('hideJs', true);
            _this.jsEditor.cm.setOption("lineWrapping", false);
            _this.hideJsPane();
          }
          if ('Files' === added) {
            _this.setClass('in');
            _this.storage.setValue('hidePanel', false);
          } else if ("Files" === removed) {
            _this.unsetClass('in');
            _this.storage.setValue('hidePanel', true);
          }
          if ('Js2Coffee' === added) {
            _this.setCompiler(CoffeePad.Compilers.Js2Coffee);
            _this.storage.setValue('js2coffee', true);
            new KDNotificationView({
              title: "Coffee ⇠ Js selected"
            });
          } else if ("Js2Coffee" === removed) {
            _this.setCompiler();
            _this.storage.setValue('js2coffee', false);
            new KDNotificationView({
              title: "Coffee ⇢ Js selected"
            });
          }
          return KD.utils.defer(function() {
            return _this.coffeeEditor.cm.focus();
          });
        };
      })(this)
    });
    this.addSubView(this.multipleChoice);
    this.addSubView(this.splitView);
    this.addSubView(new KDButtonView({
      title: "+",
      cssClass: "clean-gray create-new",
      callback: (function(_this) {
        return function() {
          return _this.jsEditor.ready(function() {
            _this.coffeeEditor.handleSave(true);
            return new SaveFileModal(function(err, fileName) {
              fileName = "file-" + fileName;
              if (err) {
                return _this.coffeeEditor.cm.focus();
              } else {
                _this.coffeeEditor.cm.getDoc().clearHistory();
                _this.coffeeEditor.cm.setValue("");
                return _this.coffeeEditor.saveFile(fileName);
              }
            });
          });
        };
      })(this)
    }));
    this.addSubView(new KDButtonView({
      title: "?",
      cssClass: "clean-gray help",
      callback: this.bound('toggleHelpMode')
    }));
    this.addSubView(this.fileListView);
    return this.addSubView(new KDButtonView({
      title: "Run",
      cssClass: "clean-gray run-button",
      callback: this.bound('runJsCode')
    }));
  };

  CoffeePad.prototype.attachListeners = function() {
    KD.utils.defer((function(_this) {
      return function() {
        var hideJs, hidePanel, js2coffee, _ref;
        _ref = _this.storage.data, hideJs = _ref.hideJs, hidePanel = _ref.hidePanel, js2coffee = _ref.js2coffee;
        if (!hideJs || hideJs === "false") {
          _this.multipleChoice.setValue('JavaScript');
        } else {
          _this.hideJsPane();
        }
        if (!hidePanel || hidePanel === "false") {
          _this.multipleChoice.setValue('Files');
        }
        if (js2coffee === "true") {
          return _this.multipleChoice.setValue('Js2Coffee');
        }
      };
    })(this));
    this.fileListView.on('removeItem', (function(_this) {
      return function(item) {
        _this.coffeeEditor.fileName = null;
        _this.storage.unsetKey(item.data.name);
        return _this.updateFileList();
      };
    })(this));
    this.setCompiler(CoffeePad.Compilers.Coffee2Js, true);
    this.jsEditor.on("runCode", this.bound('runJsCode'));
    this.coffeeEditor.on("runCode", this.bound('runJsCode'));
    this.jsEditor.on("toggleFiles", (function(_this) {
      return function() {
        return _this.multipleChoice.setValue('Files');
      };
    })(this));
    this.coffeeEditor.on("toggleFiles", (function(_this) {
      return function() {
        return _this.multipleChoice.setValue('Files');
      };
    })(this));
    this.jsEditor.on("toggleJs", (function(_this) {
      return function() {
        return _this.multipleChoice.setValue('JavaScript');
      };
    })(this));
    this.coffeeEditor.on("toggleJs", (function(_this) {
      return function() {
        return _this.multipleChoice.setValue('JavaScript');
      };
    })(this));
    this.jsEditor.on("toggleHelper", this.bound('toggleHelpMode'));
    this.coffeeEditor.on("toggleHelper", this.bound('toggleHelpMode'));
    this.coffeeEditor.on("loadPreviousFile", this.lazyBound('loadFileAtDirection', -1));
    this.coffeeEditor.on("loadNextFile", this.lazyBound('loadFileAtDirection', 1));
    this.coffeeEditor.on("fileSaved", this.bound('updateFileList'));
    return this.storage.getValue("lastFile", (function(_this) {
      return function(file) {
        if (file != null) {
          _this.coffeeEditor.openFile(file);
        }
        _this.fileList.on('ItemSelectionPerformed', function() {
          var items, _arg;
          _arg = arguments[arguments.length - 1];
          items = _arg.items;
          if (_this.coffeeEditor.fileName != null) {
            _this.coffeeEditor.handleSave(true);
          }
          return _this.coffeeEditor.openFile(items.first.data.name);
        });
        return _this.updateFileList(file);
      };
    })(this));
  };

  CoffeePad.prototype.toggleHelpMode = function() {
    var body;
    body = $('body');
    if (body.hasClass('helpMode')) {
      body.removeClass('helpMode');
      return this.coffeeEditor.cm.focus();
    } else {
      body.addClass('helpMode');
      return this.header.filterView.setFocus();
    }
  };

  CoffeePad.prototype.loadFileAtDirection = function(direction) {
    var activeFile, i, item, items, nextIndex, _i, _len, _results;
    items = this.fileList.itemsOrdered;
    if (items.length < 2) {
      return;
    }
    if (!this.fileList.selectedItems) {
      return;
    }
    activeFile = this.fileList.selectedItems.first;
    _results = [];
    for (i = _i = 0, _len = items.length; _i < _len; i = ++_i) {
      item = items[i];
      if (item.data.name === activeFile.data.name) {
        nextIndex = i + direction;
        if (nextIndex < 0) {
          nextIndex = items.length - 1;
        } else if (nextIndex === items.length) {
          nextIndex = 0;
        }
        this.fileList.selectItem(items[nextIndex]);
        break;
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  CoffeePad.prototype.createNewFile = function() {
    var file;
    file = "file-Coffee-" + (new Date().format("d-mm HH:MM:ss"));
    this.coffeeEditor.cm.getDoc().clearHistory();
    this.coffeeEditor.cm.setValue("");
    this.coffeeEditor.saveFile(file);
    return file;
  };

  CoffeePad.prototype.updateFileList = function(newname) {
    var prevFile, _ref, _ref1;
    this.loadExamples();
    prevFile = newname != null ? newname : (_ref = this.fileList.first) != null ? (_ref1 = _ref.data) != null ? _ref1.name : void 0 : void 0;
    return this.storage.filter(/file\-/, (function(_this) {
      return function(files) {
        var item, _i, _len, _ref2, _results;
        _this.fileList.replaceAllItems(files);
        if (prevFile) {
          _ref2 = _this.fileList.itemsOrdered;
          _results = [];
          for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
            item = _ref2[_i];
            if (item.data.name === prevFile) {
              _results.push(_this.fileList.selectItem(item));
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        } else {
          return _this.fileList.selectItem(_this.fileList.itemsOrdered.last);
        }
      };
    })(this));
  };

  CoffeePad.prototype.runJsCode = function() {
    var codeToEval, inspectedWindow, _ref;
    codeToEval = this.jsEditor.cm.getValue();
    if ((typeof chrome !== "undefined" && chrome !== null ? (_ref = chrome.devtools) != null ? _ref.inspectedWindow : void 0 : void 0) != null) {
      inspectedWindow = chrome.devtools.inspectedWindow;
      return inspectedWindow["eval"](codeToEval, function(err, exception) {
        if (exception != null ? exception.isException : void 0) {
          return inspectedWindow["eval"]("console.error('" + exception.value + "');");
        }
      });
    } else {
      return eval(codeToEval);
    }
  };

  CoffeePad.prototype.hideJsPane = function() {
    this.splitView.hidePanel(1);
    this.splitView.setClass("js-hidden");
    return this.splitView.options.sizes = ["100%", "0%"];
  };

  CoffeePad.prototype.setCompiler = function(compiler, compile) {
    var source, target, _ref, _ref1;
    if (compiler == null) {
      compiler = CoffeePad.Compilers.Coffee2Js;
    }
    _ref = [this.coffeeEditor, this.jsEditor], source = _ref[0], target = _ref[1];
    if (compiler === CoffeePad.Compilers.Js2Coffee) {
      _ref1 = [target, source], source = _ref1[0], target = _ref1[1];
    }
    target.off("change");
    if (compile) {
      source.compile(target);
    }
    return source.on("change", function() {
      return source.compile(target);
    });
  };

  return CoffeePad;

})(KDView);


},{"./coffeeeditor":1,"./coffeepad-header":2,"./examples":5,"./fileitem":6,"./jseditor":7,"./multiplechoice":9,"./savemodal":10,"./storage":11}],4:[function(require,module,exports){
var CodeEditor, Storage,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Storage = require('./storage');

module.exports = CodeEditor = (function(_super) {
  __extends(CodeEditor, _super);

  function CodeEditor(options, data) {
    if (options == null) {
      options = {};
    }
    options.type = "textarea";
    if (options.logToConsole == null) {
      options.logToConsole = false;
    }
    options.defaultValue = data != null ? data.content : void 0;
    CodeEditor.__super__.constructor.call(this, options, data);
    this.storage = new Storage();
    this.on('viewAppended', (function(_this) {
      return function() {
        _this.cm = CodeMirror.fromTextArea(_this.getElement(), {
          lineNumbers: true,
          lineWrapping: true,
          styleActiveLine: true,
          scrollPastEnd: true,
          cursorHeight: 1,
          tabSize: 2,
          mode: options.mode,
          autoCloseBrackets: true,
          matchBrackets: true,
          showCursorWhenSelecting: true,
          theme: "tomorrow-night-eighties",
          keyMap: "sublime",
          gutters: ["CodeMirror-lint-markers", "CodeMirror-linenumbers", "CodeMirror-foldgutter"],
          foldGutter: true,
          lint: true,
          extraKeys: {
            "Cmd-S": function() {
              return _this.handleSave();
            },
            "Ctrl-S": function() {
              return _this.handleSave();
            },
            "Ctrl-H": function() {
              return _this.emit("toggleHelper");
            },
            "Shift-Cmd-S": function() {
              return _this.handleSaveAs();
            },
            "Shift-Ctrl-S": function() {
              return _this.handleSaveAs();
            },
            "Cmd-O": function() {
              return _this.emit("toggleFiles");
            },
            "Ctrl-O": function() {
              return _this.emit("toggleFiles");
            },
            "Ctrl-J": function() {
              return _this.emit("toggleJs");
            },
            "Tab": function(cm) {
              if (cm.somethingSelected()) {
                return cm.indentSelection("add");
              } else {
                return cm.execCommand("insertSoftTab");
              }
            },
            "Shift-Tab": function(cm) {
              return cm.indentSelection("subtract");
            },
            "Ctrl-Space": "autocomplete",
            "Cmd-Enter": function() {
              return _this.emit("runCode");
            },
            "Ctrl-Enter": function() {
              return _this.emit("runCode");
            },
            "Alt-Up": function() {
              return _this.emit("loadPreviousFile");
            },
            "Alt-Down": function() {
              return _this.emit("loadNextFile");
            }
          }
        });
        _this.cm.on("change", _this.lazyBound("emit", "change"));
        return _this.emit("ready");
      };
    })(this));
  }

  CodeEditor.prototype.compile = function(target) {
    return console.warn("Implement ::compile method!");
  };

  CodeEditor.prototype.handleSave = function() {
    return false;
  };

  CodeEditor.prototype.handleSaveAs = function() {
    return false;
  };

  return CodeEditor;

})(KDInputView);


},{"./storage":11}],5:[function(require,module,exports){
module.exports = [
  {
    title: "Overview",
    content: "# Assignment:\nnumber   = 42\nopposite = true\n\n# Conditions:\nnumber = -42 if opposite\n\n# Functions:\nsquare = (x) -> x * x\n\n# Arrays:\nlist = [1, 2, 3, 4, 5]\n\n# Objects:\nmath =\n  root:   Math.sqrt\n  square: square\n  cube:   (x) -> x * square x\n\n# Splats:\nrace = (winner, runners...) ->\n  print winner, runners\n\n# Existence:\nalert \"I knew it!\" if elvis?\n\n# Array comprehensions:\ncubes = (math.cube num for num in list)"
  }, {
    title: "Objects and Arrays",
    content: "song = [\"do\", \"re\", \"mi\", \"fa\", \"so\"]\n\nsingers = {Jagger: \"Rock\", Elvis: \"Roll\"}\n\nbitlist = [\n  1, 0, 1\n  0, 0, 1\n  1, 1, 0\n]\n\nkids =\n  brother:\n    name: \"Max\"\n    age:  11\n  sister:\n    name: \"Ida\"\n    age:  9"
  }, {
    title: "Splats",
    content: "gold = silver = rest = \"unknown\"\n\nawardMedals = (first, second, others...) ->\n  gold   = first\n  silver = second\n  rest   = others\n\ncontenders = [\n  \"Michael Phelps\"\n  \"Liu Xiang\"\n  \"Yao Ming\"\n  \"Allyson Felix\"\n  \"Shawn Johnson\"\n  \"Roman Sebrle\"\n  \"Guo Jingjing\"\n  \"Tyson Gay\"\n  \"Asafa Powell\"\n  \"Usain Bolt\"\n]\n\nawardMedals contenders...\n\nalert \"Gold: \" + gold\nalert \"Silver: \" + silver\nalert \"The Field: \" + rest"
  }, {
    title: "Loops and Comprehensions",
    content: "# Functions\neat = (food)->\n  console.log food\n\nmenu = (num, dish)->\n  console.info num, dish\n\n# Eat lunch.\neat food for food in ['toast', 'cheese', 'wine']\n\n# Fine five course dining.\ncourses = ['greens', 'caviar', 'truffles', 'roast', 'cake']\nmenu i + 1, dish for dish, i in courses\n\n# Health conscious meal.\nfoods = ['broccoli', 'spinach', 'chocolate']\neat food for food in foods when food isnt 'chocolate'"
  }
];


},{}],6:[function(require,module,exports){
var CPFileItem,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = CPFileItem = (function(_super) {
  __extends(CPFileItem, _super);

  function CPFileItem() {
    return CPFileItem.__super__.constructor.apply(this, arguments);
  }

  CPFileItem.prototype.viewAppended = function() {
    var name;
    name = this.getData().name;
    name = name.replace(/^file\-/, '');
    this.addSubView(new KDView({
      tagName: "h1",
      partial: name
    }));
    return this.addSubView(new KDButtonView({
      title: "X",
      cssClass: 'clean-red',
      callback: (function(_this) {
        return function() {
          var modal;
          return modal = new KDModalView({
            title: "Confirmation required...",
            content: "<div class='modalformline'>\n  <p>Do you want to remove this script ?</p>\n</div>",
            cssClass: "savefile-modal",
            width: 305,
            overlay: true,
            buttons: {
              Remove: {
                style: "kdbutton clean-gray",
                callback: function() {
                  _this.getDelegate().emit("removeItem", _this);
                  return modal.destroy();
                }
              },
              Cancel: {
                style: "kdbutton clean-gray",
                callback: function() {
                  return modal.destroy();
                }
              }
            }
          });
        };
      })(this)
    }));
  };

  return CPFileItem;

})(KDListItemView);


},{}],7:[function(require,module,exports){
var CodeEditor, JSEditor,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

CodeEditor = require('./editor');

module.exports = JSEditor = (function(_super) {
  __extends(JSEditor, _super);

  function JSEditor() {
    JSEditor.__super__.constructor.call(this, {
      mode: "javascript"
    });
  }

  JSEditor.prototype.compile = function(target) {
    var error;
    try {
      return target.cm.setValue(js2coffee.build(this.cm.getValue()));
    } catch (_error) {
      error = _error;
      if (this.getOption('logToConsole')) {
        return console.warn(error);
      }
    }
  };

  JSEditor.prototype.handleSave = function() {
    return false;
  };

  return JSEditor;

})(CodeEditor);


},{"./editor":4}],8:[function(require,module,exports){
(function() {
  var CoffeePad;
  CoffeePad = require('./coffeepad');
  return (new CoffeePad).appendToDomBody();
})();


},{"./coffeepad":3}],9:[function(require,module,exports){
var CPMultipleChoice,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

module.exports = CPMultipleChoice = (function(_super) {
  __extends(CPMultipleChoice, _super);

  function CPMultipleChoice() {
    return CPMultipleChoice.__super__.constructor.apply(this, arguments);
  }

  CPMultipleChoice.prototype.setValue = function(label, wCallback) {
    if (wCallback == null) {
      wCallback = true;
    }
    this._lastOperation = __indexOf.call(this.currentValue, label) >= 0 ? {
      removed: label
    } : {
      added: label
    };
    return CPMultipleChoice.__super__.setValue.apply(this, arguments);
  };

  return CPMultipleChoice;

})(KDMultipleChoice);


},{}],10:[function(require,module,exports){
var SaveFileModal,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = SaveFileModal = (function(_super) {
  __extends(SaveFileModal, _super);

  function SaveFileModal(callback) {
    var options;
    options = {
      title: "Enter a fancy name...",
      overlay: true,
      width: 305,
      height: "auto",
      cssClass: "savefile-modal",
      tabs: {
        navigable: true,
        forms: {
          saveForm: {
            callback: (function(_this) {
              return function() {
                callback(null, _this.modalTabs.forms.saveForm.inputs.fileName.getValue());
                return _this.destroy();
              };
            })(this),
            buttons: {
              Save: {
                title: "Save",
                cssClass: "clean-gray",
                type: "submit"
              }
            },
            fields: {
              fileName: {
                name: "fileName",
                placeholder: "File name",
                validate: {
                  rules: {
                    required: true
                  },
                  messages: {
                    required: "File name required!"
                  }
                }
              }
            }
          }
        }
      }
    };
    SaveFileModal.__super__.constructor.call(this, options);
    this.on('ModalCancelled', function() {
      return callback({
        cancel: true
      });
    });
  }

  SaveFileModal.prototype.viewAppended = function() {
    SaveFileModal.__super__.viewAppended.apply(this, arguments);
    this.modalTabs.forms.saveForm.inputs.fileName.setFocus();
    return $(window).on("keydown.modal", (function(_this) {
      return function(e) {
        if (e.which === 27) {
          return _this.cancel();
        }
      };
    })(this));
  };

  return SaveFileModal;

})(KDModalViewWithForms);


},{}],11:[function(require,module,exports){
var ChromeStorage, LocalStorage, Storage,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Storage = (function() {
  function Storage() {
    this.data = {};
  }

  Storage.prototype.setValue = function(key, value, callback) {
    var oldValue;
    oldValue = this.data[key];
    this.data[key] = value;
    if (typeof this.onChangeFn === "function") {
      this.onChangeFn(key, oldValue, value);
    }
    return typeof callback === "function" ? callback(null) : void 0;
  };

  Storage.prototype.getValue = function(key, callback) {
    return callback(this.data[key]);
  };

  Storage.prototype.getAll = function(callback) {
    return callback(this.data);
  };

  Storage.prototype.unsetKey = function(key) {
    return delete this.data[key];
  };

  Storage.prototype.onChange = function(onChangeFn) {
    this.onChangeFn = onChangeFn != null ? onChangeFn : function() {};
  };

  Storage.prototype.filter = function(reg, callback) {
    var key, result, _i, _len, _ref;
    result = [];
    _ref = Object.keys(this.data);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      key = _ref[_i];
      if (reg.test(key)) {
        result.push({
          name: key,
          value: this.data[key]
        });
      }
    }
    return callback(result);
  };

  return Storage;

})();

ChromeStorage = (function(_super) {
  __extends(ChromeStorage, _super);

  function ChromeStorage() {
    ChromeStorage.__super__.constructor.apply(this, arguments);
    chrome.storage.onChanged.addListener((function(_this) {
      return function(changes) {
        var change, key, _results;
        if (_this.onChangeFn == null) {
          return;
        }
        _results = [];
        for (key in changes) {
          change = changes[key];
          _results.push(_this.onChangeFn(key, change.oldValue, change.newValue));
        }
        return _results;
      };
    })(this));
  }

  ChromeStorage.prototype.setValue = function(key, value, callback) {
    var data;
    if (callback == null) {
      callback = function() {};
    }
    data = {};
    data[key] = value;
    return chrome.storage.sync.set(data, callback);
  };

  ChromeStorage.prototype.getValue = function(key, callback) {
    if (callback == null) {
      callback = function() {};
    }
    if (!key) {
      return callback(null);
    }
    return chrome.storage.sync.get(key, function(item) {
      return callback((item != null ? item[key] : void 0) || null);
    });
  };

  ChromeStorage.prototype.getAll = function(callback) {
    if (callback == null) {
      callback = function() {};
    }
    return chrome.storage.sync.get(null, callback);
  };

  return ChromeStorage;

})(Storage);

LocalStorage = (function(_super) {
  __extends(LocalStorage, _super);

  function LocalStorage() {
    var storageHandler;
    this.data = window.localStorage;
    storageHandler = (function(_this) {
      return function(event) {
        var key, newValue, oldValue;
        key = event.key, oldValue = event.oldValue, newValue = event.newValue;
        return typeof _this.onChangeFn === "function" ? _this.onChangeFn(key, oldValue, newValue) : void 0;
      };
    })(this);
    if (window.addEventListener != null) {
      window.addEventListener("storage", storageHandler, false);
    } else {
      window.attachEvent("onstorage", storageHandler);
    }
  }

  LocalStorage.prototype.setValue = function(key, value, callback) {
    this.data.setItem(key, value);
    return typeof callback === "function" ? callback(null) : void 0;
  };

  LocalStorage.prototype.unsetKey = function(key) {
    return this.data.removeItem(key);
  };

  return LocalStorage;

})(Storage);

if (window.localStorage != null) {
  module.exports = LocalStorage;
} else {
  module.exports = Storage;
}


},{}]},{},[8])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvZ29rbWVuL0NvZGUvY29mZmVlcGFkL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvZ29rbWVuL0NvZGUvY29mZmVlcGFkL3NyYy9jb2ZmZWVlZGl0b3IuY29mZmVlIiwiL1VzZXJzL2dva21lbi9Db2RlL2NvZmZlZXBhZC9zcmMvY29mZmVlcGFkLWhlYWRlci5jb2ZmZWUiLCIvVXNlcnMvZ29rbWVuL0NvZGUvY29mZmVlcGFkL3NyYy9jb2ZmZWVwYWQuY29mZmVlIiwiL1VzZXJzL2dva21lbi9Db2RlL2NvZmZlZXBhZC9zcmMvZWRpdG9yLmNvZmZlZSIsIi9Vc2Vycy9nb2ttZW4vQ29kZS9jb2ZmZWVwYWQvc3JjL2V4YW1wbGVzLmNvZmZlZSIsIi9Vc2Vycy9nb2ttZW4vQ29kZS9jb2ZmZWVwYWQvc3JjL2ZpbGVpdGVtLmNvZmZlZSIsIi9Vc2Vycy9nb2ttZW4vQ29kZS9jb2ZmZWVwYWQvc3JjL2pzZWRpdG9yLmNvZmZlZSIsIi9Vc2Vycy9nb2ttZW4vQ29kZS9jb2ZmZWVwYWQvc3JjL21haW4uY29mZmVlIiwiL1VzZXJzL2dva21lbi9Db2RlL2NvZmZlZXBhZC9zcmMvbXVsdGlwbGVjaG9pY2UuY29mZmVlIiwiL1VzZXJzL2dva21lbi9Db2RlL2NvZmZlZXBhZC9zcmMvc2F2ZW1vZGFsLmNvZmZlZSIsIi9Vc2Vycy9nb2ttZW4vQ29kZS9jb2ZmZWVwYWQvc3JjL3N0b3JhZ2UuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQ0EsSUFBQSx1Q0FBQTtFQUFBO2lTQUFBOztBQUFBLFVBQUEsR0FBaUIsT0FBQSxDQUFRLFVBQVIsQ0FBakIsQ0FBQTs7QUFBQSxhQUNBLEdBQWlCLE9BQUEsQ0FBUSxhQUFSLENBRGpCLENBQUE7O0FBQUEsTUFHTSxDQUFDLE9BQVAsR0FBdUI7QUFFckIsaUNBQUEsQ0FBQTs7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QUFpQixZQUFqQixDQURMO0NBQUEsTUFBQTtBQUVLLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsT0FBakIsQ0FGTDtDQXJGQSIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXG5Db2RlRWRpdG9yICAgICA9IHJlcXVpcmUgJy4vZWRpdG9yJ1xuU2F2ZUZpbGVNb2RhbCAgPSByZXF1aXJlICcuL3NhdmVtb2RhbCdcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBDb2ZmZWVFZGl0b3IgZXh0ZW5kcyBDb2RlRWRpdG9yXG5cbiAgY29uc3RydWN0b3I6LT5cbiAgICBzdXBlciBtb2RlIDogXCJjb2ZmZWVzY3JpcHRcIlxuICAgIEBoaXN0b3JpZXMgPSB7fVxuXG4gICAgQG9uY2UgJ3ZpZXdBcHBlbmRlZCcsID0+XG5cbiAgICAgICQod2luZG93KS5vbiBcImtleWRvd25cIiwgKGUpPT5cblxuICAgICAgICBpZiBlLndoaWNoIGlzIDI3XG4gICAgICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzICdoZWxwTW9kZSdcbiAgICAgICAgICBAY20uZm9jdXMoKVxuXG4gIG9wZW5GaWxlOihmaWxlKS0+IEByZWFkeSA9PlxuXG4gICAgcmV0dXJuIHVubGVzcyBmaWxlXG5cbiAgICBAaGlzdG9yaWVzW0BmaWxlTmFtZV0gPSBAY20uZ2V0RG9jKCkuZ2V0SGlzdG9yeSgpXG5cbiAgICBAc3RvcmFnZS5nZXRWYWx1ZSBmaWxlLCAoY29udGVudCA9IFwiXCIpPT5cblxuICAgICAgQGNtLmdldERvYygpLmNsZWFySGlzdG9yeSgpXG4gICAgICBAY20uc2V0VmFsdWUgY29udGVudFxuXG4gICAgICBpZiBAaGlzdG9yaWVzW2ZpbGVdP1xuICAgICAgICBAY20uZ2V0RG9jKCkuc2V0SGlzdG9yeSBAaGlzdG9yaWVzW2ZpbGVdXG5cbiAgICAgIEBmaWxlTmFtZSA9IGZpbGVcbiAgICAgIEBzdG9yYWdlLnNldFZhbHVlIFwibGFzdEZpbGVcIiwgZmlsZVxuXG4gICAgICBAY20uZm9jdXMoKVxuXG4gIGNvbXBpbGU6KHRhcmdldCktPlxuXG4gICAgdHJ5XG4gICAgICB0YXJnZXQuY20uc2V0VmFsdWUgQ29mZmVlU2NyaXB0LmNvbXBpbGUgQGNtLmdldFZhbHVlKCksIGJhcmU6IHllc1xuICAgIGNhdGNoIGVycm9yXG4gICAgICBjb25zb2xlLndhcm4gZXJyb3IgIGlmIEBnZXRPcHRpb24gJ2xvZ1RvQ29uc29sZSdcblxuICBzYXZlRmlsZTogKGZpbGVOYW1lLCBzaWxlbmNlID0gbm8pLT5cblxuICAgIEBzdG9yYWdlLnNldFZhbHVlIGZpbGVOYW1lLCBAY20uZ2V0VmFsdWUoKSwgPT5cblxuICAgICAgQHN0b3JhZ2Uuc2V0VmFsdWUgXCJsYXN0RmlsZVwiLCBmaWxlTmFtZVxuICAgICAgQGZpbGVOYW1lID0gZmlsZU5hbWVcblxuICAgICAgdW5sZXNzIHNpbGVuY2VcblxuICAgICAgICBuYW1lID0gQGZpbGVOYW1lLnJlcGxhY2UgL15maWxlXFwtLywgJydcblxuICAgICAgICBuZXcgS0ROb3RpZmljYXRpb25WaWV3XG4gICAgICAgICAgdGl0bGUgOiBcInNhdmVkIHRvICN7bmFtZX0uLi5cIlxuICAgICAgICAgIHR5cGUgIDogXCJ0cmF5XCJcblxuICAgICAgICBAZW1pdCBcImZpbGVTYXZlZFwiLCBAZmlsZU5hbWVcblxuICAgICAgQGNtLmZvY3VzKClcblxuICBoYW5kbGVTYXZlQXM6KHNpbGVuY2UgPSBubyktPlxuXG4gICAgbmV3IFNhdmVGaWxlTW9kYWwgKGVyciwgZmlsZU5hbWUpPT5cbiAgICAgIGZpbGVOYW1lID0gXCJmaWxlLSN7ZmlsZU5hbWV9XCJcbiAgICAgIGlmIGVyciB0aGVuIEBjbS5mb2N1cygpIGVsc2UgQHNhdmVGaWxlIGZpbGVOYW1lLCBzaWxlbmNlXG5cbiAgaGFuZGxlU2F2ZTooc2lsZW5jZSA9IG5vKS0+XG5cbiAgICB1bmxlc3MgQGZpbGVOYW1lXG4gICAgICBAaGFuZGxlU2F2ZUFzIHNpbGVuY2VcbiAgICBlbHNlXG4gICAgICBAc2F2ZUZpbGUgQGZpbGVOYW1lLCBzaWxlbmNlXG4iLCJcbmNsYXNzIENQU2hvcnRjdXRJdGVtVmlldyBleHRlbmRzIEtETGlzdEl0ZW1WaWV3XG5cbiAgTWFjID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwiTWFjIE9TIFhcIikgPiAtMVxuXG4gIHBhcnRpYWwgOi0+XG5cbiAgICBbdGl0bGUsIHNob3J0Y3V0XSA9IEBnZXREYXRhKClcblxuICAgIHNjcyAgPSBcIlwiXG4gICAgZm9yIHNob3J0Y3V0IGluIHNob3J0Y3V0LnNwbGl0IFwiIFwiXG4gICAgICBzY3MgKz0gXCIgXCJcbiAgICAgIHNjcyArPSBcIjxjaXRlPiN7c2N9PC9jaXRlPitcIiBmb3Igc2MgaW4gc2hvcnRjdXQuc3BsaXQoXCIrXCIpXG4gICAgICBzY3MgID0gc2NzLnJlcGxhY2UgL1xcKyQvLCBcIlwiXG5cbiAgICB1bmxlc3MgTWFjXG4gICAgICBzY3MgID0gc2NzLnJlcGxhY2UgL1xcQ21kLywgXCJzdXBlclwiXG5cbiAgICBcIlwiXCI8aDI+I3t0aXRsZX08L2gyPlxuICAgICAgIDxkaXYgY2xhc3M9J3Nob3J0Y3V0cyc+I3tzY3N9PC9kaXY+XCJcIlwiXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgQ29mZmVlUGFkSGVhZGVyIGV4dGVuZHMgS0RWaWV3XG5cbiAgQ29mZmVlUGFkU2hvcnRjdXRzID0gW1xuICAgIFtcIlJ1blwiICAgICAgICAgICAgICAgICAgICAgICwgXCJDbWQrRW50ZXJcIl1cbiAgICBbXCJTYXZlXCIgICAgICAgICAgICAgICAgICAgICAsIFwiQ21kK1NcIl1cbiAgICBbXCJTYXZlIEFzXCIgICAgICAgICAgICAgICAgICAsIFwiQ21kK1NoaWZ0K1NcIl1cbiAgICBbXCJTaG93IEhlbHBcIiAgICAgICAgICAgICAgICAsIFwiQ3RybCtIXCJdXG4gICAgW1wiVG9nZ2xlIEZpbGUgTGlzdFwiICAgICAgICAgLCBcIkN0cmwrT1wiXVxuXG4gICAgW1wiU2VsZWN0IE5leHQgRmlsZVwiICAgICAgICAgLCBcIkFsdCtEb3duXCJdXG4gICAgW1wiU2VsZWN0IFByZXZpb3VzIEZpbGVcIiAgICAgLCBcIkFsdCtVcFwiXVxuXG4gICAgW1wiVG9nZ2xlIEphdmFzY3JpcHQgZWRpdG9yXCIgLCBcIkN0cmwrSlwiXVxuICAgIFtcIkF1dG9jb21wbGV0ZSBpZiBwb3NzaWJsZVwiICwgXCJDdHJsK1NwYWNlXCJdXG4gICAgW1wiR28gU3Vid29yZCBMZWZ0XCIgICAgICAgICAgLCBcIkFsdCtMZWZ0XCJdXG4gICAgW1wiR28gU3Vid29yZCBSaWdodFwiICAgICAgICAgLCBcIkFsdCtSaWdodFwiXVxuICAgIFtcIlNjcm9sbCBMaW5lIFVwXCIgICAgICAgICAgICwgXCJDbWQrVXBcIl1cbiAgICBbXCJTY3JvbGwgTGluZSBEb3duXCIgICAgICAgICAsIFwiQ21kK0Rvd25cIl1cbiAgICBbXCJTcGxpdCBTZWxlY3Rpb24gQnlMaW5lXCIgICAsIFwiU2hpZnQrQ21kK0xcIl1cbiAgICBbXCJJbmRlbnQgTGVzc1wiICAgICAgICAgICAgICAsIFwiU2hpZnQrVGFiXCJdXG4gICAgW1wiU2luZ2xlIFNlbGVjdGlvbiBUb3BcIiAgICAgLCBcIkVzY1wiXVxuICAgIFtcIlNlbGVjdCBMaW5lXCIgICAgICAgICAgICAgICwgXCJDbWQrTFwiXVxuICAgIFtcIkRlbGV0ZSBMaW5lXCIgICAgICAgICAgICAgICwgXCJTaGlmdCtDbWQrS1wiXVxuICAgICMgW1wiSW5zZXJ0IExpbmUgQWZ0ZXJcIiAgICAgICAgLCBcIkNtZCtFbnRlclwiXVxuICAgIFtcIkluc2VydCBMaW5lIEJlZm9yZVwiICAgICAgICwgXCJTaGlmdCtDbWQrRW50ZXJcIl1cbiAgICBbXCJTZWxlY3QgTmV4dCBPY2N1cnJlbmNlXCIgICAsIFwiQ21kK0RcIl1cbiAgICBbXCJTZWxlY3QgU2NvcGVcIiAgICAgICAgICAgICAsIFwiU2hpZnQrQ21kK1NwYWNlXCJdXG4gICAgW1wiU2VsZWN0IEJldHdlZW4gQnJhY2tldHNcIiAgLCBcIlNoaWZ0K0NtZCtNXCJdXG4gICAgW1wiR28gVG8gQnJhY2tldFwiICAgICAgICAgICAgLCBcIkNtZCtNXCJdXG4gICAgW1wiU3dhcCBMaW5lIFVwXCIgICAgICAgICAgICAgLCBcIlNoaWZ0K0NtZCtVcFwiXVxuICAgIFtcIlN3YXAgTGluZSBEb3duXCIgICAgICAgICAgICwgXCJTaGlmdCtDbWQrRG93blwiXVxuICAgIFtcIlRvZ2dsZSBDb21tZW50XCIgICAgICAgICAgICwgXCJDbWQrL1wiXVxuICAgIFtcIkpvaW4gTGluZXNcIiAgICAgICAgICAgICAgICwgXCJDbWQrSlwiXVxuICAgIFtcIkR1cGxpY2F0ZSBMaW5lXCIgICAgICAgICAgICwgXCJTaGlmdCtDbWQrRFwiXVxuICAgIFtcIlRyYW5zcG9zZSBDaGFyc1wiICAgICAgICAgICwgXCJDbWQrVFwiXVxuICAgIFtcIlNvcnQgTGluZXNcIiAgICAgICAgICAgICAgICwgXCJGOVwiXVxuICAgIFtcIlNvcnQgTGluZXMgSW5zZW5zaXRpdmVcIiAgICwgXCJDbWQrRjlcIl1cbiAgICBbXCJOZXh0IEJvb2ttYXJrXCIgICAgICAgICAgICAsIFwiRjJcIl1cbiAgICBbXCJQcmV2IEJvb2ttYXJrXCIgICAgICAgICAgICAsIFwiU2hpZnQrRjJcIl1cbiAgICBbXCJUb2dnbGUgQm9va21hcmtcIiAgICAgICAgICAsIFwiQ21kK0YyXCJdXG4gICAgW1wiQ2xlYXIgQm9va21hcmtzXCIgICAgICAgICAgLCBcIlNoaWZ0K0NtZCtGMlwiXVxuICAgIFtcIlNlbGVjdCBCb29rbWFya3NcIiAgICAgICAgICwgXCJBbHQrRjJcIl1cbiAgICBbXCJXcmFwIExpbmVzXCIgICAgICAgICAgICAgICAsIFwiQWx0K1FcIl1cbiAgICBbXCJTZWxlY3QgTGluZXMgVXB3YXJkXCIgICAgICAsIFwiU2hpZnQrQWx0K1VwXCJdXG4gICAgW1wiU2VsZWN0IExpbmVzIERvd253YXJkXCIgICAgLCBcIlNoaWZ0K0FsdCtEb3duXCJdXG4gICAgW1wiRmluZCBVbmRlclwiICAgICAgICAgICAgICAgLCBcIkNtZCtGM1wiXVxuICAgIFtcIkZpbmQgVW5kZXIgUHJldmlvdXNcIiAgICAgICwgXCJTaGlmdCtDbWQrRjNcIl1cbiAgICBbXCJGb2xkXCIgICAgICAgICAgICAgICAgICAgICAsIFwiU2hpZnQrQ21kK1tcIl1cbiAgICBbXCJVbmZvbGRcIiAgICAgICAgICAgICAgICAgICAsIFwiU2hpZnQrQ21kK11cIl1cbiAgICBbXCJSZXBsYWNlXCIgICAgICAgICAgICAgICAgICAsIFwiQ21kK0hcIl1cbiAgICBbXCJEZWwgTGluZSBMZWZ0XCIgICAgICAgICAgICAsIFwiQ3RybCtLIENtZCtCYWNrc3BhY2VcIl1cbiAgICBbXCJEZWwgTGluZSBSaWdodFwiICAgICAgICAgICAsIFwiQ3RybCtLIENtZCtLXCJdXG4gICAgW1wiVXBjYXNlIEF0IEN1cnNvclwiICAgICAgICAgLCBcIkN0cmwrSyBDbWQrVVwiXVxuICAgIFtcIkRvd25jYXNlIEF0IEN1cnNvclwiICAgICAgICwgXCJDdHJsK0sgQ21kK0xcIl1cbiAgICBbXCJTZXQgU3VibGltZSBNYXJrXCIgICAgICAgICAsIFwiQ3RybCtLIENtZCtTcGFjZVwiXVxuICAgIFtcIlNlbGVjdCBUbyBTdWJsaW1lTWFya1wiICAgICwgXCJDdHJsK0sgQ21kK0FcIl1cbiAgICBbXCJEZWxldGUgVG8gU3VibGltZU1hcmtcIiAgICAsIFwiQ3RybCtLIENtZCtXXCJdXG4gICAgW1wiU3dhcCBXaXRoIFN1YmxpbWVNYXJrXCIgICAgLCBcIkN0cmwrSyBDbWQrWFwiXVxuICAgIFtcIlN1YmxpbWUgWWFua1wiICAgICAgICAgICAgICwgXCJDdHJsK0sgQ21kK1lcIl1cbiAgICBbXCJDbGVhciBCb29rbWFya3NcIiAgICAgICAgICAsIFwiQ3RybCtLIENtZCtHXCJdXG4gICAgW1wiU2hvdyBJbiBDZW50ZXJcIiAgICAgICAgICAgLCBcIkN0cmwrSyBDbWQrQ1wiXVxuICAgIFtcIlVuZm9sZCBBbGxcIiAgICAgICAgICAgICAgICwgXCJDdHJsK0sgQ21kK2pcIl1cbiAgICBbXCJVbmZvbGQgQWxsXCIgICAgICAgICAgICAgICAsIFwiQ3RybCtLIENtZCswXCJdXG4gIF1cblxuICBjb25zdHJ1Y3Rvcjoob3B0aW9ucyA9IHt9KS0+XG4gICAgb3B0aW9ucy5jc3NDbGFzcyA9ICdjcC1oZWFkZXInXG4gICAgc3VwZXIgb3B0aW9uc1xuXG4gIHZpZXdBcHBlbmRlZDogLT5cblxuICAgIEBhZGRTdWJWaWV3IG5ldyBLRFZpZXdcbiAgICAgIGNzc0NsYXNzIDogJ2hlYWRlci1sb2dvJ1xuICAgICAgcGFydGlhbCAgOiBcIjxpbWcgc3JjPSdpbWFnZXMvY29mZmVlcGFkLWxvZ28ucG5nJy8+XCJcblxuICAgIEBhZGRTdWJWaWV3IG5ldyBLRFZpZXdcbiAgICAgIGNzc0NsYXNzIDogJ3JlYWRtZSdcbiAgICAgIHBhcnRpYWwgIDogXCJcIlwiXG4gICAgICAgIDxwPkNvZmZlZVBhZCBpcyBhY3R1YWxseSBub3RoaW5nIG1vcmUgdGhhbiBwdXR0aW5nIHNvbWUgYXdlc29tZSBwaWVjZXMgdG9nZXRoZXIuXG4gICAgICAgIEl0IHByb3ZpZGVzIGxpdmUgY29tcGlsaW5nIGZvciBDb2ZmZWVTY3JpcHQgdG8gSmF2YVNjcmlwdCB3aXRoIGhpbnRzLjwvcD5cblxuICAgICAgICA8cD5JdCdzIGJ1aWx0IHdpdGggPGEgaHJlZj1cImh0dHBzOi8va29kaW5nLmNvbVwiPktvZGluZzwvYT4ncyBGcmFtZXdvcmtcbiAgICAgICAgPGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9rb2Rpbmcva2RcIj5LRDwvYT4sIHVzZXNcbiAgICAgICAgPGEgaHJlZj1cImh0dHA6Ly9jb2RlbWlycm9yLm5ldC9cIj5Db2RlTWlycm9yPC9hPiBhcyBlZGl0b3IgYW5kXG4gICAgICAgIDxhIGhyZWY9XCJodHRwOi8vY29mZmVlc2NyaXB0Lm9yZ1wiPkNvZmZlZVNjcmlwdDwvYT4ncyBicm93c2VyIGNvbXBpbGVyLjwvcD5cblxuICAgICAgICA8cD5JdCBjYW4gYmUgdXNlZCBhcyA8YSBocmVmPVwiaHR0cHM6Ly9jaHJvbWUuZ29vZ2xlLmNvbS93ZWJzdG9yZS9kZXRhaWwvY29mZmVlcGFkL2lvbWhubmJlY2Npb2hraWlsZmVib2RmZ2hibnBvb3BmXCI+Q2hyb21lIGV4dGVuc2lvbjwvYT4gb3IgYSBzdGFuZGFsb25lIHdlYiBhcHAgZnJvbSA8YSBocmVmPVwiaHR0cDovL2NvZmZlZXBhZC5jby9cIj5jb2ZmZWVwYWQuY288L2E+LlxuICAgICAgICBJdCBrZWVwcyBldmVyeXRpbmcgaW4gPGNvZGU+bG9jYWxTdG9yYWdlPC9jb2RlPiBldmVuIGluIENocm9tZSBleHRlbnNpb24sIHdoaWNoIG1lYW5zIHRoZXJlIGlzIG5vIHNlcnZlciBkZXBlbmRlbmN5LiBFdmVyeXRoaW5nIGhhcHBlbnMgaW4geW91ciBicm93c2VyLjwvcD5cblxuICAgICAgICA8cD5Zb3UgY2FuIGZvcmsgaXQgZnJvbSA8YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL2dva21lbi9jb2ZmZWVwYWRcIj5odHRwczovL2dpdGh1Yi5jb20vZ29rbWVuL2NvZmZlZXBhZDwvYT48L3A+XG4gICAgICBcIlwiXCJcblxuICAgIEBhZGRTdWJWaWV3IEBmaWx0ZXJWaWV3ID0gbmV3IEtESW5wdXRWaWV3XG4gICAgICB0aXRsZSAgICAgICA6IFwiRmlsdGVyXCJcbiAgICAgIHBsYWNlaG9sZGVyIDogXCJmaWx0ZXIgc2hvcnRjdXRzXCJcblxuICAgICAga2V5dXAgICAgICAgOiA9PlxuXG4gICAgICAgIHZhbCA9IEBmaWx0ZXJWaWV3LmdldFZhbHVlKCkucmVwbGFjZSAvY21kLywgXCLijJhcIlxuICAgICAgICByZXMgPSBDb2ZmZWVQYWRTaG9ydGN1dHMuZmlsdGVyIChpdGVtKS0+XG4gICAgICAgICAgKChpdGVtLmpvaW4gXCJcIikudG9Mb3dlckNhc2UoKS5pbmRleE9mIHZhbCkgPiAtMVxuXG4gICAgICAgIEBzaG9ydGN1dENvbnRyb2xsZXIucmVwbGFjZUFsbEl0ZW1zIHJlc1xuXG4gICAgQGFkZFN1YlZpZXcgbmV3IEtEQnV0dG9uVmlld1xuICAgICAgdGl0bGUgICAgOiBcIlhcIlxuICAgICAgY3NzQ2xhc3MgOiBcImNsZWFuLWdyYXkgY2xvc2UtaGVscFwiXG4gICAgICBjYWxsYmFjayA6IEBwYXJlbnQuYm91bmQgJ3RvZ2dsZUhlbHBNb2RlJ1xuXG4gICAgQHNob3J0Y3V0Q29udHJvbGxlciA9IG5ldyBLRExpc3RWaWV3Q29udHJvbGxlclxuICAgICAgdmlld09wdGlvbnMgIDpcbiAgICAgICAgaXRlbUNsYXNzICA6IENQU2hvcnRjdXRJdGVtVmlld1xuXG4gICAgQHNob3J0Y3V0Q29udHJvbGxlci5yZXBsYWNlQWxsSXRlbXMgQ29mZmVlUGFkU2hvcnRjdXRzXG5cbiAgICBAYWRkU3ViVmlldyBAc2hvcnRjdXRDb250cm9sbGVyLmdldFZpZXcoKVxuIiwiXG5Db2ZmZWVFZGl0b3IgICAgID0gcmVxdWlyZSAnLi9jb2ZmZWVlZGl0b3InXG5KU0VkaXRvciAgICAgICAgID0gcmVxdWlyZSAnLi9qc2VkaXRvcidcblN0b3JhZ2UgICAgICAgICAgPSByZXF1aXJlICcuL3N0b3JhZ2UnXG5TYXZlRmlsZU1vZGFsICAgID0gcmVxdWlyZSAnLi9zYXZlbW9kYWwnXG5Db2ZmZWVQYWRIZWFkZXIgID0gcmVxdWlyZSAnLi9jb2ZmZWVwYWQtaGVhZGVyJ1xuQ1BGaWxlSXRlbSAgICAgICA9IHJlcXVpcmUgJy4vZmlsZWl0ZW0nXG5DUE11bHRpcGxlQ2hvaWNlID0gcmVxdWlyZSAnLi9tdWx0aXBsZWNob2ljZSdcbkNvZmZlZUV4YW1wbGVzICAgPSByZXF1aXJlICcuL2V4YW1wbGVzJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIENvZmZlZVBhZCBleHRlbmRzIEtEVmlld1xuXG4gIEBDb21waWxlcnMgPSB7IFwiQ29mZmVlMkpzXCIsIFwiSnMyQ29mZmVlXCIgfVxuXG4gIGNvbnN0cnVjdG9yOihvcHRpb25zID0ge30sIGRhdGEpLT5cblxuICAgIG9wdGlvbnMuY3NzQ2xhc3MgPSBcIm1haW4tdmlld1wiXG4gICAgc3VwZXIgb3B0aW9ucywgZGF0YVxuXG4gICAgQHN0b3JhZ2UgPSBuZXcgU3RvcmFnZSgpXG5cbiAgICBAaGVhZGVyICA9IG5ldyBDb2ZmZWVQYWRIZWFkZXIgcGFyZW50OiB0aGlzXG4gICAgQGhlYWRlci5hcHBlbmRUb0RvbUJvZHkoKVxuXG4gICAgQGxvYWRFeGFtcGxlcygpXG5cbiAgbG9hZEV4YW1wbGVzOi0+XG5cbiAgICBAc3RvcmFnZS5maWx0ZXIgL2ZpbGVcXC0vLCAoZmlsZXMpPT5cbiAgICAgIHJldHVybiBpZiBmaWxlcy5sZW5ndGggPiAwXG4gICAgICBmb3IgZXhhbXBsZSBpbiBDb2ZmZWVFeGFtcGxlc1xuICAgICAgICBAc3RvcmFnZS5zZXRWYWx1ZSBcImZpbGUtI3tleGFtcGxlLnRpdGxlfVwiLCBleGFtcGxlLmNvbnRlbnRcblxuICB2aWV3QXBwZW5kZWQ6LT5cblxuICAgIEBjb2ZmZWVFZGl0b3IgID0gbmV3IENvZmZlZUVkaXRvclxuXG4gICAgQGpzRWRpdG9yICAgICAgPSBuZXcgSlNFZGl0b3JcbiAgICBAanNFZGl0b3IucmVhZHkgQGJvdW5kICdhdHRhY2hMaXN0ZW5lcnMnXG5cbiAgICBAZmlsZUxpc3QgPSBuZXcgS0RMaXN0Vmlld0NvbnRyb2xsZXJcbiAgICAgIHNlbGVjdGlvbiAgICA6IHllc1xuICAgICAgdmlld09wdGlvbnMgIDpcbiAgICAgICAgY3NzQ2xhc3MgICA6IFwiZmlsZS1saXN0XCJcbiAgICAgICAgd3JhcHBlciAgICA6IHllc1xuICAgICAgICBpdGVtQ2xhc3MgIDogQ1BGaWxlSXRlbVxuXG4gICAgQGZpbGVMaXN0VmlldyA9IEBmaWxlTGlzdC5nZXRMaXN0VmlldygpXG5cbiAgICBAc3BsaXRWaWV3ICAgICA9IG5ldyBLRFNwbGl0Vmlld1xuICAgICAgY3NzQ2xhc3MgICAgIDogXCJzcGxpdC12aWV3IGpzLWhpZGRlblwiXG4gICAgICByZXNpemFibGUgICAgOiB5ZXNcbiAgICAgIHNpemVzICAgICAgICA6IFsgXCI1MCVcIiwgXCI1MCVcIiBdXG4gICAgICB2aWV3cyAgICAgICAgOiBbIEBjb2ZmZWVFZGl0b3IsIEBqc0VkaXRvciBdXG5cbiAgICBAbXVsdGlwbGVDaG9pY2UgPSBuZXcgQ1BNdWx0aXBsZUNob2ljZVxuICAgICAgbGFiZWxzICAgICAgIDogWydKYXZhU2NyaXB0JywgJ0pzMkNvZmZlZScsICdGaWxlcyddXG4gICAgICBjc3NDbGFzcyAgICAgOiAnb3B0aW9ucy1idXR0b24nXG4gICAgICBkZWZhdWx0VmFsdWUgOiBbXVxuICAgICAgbXVsdGlwbGUgICAgIDogeWVzXG4gICAgICBjYWxsYmFjayAgICAgOiA9PlxuXG4gICAgICAgIHthZGRlZCwgcmVtb3ZlZH0gPSBAbXVsdGlwbGVDaG9pY2UuX2xhc3RPcGVyYXRpb25cblxuICAgICAgICBpZiAnSmF2YVNjcmlwdCcgaXMgYWRkZWRcbiAgICAgICAgICBAc3RvcmFnZS5zZXRWYWx1ZSAnaGlkZUpzJywgbm9cbiAgICAgICAgICBAc3BsaXRWaWV3LnNob3dQYW5lbCAxLCA9PlxuICAgICAgICAgICAgQGpzRWRpdG9yLmNtLnJlZnJlc2goKVxuICAgICAgICAgICAgQGpzRWRpdG9yLmNtLnNldE9wdGlvbiBcImxpbmVXcmFwcGluZ1wiLCB5ZXNcbiAgICAgICAgICAgIEBzcGxpdFZpZXcudW5zZXRDbGFzcyBcImpzLWhpZGRlblwiXG4gICAgICAgICAgQHNwbGl0Vmlldy5vcHRpb25zLnNpemVzID0gW1wiNTAlXCIsIFwiNTAlXCJdXG5cbiAgICAgICAgZWxzZSBpZiAnSmF2YVNjcmlwdCcgaXMgcmVtb3ZlZFxuICAgICAgICAgIEBzdG9yYWdlLnNldFZhbHVlICdoaWRlSnMnLCB5ZXNcbiAgICAgICAgICBAanNFZGl0b3IuY20uc2V0T3B0aW9uIFwibGluZVdyYXBwaW5nXCIsIG5vXG4gICAgICAgICAgQGhpZGVKc1BhbmUoKVxuXG4gICAgICAgIGlmICdGaWxlcycgaXMgYWRkZWRcbiAgICAgICAgICBAc2V0Q2xhc3MgJ2luJ1xuICAgICAgICAgIEBzdG9yYWdlLnNldFZhbHVlICdoaWRlUGFuZWwnLCBub1xuXG4gICAgICAgIGVsc2UgaWYgXCJGaWxlc1wiIGlzIHJlbW92ZWRcbiAgICAgICAgICBAdW5zZXRDbGFzcyAnaW4nXG4gICAgICAgICAgQHN0b3JhZ2Uuc2V0VmFsdWUgJ2hpZGVQYW5lbCcsIHllc1xuXG4gICAgICAgIGlmICdKczJDb2ZmZWUnIGlzIGFkZGVkXG4gICAgICAgICAgQHNldENvbXBpbGVyIENvZmZlZVBhZC5Db21waWxlcnMuSnMyQ29mZmVlXG4gICAgICAgICAgQHN0b3JhZ2Uuc2V0VmFsdWUgJ2pzMmNvZmZlZScsIHllc1xuICAgICAgICAgIG5ldyBLRE5vdGlmaWNhdGlvblZpZXcgdGl0bGU6IFwiQ29mZmVlIOKHoCBKcyBzZWxlY3RlZFwiXG4gICAgICAgIGVsc2UgaWYgXCJKczJDb2ZmZWVcIiBpcyByZW1vdmVkXG4gICAgICAgICAgQHNldENvbXBpbGVyKClcbiAgICAgICAgICBAc3RvcmFnZS5zZXRWYWx1ZSAnanMyY29mZmVlJywgbm9cbiAgICAgICAgICBuZXcgS0ROb3RpZmljYXRpb25WaWV3IHRpdGxlOiBcIkNvZmZlZSDih6IgSnMgc2VsZWN0ZWRcIlxuXG4gICAgICAgIEtELnV0aWxzLmRlZmVyID0+IEBjb2ZmZWVFZGl0b3IuY20uZm9jdXMoKVxuXG4gICAgQGFkZFN1YlZpZXcgQG11bHRpcGxlQ2hvaWNlXG4gICAgQGFkZFN1YlZpZXcgQHNwbGl0Vmlld1xuXG4gICAgQGFkZFN1YlZpZXcgbmV3IEtEQnV0dG9uVmlld1xuICAgICAgdGl0bGUgICAgOiBcIitcIlxuICAgICAgY3NzQ2xhc3MgOiBcImNsZWFuLWdyYXkgY3JlYXRlLW5ld1wiXG4gICAgICBjYWxsYmFjayA6ID0+IEBqc0VkaXRvci5yZWFkeSA9PlxuXG4gICAgICAgIEBjb2ZmZWVFZGl0b3IuaGFuZGxlU2F2ZSB5ZXNcblxuICAgICAgICBuZXcgU2F2ZUZpbGVNb2RhbCAoZXJyLCBmaWxlTmFtZSk9PlxuICAgICAgICAgIGZpbGVOYW1lID0gXCJmaWxlLSN7ZmlsZU5hbWV9XCJcbiAgICAgICAgICBpZiBlcnJcbiAgICAgICAgICAgIEBjb2ZmZWVFZGl0b3IuY20uZm9jdXMoKVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIEBjb2ZmZWVFZGl0b3IuY20uZ2V0RG9jKCkuY2xlYXJIaXN0b3J5KClcbiAgICAgICAgICAgIEBjb2ZmZWVFZGl0b3IuY20uc2V0VmFsdWUgXCJcIlxuICAgICAgICAgICAgQGNvZmZlZUVkaXRvci5zYXZlRmlsZSBmaWxlTmFtZVxuXG4gICAgQGFkZFN1YlZpZXcgbmV3IEtEQnV0dG9uVmlld1xuICAgICAgdGl0bGUgICAgOiBcIj9cIlxuICAgICAgY3NzQ2xhc3MgOiBcImNsZWFuLWdyYXkgaGVscFwiXG4gICAgICBjYWxsYmFjayA6IEBib3VuZCAndG9nZ2xlSGVscE1vZGUnXG5cbiAgICBAYWRkU3ViVmlldyBAZmlsZUxpc3RWaWV3XG5cbiAgICBAYWRkU3ViVmlldyBuZXcgS0RCdXR0b25WaWV3XG4gICAgICB0aXRsZSAgICA6IFwiUnVuXCJcbiAgICAgIGNzc0NsYXNzIDogXCJjbGVhbi1ncmF5IHJ1bi1idXR0b25cIlxuICAgICAgY2FsbGJhY2sgOiBAYm91bmQgJ3J1bkpzQ29kZSdcblxuXG4gIGF0dGFjaExpc3RlbmVyczotPlxuXG4gICAgS0QudXRpbHMuZGVmZXIgPT5cblxuICAgICAge2hpZGVKcywgaGlkZVBhbmVsLCBqczJjb2ZmZWV9ID0gQHN0b3JhZ2UuZGF0YVxuICAgICAgaWYgbm90IGhpZGVKcyBvciBoaWRlSnMgaXMgXCJmYWxzZVwiXG4gICAgICAgIEBtdWx0aXBsZUNob2ljZS5zZXRWYWx1ZSAnSmF2YVNjcmlwdCdcbiAgICAgIGVsc2VcbiAgICAgICAgQGhpZGVKc1BhbmUoKVxuXG4gICAgICBpZiBub3QgaGlkZVBhbmVsIG9yIGhpZGVQYW5lbCBpcyBcImZhbHNlXCJcbiAgICAgICAgQG11bHRpcGxlQ2hvaWNlLnNldFZhbHVlICdGaWxlcydcblxuICAgICAgaWYganMyY29mZmVlIGlzIFwidHJ1ZVwiXG4gICAgICAgIEBtdWx0aXBsZUNob2ljZS5zZXRWYWx1ZSAnSnMyQ29mZmVlJ1xuXG5cbiAgICBAZmlsZUxpc3RWaWV3Lm9uICdyZW1vdmVJdGVtJywgKGl0ZW0pPT5cbiAgICAgIEBjb2ZmZWVFZGl0b3IuZmlsZU5hbWUgPSBudWxsXG4gICAgICBAc3RvcmFnZS51bnNldEtleSBpdGVtLmRhdGEubmFtZVxuICAgICAgQHVwZGF0ZUZpbGVMaXN0KClcblxuICAgIEBzZXRDb21waWxlciBDb2ZmZWVQYWQuQ29tcGlsZXJzLkNvZmZlZTJKcywgeWVzXG5cbiAgICBAanNFZGl0b3Iub24gICAgIFwicnVuQ29kZVwiLCBAYm91bmQgJ3J1bkpzQ29kZSdcbiAgICBAY29mZmVlRWRpdG9yLm9uIFwicnVuQ29kZVwiLCBAYm91bmQgJ3J1bkpzQ29kZSdcblxuICAgIEBqc0VkaXRvci5vbiBcInRvZ2dsZUZpbGVzXCIsID0+XG4gICAgICBAbXVsdGlwbGVDaG9pY2Uuc2V0VmFsdWUgJ0ZpbGVzJ1xuXG4gICAgQGNvZmZlZUVkaXRvci5vbiBcInRvZ2dsZUZpbGVzXCIsID0+XG4gICAgICBAbXVsdGlwbGVDaG9pY2Uuc2V0VmFsdWUgJ0ZpbGVzJ1xuXG4gICAgQGpzRWRpdG9yLm9uIFwidG9nZ2xlSnNcIiwgPT5cbiAgICAgIEBtdWx0aXBsZUNob2ljZS5zZXRWYWx1ZSAnSmF2YVNjcmlwdCdcblxuICAgIEBjb2ZmZWVFZGl0b3Iub24gXCJ0b2dnbGVKc1wiLCA9PlxuICAgICAgQG11bHRpcGxlQ2hvaWNlLnNldFZhbHVlICdKYXZhU2NyaXB0J1xuXG4gICAgQGpzRWRpdG9yLm9uIFwidG9nZ2xlSGVscGVyXCIsIEBib3VuZCAndG9nZ2xlSGVscE1vZGUnXG4gICAgQGNvZmZlZUVkaXRvci5vbiBcInRvZ2dsZUhlbHBlclwiLCBAYm91bmQgJ3RvZ2dsZUhlbHBNb2RlJ1xuXG4gICAgQGNvZmZlZUVkaXRvci5vbiBcImxvYWRQcmV2aW91c0ZpbGVcIiwgQGxhenlCb3VuZCAnbG9hZEZpbGVBdERpcmVjdGlvbicsIC0xXG4gICAgQGNvZmZlZUVkaXRvci5vbiBcImxvYWROZXh0RmlsZVwiLCAgICAgQGxhenlCb3VuZCAnbG9hZEZpbGVBdERpcmVjdGlvbicsIDFcblxuICAgIEBjb2ZmZWVFZGl0b3Iub24gXCJmaWxlU2F2ZWRcIiwgQGJvdW5kICd1cGRhdGVGaWxlTGlzdCdcblxuICAgIEBzdG9yYWdlLmdldFZhbHVlIFwibGFzdEZpbGVcIiwgKGZpbGUpPT5cblxuICAgICAgQGNvZmZlZUVkaXRvci5vcGVuRmlsZSBmaWxlICBpZiBmaWxlP1xuXG4gICAgICBAZmlsZUxpc3Qub24gJ0l0ZW1TZWxlY3Rpb25QZXJmb3JtZWQnLCAoLi4uLCB7aXRlbXN9KT0+XG5cbiAgICAgICAgaWYgQGNvZmZlZUVkaXRvci5maWxlTmFtZT9cbiAgICAgICAgICBAY29mZmVlRWRpdG9yLmhhbmRsZVNhdmUgeWVzXG5cbiAgICAgICAgQGNvZmZlZUVkaXRvci5vcGVuRmlsZSBpdGVtcy5maXJzdC5kYXRhLm5hbWVcblxuICAgICAgQHVwZGF0ZUZpbGVMaXN0IGZpbGVcblxuICB0b2dnbGVIZWxwTW9kZTotPlxuXG4gICAgYm9keSA9ICQoJ2JvZHknKVxuICAgIGlmIGJvZHkuaGFzQ2xhc3MgJ2hlbHBNb2RlJ1xuICAgICAgYm9keS5yZW1vdmVDbGFzcyAnaGVscE1vZGUnXG4gICAgICBAY29mZmVlRWRpdG9yLmNtLmZvY3VzKClcbiAgICBlbHNlXG4gICAgICBib2R5LmFkZENsYXNzICdoZWxwTW9kZSdcbiAgICAgIEBoZWFkZXIuZmlsdGVyVmlldy5zZXRGb2N1cygpXG5cblxuICBsb2FkRmlsZUF0RGlyZWN0aW9uOihkaXJlY3Rpb24pLT5cblxuICAgIGl0ZW1zID0gQGZpbGVMaXN0Lml0ZW1zT3JkZXJlZFxuICAgIHJldHVybiAgaWYgaXRlbXMubGVuZ3RoIDwgMlxuXG4gICAgcmV0dXJuICB1bmxlc3MgQGZpbGVMaXN0LnNlbGVjdGVkSXRlbXNcbiAgICBhY3RpdmVGaWxlID0gICBAZmlsZUxpc3Quc2VsZWN0ZWRJdGVtcy5maXJzdFxuXG4gICAgZm9yIGl0ZW0sIGkgaW4gaXRlbXNcblxuICAgICAgaWYgaXRlbS5kYXRhLm5hbWUgaXMgYWN0aXZlRmlsZS5kYXRhLm5hbWVcblxuICAgICAgICBuZXh0SW5kZXggPSBpICsgZGlyZWN0aW9uXG5cbiAgICAgICAgaWYgbmV4dEluZGV4IDwgMFxuICAgICAgICAgIG5leHRJbmRleCA9IGl0ZW1zLmxlbmd0aCAtIDFcbiAgICAgICAgZWxzZSBpZiBuZXh0SW5kZXggaXMgaXRlbXMubGVuZ3RoXG4gICAgICAgICAgbmV4dEluZGV4ID0gMFxuXG4gICAgICAgIEBmaWxlTGlzdC5zZWxlY3RJdGVtIGl0ZW1zW25leHRJbmRleF1cblxuICAgICAgICBicmVha1xuXG5cbiAgY3JlYXRlTmV3RmlsZTotPlxuXG4gICAgZmlsZSA9IFwiZmlsZS1Db2ZmZWUtI3tuZXcgRGF0ZSgpLmZvcm1hdChcImQtbW0gSEg6TU06c3NcIil9XCJcbiAgICBAY29mZmVlRWRpdG9yLmNtLmdldERvYygpLmNsZWFySGlzdG9yeSgpXG4gICAgQGNvZmZlZUVkaXRvci5jbS5zZXRWYWx1ZSBcIlwiXG4gICAgQGNvZmZlZUVkaXRvci5zYXZlRmlsZSBmaWxlXG4gICAgcmV0dXJuIGZpbGVcblxuXG4gIHVwZGF0ZUZpbGVMaXN0OihuZXduYW1lKS0+XG5cbiAgICBAbG9hZEV4YW1wbGVzKClcbiAgICBwcmV2RmlsZSA9IG5ld25hbWUgPyBAZmlsZUxpc3QuZmlyc3Q/LmRhdGE/Lm5hbWVcblxuICAgIEBzdG9yYWdlLmZpbHRlciAvZmlsZVxcLS8sIChmaWxlcyk9PlxuXG4gICAgICBAZmlsZUxpc3QucmVwbGFjZUFsbEl0ZW1zIGZpbGVzXG5cbiAgICAgIGlmIHByZXZGaWxlXG4gICAgICAgIGZvciBpdGVtIGluIEBmaWxlTGlzdC5pdGVtc09yZGVyZWRcbiAgICAgICAgICBpZiBpdGVtLmRhdGEubmFtZSBpcyBwcmV2RmlsZVxuICAgICAgICAgICAgQGZpbGVMaXN0LnNlbGVjdEl0ZW0gaXRlbVxuICAgICAgZWxzZVxuICAgICAgICBAZmlsZUxpc3Quc2VsZWN0SXRlbSBAZmlsZUxpc3QuaXRlbXNPcmRlcmVkLmxhc3RcblxuXG4gIHJ1bkpzQ29kZTotPlxuXG4gICAgY29kZVRvRXZhbCA9IEBqc0VkaXRvci5jbS5nZXRWYWx1ZSgpXG5cbiAgICBpZiBjaHJvbWU/LmRldnRvb2xzPy5pbnNwZWN0ZWRXaW5kb3c/XG4gICAgICB7IGluc3BlY3RlZFdpbmRvdyB9ID0gY2hyb21lLmRldnRvb2xzXG4gICAgICBpbnNwZWN0ZWRXaW5kb3cuZXZhbCBjb2RlVG9FdmFsLCAoZXJyLCBleGNlcHRpb24pLT5cbiAgICAgICAgaWYgZXhjZXB0aW9uPy5pc0V4Y2VwdGlvblxuICAgICAgICAgIGluc3BlY3RlZFdpbmRvdy5ldmFsIFwiY29uc29sZS5lcnJvcignI3tleGNlcHRpb24udmFsdWV9Jyk7XCJcbiAgICBlbHNlXG4gICAgICBldmFsIGNvZGVUb0V2YWxcblxuXG4gIGhpZGVKc1BhbmU6LT5cblxuICAgIEBzcGxpdFZpZXcuaGlkZVBhbmVsIDFcbiAgICBAc3BsaXRWaWV3LnNldENsYXNzIFwianMtaGlkZGVuXCJcbiAgICBAc3BsaXRWaWV3Lm9wdGlvbnMuc2l6ZXMgPSBbXCIxMDAlXCIsIFwiMCVcIl1cblxuXG4gIHNldENvbXBpbGVyOihjb21waWxlciA9IENvZmZlZVBhZC5Db21waWxlcnMuQ29mZmVlMkpzLCBjb21waWxlKS0+XG5cbiAgICBbc291cmNlLCB0YXJnZXRdID0gW0Bjb2ZmZWVFZGl0b3IsIEBqc0VkaXRvcl1cbiAgICBpZiBjb21waWxlciBpcyBDb2ZmZWVQYWQuQ29tcGlsZXJzLkpzMkNvZmZlZVxuICAgICAgW3NvdXJjZSwgdGFyZ2V0XSA9IFt0YXJnZXQsIHNvdXJjZV1cblxuICAgIHRhcmdldC5vZmYgXCJjaGFuZ2VcIlxuICAgIHNvdXJjZS5jb21waWxlIHRhcmdldCAgaWYgY29tcGlsZVxuICAgIHNvdXJjZS5vbiBcImNoYW5nZVwiLCAtPlxuICAgICAgc291cmNlLmNvbXBpbGUgdGFyZ2V0XG4iLCJcblN0b3JhZ2UgPSByZXF1aXJlICcuL3N0b3JhZ2UnXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgQ29kZUVkaXRvciBleHRlbmRzIEtESW5wdXRWaWV3XG5cbiAgY29uc3RydWN0b3I6KG9wdGlvbnMgPSB7fSwgZGF0YSktPlxuXG4gICAgb3B0aW9ucy50eXBlICAgICAgICAgID0gXCJ0ZXh0YXJlYVwiXG4gICAgb3B0aW9ucy5sb2dUb0NvbnNvbGUgPz0gbm9cblxuICAgIG9wdGlvbnMuZGVmYXVsdFZhbHVlICA9IGRhdGE/LmNvbnRlbnRcblxuICAgIHN1cGVyIG9wdGlvbnMsIGRhdGFcblxuICAgIEBzdG9yYWdlID0gbmV3IFN0b3JhZ2UoKVxuXG4gICAgQG9uICd2aWV3QXBwZW5kZWQnLCA9PlxuXG4gICAgICBAY20gPSBDb2RlTWlycm9yLmZyb21UZXh0QXJlYSBAZ2V0RWxlbWVudCgpLFxuICAgICAgICBsaW5lTnVtYmVycyAgICAgICAgICAgICA6IHllc1xuICAgICAgICBsaW5lV3JhcHBpbmcgICAgICAgICAgICA6IHllc1xuICAgICAgICBzdHlsZUFjdGl2ZUxpbmUgICAgICAgICA6IHllc1xuICAgICAgICBzY3JvbGxQYXN0RW5kICAgICAgICAgICA6IHllc1xuICAgICAgICBjdXJzb3JIZWlnaHQgICAgICAgICAgICA6IDFcbiAgICAgICAgdGFiU2l6ZSAgICAgICAgICAgICAgICAgOiAyXG4gICAgICAgIG1vZGUgICAgICAgICAgICAgICAgICAgIDogb3B0aW9ucy5tb2RlXG4gICAgICAgIGF1dG9DbG9zZUJyYWNrZXRzICAgICAgIDogeWVzXG4gICAgICAgIG1hdGNoQnJhY2tldHMgICAgICAgICAgIDogeWVzXG4gICAgICAgIHNob3dDdXJzb3JXaGVuU2VsZWN0aW5nIDogeWVzXG4gICAgICAgIHRoZW1lICAgICAgICAgICAgICAgICAgIDogXCJ0b21vcnJvdy1uaWdodC1laWdodGllc1wiXG4gICAgICAgIGtleU1hcCAgICAgICAgICAgICAgICAgIDogXCJzdWJsaW1lXCJcbiAgICAgICAgZ3V0dGVycyAgICAgICAgICAgICAgICAgOiBbXCJDb2RlTWlycm9yLWxpbnQtbWFya2Vyc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvZGVNaXJyb3ItbGluZW51bWJlcnNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2RlTWlycm9yLWZvbGRndXR0ZXJcIl1cbiAgICAgICAgZm9sZEd1dHRlciAgICAgICAgICAgICAgOiB5ZXNcbiAgICAgICAgbGludCAgICAgICAgICAgICAgICAgICAgOiB5ZXNcbiAgICAgICAgZXh0cmFLZXlzICAgICAgICAgICAgICAgOlxuXG4gICAgICAgICAgXCJDbWQtU1wiICAgICAgICAgICAgICAgOiA9PiBAaGFuZGxlU2F2ZSgpXG4gICAgICAgICAgXCJDdHJsLVNcIiAgICAgICAgICAgICAgOiA9PiBAaGFuZGxlU2F2ZSgpXG5cbiAgICAgICAgICBcIkN0cmwtSFwiICAgICAgICAgICAgICA6ID0+IEBlbWl0IFwidG9nZ2xlSGVscGVyXCJcblxuICAgICAgICAgIFwiU2hpZnQtQ21kLVNcIiAgICAgICAgIDogPT4gQGhhbmRsZVNhdmVBcygpXG4gICAgICAgICAgXCJTaGlmdC1DdHJsLVNcIiAgICAgICAgOiA9PiBAaGFuZGxlU2F2ZUFzKClcblxuICAgICAgICAgIFwiQ21kLU9cIiAgICAgICAgICAgICAgIDogPT4gQGVtaXQgXCJ0b2dnbGVGaWxlc1wiXG4gICAgICAgICAgXCJDdHJsLU9cIiAgICAgICAgICAgICAgOiA9PiBAZW1pdCBcInRvZ2dsZUZpbGVzXCJcblxuICAgICAgICAgIFwiQ3RybC1KXCIgICAgICAgICAgICAgIDogPT4gQGVtaXQgXCJ0b2dnbGVKc1wiXG5cbiAgICAgICAgICBcIlRhYlwiICAgICAgICAgICAgICAgICA6IChjbSktPlxuICAgICAgICAgICAgaWYgY20uc29tZXRoaW5nU2VsZWN0ZWQoKVxuICAgICAgICAgICAgdGhlbiBjbS5pbmRlbnRTZWxlY3Rpb24gXCJhZGRcIlxuICAgICAgICAgICAgZWxzZSBjbS5leGVjQ29tbWFuZCBcImluc2VydFNvZnRUYWJcIlxuXG4gICAgICAgICAgXCJTaGlmdC1UYWJcIiAgICAgICAgICAgOiAoY20pLT5cbiAgICAgICAgICAgIGNtLmluZGVudFNlbGVjdGlvbiBcInN1YnRyYWN0XCJcblxuICAgICAgICAgIFwiQ3RybC1TcGFjZVwiICAgICAgICAgIDogXCJhdXRvY29tcGxldGVcIlxuXG4gICAgICAgICAgXCJDbWQtRW50ZXJcIiAgICAgICAgICAgOiA9PiBAZW1pdCBcInJ1bkNvZGVcIlxuICAgICAgICAgIFwiQ3RybC1FbnRlclwiICAgICAgICAgIDogPT4gQGVtaXQgXCJydW5Db2RlXCJcblxuICAgICAgICAgIFwiQWx0LVVwXCIgICAgICAgICAgICAgIDogPT4gQGVtaXQgXCJsb2FkUHJldmlvdXNGaWxlXCJcbiAgICAgICAgICBcIkFsdC1Eb3duXCIgICAgICAgICAgICA6ID0+IEBlbWl0IFwibG9hZE5leHRGaWxlXCJcblxuICAgICAgQGNtLm9uIFwiY2hhbmdlXCIsIEBsYXp5Qm91bmQgXCJlbWl0XCIsIFwiY2hhbmdlXCJcblxuICAgICAgQGVtaXQgXCJyZWFkeVwiXG5cbiAgY29tcGlsZTogKHRhcmdldCktPlxuICAgIGNvbnNvbGUud2FybiBcIkltcGxlbWVudCA6OmNvbXBpbGUgbWV0aG9kIVwiXG5cbiAgaGFuZGxlU2F2ZTotPiBub1xuICBoYW5kbGVTYXZlQXM6LT4gbm8iLCJcbiNcbiMgRXhhbXBsZXMgdGFrZW4gZnJvbSBjb2ZmZWVzY3JpcHQub3JnXG4jXG5cbm1vZHVsZS5leHBvcnRzID0gW1xuXG4gIHtcbiAgICB0aXRsZTogXCJPdmVydmlld1wiXG4gICAgY29udGVudDogXCJcIlwiXG4gICAgICAjIEFzc2lnbm1lbnQ6XG4gICAgICBudW1iZXIgICA9IDQyXG4gICAgICBvcHBvc2l0ZSA9IHRydWVcblxuICAgICAgIyBDb25kaXRpb25zOlxuICAgICAgbnVtYmVyID0gLTQyIGlmIG9wcG9zaXRlXG5cbiAgICAgICMgRnVuY3Rpb25zOlxuICAgICAgc3F1YXJlID0gKHgpIC0+IHggKiB4XG5cbiAgICAgICMgQXJyYXlzOlxuICAgICAgbGlzdCA9IFsxLCAyLCAzLCA0LCA1XVxuXG4gICAgICAjIE9iamVjdHM6XG4gICAgICBtYXRoID1cbiAgICAgICAgcm9vdDogICBNYXRoLnNxcnRcbiAgICAgICAgc3F1YXJlOiBzcXVhcmVcbiAgICAgICAgY3ViZTogICAoeCkgLT4geCAqIHNxdWFyZSB4XG5cbiAgICAgICMgU3BsYXRzOlxuICAgICAgcmFjZSA9ICh3aW5uZXIsIHJ1bm5lcnMuLi4pIC0+XG4gICAgICAgIHByaW50IHdpbm5lciwgcnVubmVyc1xuXG4gICAgICAjIEV4aXN0ZW5jZTpcbiAgICAgIGFsZXJ0IFwiSSBrbmV3IGl0IVwiIGlmIGVsdmlzP1xuXG4gICAgICAjIEFycmF5IGNvbXByZWhlbnNpb25zOlxuICAgICAgY3ViZXMgPSAobWF0aC5jdWJlIG51bSBmb3IgbnVtIGluIGxpc3QpXG4gICAgXCJcIlwiXG4gIH1cblxuICB7XG4gICAgdGl0bGU6IFwiT2JqZWN0cyBhbmQgQXJyYXlzXCJcbiAgICBjb250ZW50OiBcIlwiXCJcbiAgICAgIHNvbmcgPSBbXCJkb1wiLCBcInJlXCIsIFwibWlcIiwgXCJmYVwiLCBcInNvXCJdXG5cbiAgICAgIHNpbmdlcnMgPSB7SmFnZ2VyOiBcIlJvY2tcIiwgRWx2aXM6IFwiUm9sbFwifVxuXG4gICAgICBiaXRsaXN0ID0gW1xuICAgICAgICAxLCAwLCAxXG4gICAgICAgIDAsIDAsIDFcbiAgICAgICAgMSwgMSwgMFxuICAgICAgXVxuXG4gICAgICBraWRzID1cbiAgICAgICAgYnJvdGhlcjpcbiAgICAgICAgICBuYW1lOiBcIk1heFwiXG4gICAgICAgICAgYWdlOiAgMTFcbiAgICAgICAgc2lzdGVyOlxuICAgICAgICAgIG5hbWU6IFwiSWRhXCJcbiAgICAgICAgICBhZ2U6ICA5XG4gICAgXCJcIlwiXG4gIH1cblxuICB7XG4gICAgdGl0bGU6IFwiU3BsYXRzXCJcbiAgICBjb250ZW50OiBcIlwiXCJcbiAgICAgIGdvbGQgPSBzaWx2ZXIgPSByZXN0ID0gXCJ1bmtub3duXCJcblxuICAgICAgYXdhcmRNZWRhbHMgPSAoZmlyc3QsIHNlY29uZCwgb3RoZXJzLi4uKSAtPlxuICAgICAgICBnb2xkICAgPSBmaXJzdFxuICAgICAgICBzaWx2ZXIgPSBzZWNvbmRcbiAgICAgICAgcmVzdCAgID0gb3RoZXJzXG5cbiAgICAgIGNvbnRlbmRlcnMgPSBbXG4gICAgICAgIFwiTWljaGFlbCBQaGVscHNcIlxuICAgICAgICBcIkxpdSBYaWFuZ1wiXG4gICAgICAgIFwiWWFvIE1pbmdcIlxuICAgICAgICBcIkFsbHlzb24gRmVsaXhcIlxuICAgICAgICBcIlNoYXduIEpvaG5zb25cIlxuICAgICAgICBcIlJvbWFuIFNlYnJsZVwiXG4gICAgICAgIFwiR3VvIEppbmdqaW5nXCJcbiAgICAgICAgXCJUeXNvbiBHYXlcIlxuICAgICAgICBcIkFzYWZhIFBvd2VsbFwiXG4gICAgICAgIFwiVXNhaW4gQm9sdFwiXG4gICAgICBdXG5cbiAgICAgIGF3YXJkTWVkYWxzIGNvbnRlbmRlcnMuLi5cblxuICAgICAgYWxlcnQgXCJHb2xkOiBcIiArIGdvbGRcbiAgICAgIGFsZXJ0IFwiU2lsdmVyOiBcIiArIHNpbHZlclxuICAgICAgYWxlcnQgXCJUaGUgRmllbGQ6IFwiICsgcmVzdFxuICAgIFwiXCJcIlxuICB9XG5cbiAge1xuICAgIHRpdGxlOiBcIkxvb3BzIGFuZCBDb21wcmVoZW5zaW9uc1wiXG4gICAgY29udGVudDogXCJcIlwiXG4gICAgICAjIEZ1bmN0aW9uc1xuICAgICAgZWF0ID0gKGZvb2QpLT5cbiAgICAgICAgY29uc29sZS5sb2cgZm9vZFxuXG4gICAgICBtZW51ID0gKG51bSwgZGlzaCktPlxuICAgICAgICBjb25zb2xlLmluZm8gbnVtLCBkaXNoXG5cbiAgICAgICMgRWF0IGx1bmNoLlxuICAgICAgZWF0IGZvb2QgZm9yIGZvb2QgaW4gWyd0b2FzdCcsICdjaGVlc2UnLCAnd2luZSddXG5cbiAgICAgICMgRmluZSBmaXZlIGNvdXJzZSBkaW5pbmcuXG4gICAgICBjb3Vyc2VzID0gWydncmVlbnMnLCAnY2F2aWFyJywgJ3RydWZmbGVzJywgJ3JvYXN0JywgJ2Nha2UnXVxuICAgICAgbWVudSBpICsgMSwgZGlzaCBmb3IgZGlzaCwgaSBpbiBjb3Vyc2VzXG5cbiAgICAgICMgSGVhbHRoIGNvbnNjaW91cyBtZWFsLlxuICAgICAgZm9vZHMgPSBbJ2Jyb2Njb2xpJywgJ3NwaW5hY2gnLCAnY2hvY29sYXRlJ11cbiAgICAgIGVhdCBmb29kIGZvciBmb29kIGluIGZvb2RzIHdoZW4gZm9vZCBpc250ICdjaG9jb2xhdGUnXG4gICAgXCJcIlwiXG4gIH1cblxuXSIsIlxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBDUEZpbGVJdGVtIGV4dGVuZHMgS0RMaXN0SXRlbVZpZXdcblxuICB2aWV3QXBwZW5kZWQ6IC0+XG5cbiAgICB7bmFtZX0gPSBAZ2V0RGF0YSgpXG4gICAgbmFtZSA9IG5hbWUucmVwbGFjZSAvXmZpbGVcXC0vLCAnJ1xuXG4gICAgQGFkZFN1YlZpZXcgbmV3IEtEVmlld1xuICAgICAgdGFnTmFtZSA6IFwiaDFcIlxuICAgICAgcGFydGlhbCA6IG5hbWVcblxuICAgIEBhZGRTdWJWaWV3IG5ldyBLREJ1dHRvblZpZXdcbiAgICAgIHRpdGxlICAgIDogXCJYXCJcbiAgICAgIGNzc0NsYXNzIDogJ2NsZWFuLXJlZCdcbiAgICAgIGNhbGxiYWNrIDogPT5cblxuICAgICAgICBtb2RhbCA9IG5ldyBLRE1vZGFsVmlld1xuXG4gICAgICAgICAgdGl0bGUgICAgICAgICA6IFwiQ29uZmlybWF0aW9uIHJlcXVpcmVkLi4uXCJcbiAgICAgICAgICBjb250ZW50ICAgICAgIDogXCJcIlwiXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPSdtb2RhbGZvcm1saW5lJz5cbiAgICAgICAgICAgICAgPHA+RG8geW91IHdhbnQgdG8gcmVtb3ZlIHRoaXMgc2NyaXB0ID88L3A+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICBcIlwiXCJcblxuICAgICAgICAgIGNzc0NsYXNzICAgICAgOiBcInNhdmVmaWxlLW1vZGFsXCJcbiAgICAgICAgICB3aWR0aCAgICAgICAgIDogMzA1XG4gICAgICAgICAgb3ZlcmxheSAgICAgICA6IHllc1xuXG4gICAgICAgICAgYnV0dG9ucyAgICAgICA6XG5cbiAgICAgICAgICAgIFJlbW92ZSAgICAgIDpcbiAgICAgICAgICAgICAgc3R5bGUgICAgIDogXCJrZGJ1dHRvbiBjbGVhbi1ncmF5XCJcbiAgICAgICAgICAgICAgY2FsbGJhY2sgIDogPT5cbiAgICAgICAgICAgICAgICBAZ2V0RGVsZWdhdGUoKS5lbWl0IFwicmVtb3ZlSXRlbVwiLCB0aGlzXG4gICAgICAgICAgICAgICAgbW9kYWwuZGVzdHJveSgpXG5cbiAgICAgICAgICAgIENhbmNlbCAgICAgIDpcbiAgICAgICAgICAgICAgc3R5bGUgICAgIDogXCJrZGJ1dHRvbiBjbGVhbi1ncmF5XCJcbiAgICAgICAgICAgICAgY2FsbGJhY2sgIDogLT4gbW9kYWwuZGVzdHJveSgpXG4iLCJcbkNvZGVFZGl0b3IgPSByZXF1aXJlICcuL2VkaXRvcidcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBKU0VkaXRvciBleHRlbmRzIENvZGVFZGl0b3JcblxuICBjb25zdHJ1Y3RvcjotPlxuICAgIHN1cGVyXG4gICAgICBtb2RlIDogXCJqYXZhc2NyaXB0XCJcblxuICBjb21waWxlOih0YXJnZXQpLT5cblxuICAgIHRyeVxuICAgICAgdGFyZ2V0LmNtLnNldFZhbHVlIGpzMmNvZmZlZS5idWlsZCBAY20uZ2V0VmFsdWUoKVxuICAgIGNhdGNoIGVycm9yXG4gICAgICBjb25zb2xlLndhcm4gZXJyb3IgIGlmIEBnZXRPcHRpb24gJ2xvZ1RvQ29uc29sZSdcblxuICBoYW5kbGVTYXZlOi0+IG5vIiwiXG4jIENvZmZlZXBhZFxuIyAyMDE0IC0gR29rbWVuIEdva3NlbCA8Z29rbWVuQGdva3NlbC5tZT5cblxuIyBGb2xsb3dpbmdzIHVzZWQgaW4gdGhpcyBzb3R3YXJlOlxuI1xuIyBDb2ZmZWVTY3JpcHQgOiBodHRwczovL2dpdGh1Yi5jb20vamFzaGtlbmFzL2NvZmZlZXNjcmlwdFxuIyBLREZyYW1ld29yayAgOiBodHRwczovL2dpdGh1Yi5jb20va29kaW5nL2tkXG4jIENvZGVNaXJyb3IgICA6IGh0dHBzOi8vZ2l0aHViLmNvbS9tYXJpam5oL0NvZGVNaXJyb3JcbiMgTm9kZS5qcyAgICAgIDogaHR0cHM6Ly9naXRodWIuY29tL2pveWVudC9ub2RlXG4jIEd1bHAgICAgICAgICA6IGh0dHBzOi8vZ2l0aHViLmNvbS9ndWxwanMvZ3VscFxuIyBTdHlsdXMgICAgICAgOiBodHRwczovL2dpdGh1Yi5jb20vbGVhcm5ib29zdC9zdHlsdXNcblxuZG8gLT5cblxuICBDb2ZmZWVQYWQgPSByZXF1aXJlICcuL2NvZmZlZXBhZCdcbiAgKG5ldyBDb2ZmZWVQYWQpLmFwcGVuZFRvRG9tQm9keSgpXG4iLCJcbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgQ1BNdWx0aXBsZUNob2ljZSBleHRlbmRzIEtETXVsdGlwbGVDaG9pY2VcblxuICBzZXRWYWx1ZToobGFiZWwsIHdDYWxsYmFjayA9IHllcyktPlxuXG4gICAgQF9sYXN0T3BlcmF0aW9uID0gaWYgbGFiZWwgaW4gQGN1cnJlbnRWYWx1ZVxuICAgIHRoZW4gcmVtb3ZlZDogbGFiZWwgZWxzZSBhZGRlZDogbGFiZWxcblxuICAgIHN1cGVyXG4iLCJcbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgU2F2ZUZpbGVNb2RhbCBleHRlbmRzIEtETW9kYWxWaWV3V2l0aEZvcm1zXG5cbiAgY29uc3RydWN0b3I6IChjYWxsYmFjayktPlxuXG4gICAgb3B0aW9ucyA9XG4gICAgICB0aXRsZSAgICAgICAgICAgICAgICAgIDogXCJFbnRlciBhIGZhbmN5IG5hbWUuLi5cIlxuICAgICAgb3ZlcmxheSAgICAgICAgICAgICAgICA6IHllc1xuICAgICAgd2lkdGggICAgICAgICAgICAgICAgICA6IDMwNVxuICAgICAgaGVpZ2h0ICAgICAgICAgICAgICAgICA6IFwiYXV0b1wiXG4gICAgICBjc3NDbGFzcyAgICAgICAgICAgICAgIDogXCJzYXZlZmlsZS1tb2RhbFwiXG4gICAgICB0YWJzICAgICAgICAgICAgICAgICAgIDpcbiAgICAgICAgbmF2aWdhYmxlICAgICAgICAgICAgOiB5ZXNcbiAgICAgICAgZm9ybXMgICAgICAgICAgICAgICAgOlxuICAgICAgICAgIHNhdmVGb3JtICAgICAgICAgICA6XG4gICAgICAgICAgICBjYWxsYmFjayAgICAgICAgIDogPT5cbiAgICAgICAgICAgICAgY2FsbGJhY2sgbnVsbCwgQG1vZGFsVGFicy5mb3Jtcy5zYXZlRm9ybS5pbnB1dHMuZmlsZU5hbWUuZ2V0VmFsdWUoKVxuICAgICAgICAgICAgICBAZGVzdHJveSgpXG4gICAgICAgICAgICBidXR0b25zICAgICAgICAgIDpcbiAgICAgICAgICAgICAgU2F2ZSAgICAgICAgICAgOlxuICAgICAgICAgICAgICAgIHRpdGxlICAgICAgICA6IFwiU2F2ZVwiXG4gICAgICAgICAgICAgICAgY3NzQ2xhc3MgICAgIDogXCJjbGVhbi1ncmF5XCJcbiAgICAgICAgICAgICAgICB0eXBlICAgICAgICAgOiBcInN1Ym1pdFwiXG4gICAgICAgICAgICBmaWVsZHMgICAgICAgICAgIDpcbiAgICAgICAgICAgICAgZmlsZU5hbWUgICAgICAgOlxuICAgICAgICAgICAgICAgIG5hbWUgICAgICAgICA6IFwiZmlsZU5hbWVcIlxuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyICA6IFwiRmlsZSBuYW1lXCJcbiAgICAgICAgICAgICAgICB2YWxpZGF0ZSAgICAgOlxuICAgICAgICAgICAgICAgICAgcnVsZXMgICAgICA6XG4gICAgICAgICAgICAgICAgICAgIHJlcXVpcmVkIDogeWVzXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlcyAgIDpcbiAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWQgOiBcIkZpbGUgbmFtZSByZXF1aXJlZCFcIlxuXG4gICAgc3VwZXIgb3B0aW9uc1xuXG4gICAgQG9uICdNb2RhbENhbmNlbGxlZCcsIC0+IGNhbGxiYWNrIGNhbmNlbDogeWVzXG5cbiAgdmlld0FwcGVuZGVkOi0+XG4gICAgc3VwZXJcbiAgICBAbW9kYWxUYWJzLmZvcm1zLnNhdmVGb3JtLmlucHV0cy5maWxlTmFtZS5zZXRGb2N1cygpXG4gICAgJCh3aW5kb3cpLm9uIFwia2V5ZG93bi5tb2RhbFwiLChlKT0+XG4gICAgICBAY2FuY2VsKCkgaWYgZS53aGljaCBpcyAyN1xuIiwiXG5jbGFzcyBTdG9yYWdlXG5cbiAgY29uc3RydWN0b3I6LT5cbiAgICBAZGF0YSA9IHt9XG5cbiAgc2V0VmFsdWU6IChrZXksIHZhbHVlLCBjYWxsYmFjayktPlxuICAgIG9sZFZhbHVlID0gQGRhdGFba2V5XVxuICAgIEBkYXRhW2tleV0gPSB2YWx1ZVxuICAgIEBvbkNoYW5nZUZuPyBrZXksIG9sZFZhbHVlLCB2YWx1ZVxuICAgIGNhbGxiYWNrPyBudWxsXG5cbiAgZ2V0VmFsdWU6IChrZXksIGNhbGxiYWNrKS0+XG4gICAgY2FsbGJhY2sgQGRhdGFba2V5XVxuXG4gIGdldEFsbDogKGNhbGxiYWNrKS0+XG4gICAgY2FsbGJhY2sgQGRhdGFcblxuICB1bnNldEtleTogKGtleSktPlxuICAgIGRlbGV0ZSBAZGF0YVtrZXldXG5cbiAgb25DaGFuZ2U6IChAb25DaGFuZ2VGbiA9IC0+KS0+XG5cbiAgZmlsdGVyOiAocmVnLCBjYWxsYmFjayktPlxuXG4gICAgcmVzdWx0ID0gW11cbiAgICBmb3Iga2V5IGluIE9iamVjdC5rZXlzIEBkYXRhIHdoZW4gcmVnLnRlc3Qga2V5XG4gICAgICByZXN1bHQucHVzaCBuYW1lOiBrZXksIHZhbHVlOiBAZGF0YVtrZXldXG5cbiAgICBjYWxsYmFjayByZXN1bHRcblxuXG5jbGFzcyBDaHJvbWVTdG9yYWdlIGV4dGVuZHMgU3RvcmFnZVxuXG4gIGNvbnN0cnVjdG9yOi0+XG4gICAgc3VwZXJcblxuICAgIGNocm9tZS5zdG9yYWdlLm9uQ2hhbmdlZC5hZGRMaXN0ZW5lciAoY2hhbmdlcyk9PlxuICAgICAgcmV0dXJuIHVubGVzcyBAb25DaGFuZ2VGbj9cbiAgICAgIGZvciBrZXksIGNoYW5nZSBvZiBjaGFuZ2VzXG4gICAgICAgIEBvbkNoYW5nZUZuIGtleSwgY2hhbmdlLm9sZFZhbHVlLCBjaGFuZ2UubmV3VmFsdWVcblxuICBzZXRWYWx1ZTogKGtleSwgdmFsdWUsIGNhbGxiYWNrID0gLT4pLT5cblxuICAgIGRhdGEgPSB7fVxuICAgIGRhdGFba2V5XSA9IHZhbHVlXG5cbiAgICBjaHJvbWUuc3RvcmFnZS5zeW5jLnNldCBkYXRhLCBjYWxsYmFja1xuXG5cbiAgZ2V0VmFsdWU6IChrZXksIGNhbGxiYWNrID0gLT4pLT5cbiAgICByZXR1cm4gY2FsbGJhY2sgbnVsbCAgdW5sZXNzIGtleVxuXG4gICAgY2hyb21lLnN0b3JhZ2Uuc3luYy5nZXQga2V5LCAoaXRlbSktPlxuICAgICAgY2FsbGJhY2sgaXRlbT9ba2V5XSBvciBudWxsXG5cblxuICBnZXRBbGw6IChjYWxsYmFjayA9IC0+KS0+XG4gICAgY2hyb21lLnN0b3JhZ2Uuc3luYy5nZXQgbnVsbCwgY2FsbGJhY2tcblxuXG5jbGFzcyBMb2NhbFN0b3JhZ2UgZXh0ZW5kcyBTdG9yYWdlXG5cbiAgY29uc3RydWN0b3I6LT5cbiAgICBAZGF0YSA9IHdpbmRvdy5sb2NhbFN0b3JhZ2VcblxuICAgIHN0b3JhZ2VIYW5kbGVyID0gKGV2ZW50KT0+XG4gICAgICB7a2V5LCBvbGRWYWx1ZSwgbmV3VmFsdWV9ID0gZXZlbnRcbiAgICAgIEBvbkNoYW5nZUZuPyBrZXksIG9sZFZhbHVlLCBuZXdWYWx1ZVxuXG4gICAgaWYgd2luZG93LmFkZEV2ZW50TGlzdGVuZXI/XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciBcInN0b3JhZ2VcIiwgc3RvcmFnZUhhbmRsZXIsIG5vXG4gICAgZWxzZVxuICAgICAgd2luZG93LmF0dGFjaEV2ZW50IFwib25zdG9yYWdlXCIsIHN0b3JhZ2VIYW5kbGVyXG5cbiAgc2V0VmFsdWU6IChrZXksIHZhbHVlLCBjYWxsYmFjayktPlxuXG4gICAgQGRhdGEuc2V0SXRlbSBrZXksIHZhbHVlXG4gICAgY2FsbGJhY2s/IG51bGxcblxuICB1bnNldEtleTogKGtleSktPlxuICAgIEBkYXRhLnJlbW92ZUl0ZW0ga2V5XG5cbiMgQ2hyb21lLnN0b3JhZ2UgaGFzIGlzc3VlcyB3aXRoIGRldnRvb2xzLnBhbmVscywgdW50aWwgaXRzIGZpeGVkXG4jIGtlZXAgdXNpbmcgTG9jYWxTdG9yYWdlIGluc3RlYWRcbiMgaWYgY2hyb21lPy5zdG9yYWdlPyB0aGVuIG1vZHVsZS5leHBvcnRzID0gQ2hyb21lU3RvcmFnZVxuaWYgd2luZG93LmxvY2FsU3RvcmFnZT9cbnRoZW4gbW9kdWxlLmV4cG9ydHMgPSBMb2NhbFN0b3JhZ2VcbmVsc2UgbW9kdWxlLmV4cG9ydHMgPSBTdG9yYWdlIl19
