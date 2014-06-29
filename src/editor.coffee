
Storage = require './storage'

module.exports = class CodeEditor extends KDInputView

  constructor:(options = {}, data)->

    options.type          = "textarea"
    options.logToConsole ?= no

    options.defaultValue  = data?.content

    super options, data

    @storage = new Storage()

    @on 'viewAppended', =>

      @cm = CodeMirror.fromTextArea @getElement(),
        lineNumbers             : yes
        lineWrapping            : yes
        styleActiveLine         : yes
        scrollPastEnd           : yes
        cursorHeight            : 1
        tabSize                 : 2
        mode                    : options.mode
        autoCloseBrackets       : yes
        matchBrackets           : yes
        showCursorWhenSelecting : yes
        theme                   : "tomorrow-night-eighties"
        keyMap                  : "sublime"
        gutters                 : ["CodeMirror-lint-markers",
                                   "CodeMirror-linenumbers",
                                   "CodeMirror-foldgutter"]
        foldGutter              : yes
        lint                    : yes
        extraKeys               :

          "Cmd-S"               : => @handleSave()
          "Ctrl-S"              : => @handleSave()

          "Ctrl-H"              : => @emit "toggleHelper"

          "Shift-Cmd-S"         : => @handleSaveAs()
          "Shift-Ctrl-S"        : => @handleSaveAs()

          "Cmd-O"               : => @emit "toggleFiles"
          "Ctrl-O"              : => @emit "toggleFiles"

          "Ctrl-J"              : => @emit "toggleJs"

          "Tab"                 : (cm)->
            if cm.somethingSelected()
            then cm.indentSelection "add"
            else cm.execCommand "insertSoftTab"

          "Shift-Tab"           : (cm)->
            cm.indentSelection "subtract"

          "Ctrl-Space"          : "autocomplete"

          "Cmd-Enter"           : => @emit "runCode"
          "Ctrl-Enter"          : => @emit "runCode"

          "Alt-Up"              : => @emit "loadPreviousFile"
          "Alt-Down"            : => @emit "loadNextFile"

      @cm.on "change", @lazyBound "emit", "change"

      @emit "ready"

  compile: (target)->
    console.warn "Implement ::compile method!"

  handleSave:-> no
  handleSaveAs:-> no