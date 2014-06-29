
CodeEditor     = require './editor'
SaveFileModal  = require './savemodal'

module.exports = class CoffeeEditor extends CodeEditor

  constructor:->
    super mode : "coffeescript"
    @histories = {}

    @once 'viewAppended', =>

      $(window).on "keydown", (e)=>

        if e.which is 27
          $('body').removeClass 'helpMode'
          @cm.focus()

  openFile:(file)-> @ready =>

    return unless file

    @histories[@fileName] = @cm.getDoc().getHistory()

    @storage.getValue file, (content = "")=>

      @cm.getDoc().clearHistory()
      @cm.setValue content

      if @histories[file]?
        @cm.getDoc().setHistory @histories[file]

      @fileName = file
      @storage.setValue "lastFile", file

      @cm.focus()

  compile:(target)->

    try
      target.cm.setValue CoffeeScript.compile @cm.getValue(), bare: yes
    catch error
      console.warn error  if @getOption 'logToConsole'

  saveFile: (fileName, silence = no)->

    @storage.setValue fileName, @cm.getValue(), =>

      @storage.setValue "lastFile", fileName
      @fileName = fileName

      unless silence

        name = @fileName.replace /^file\-/, ''

        new KDNotificationView
          title : "saved to #{name}..."
          type  : "tray"

        @emit "fileSaved", @fileName

      @cm.focus()

  handleSaveAs:(silence = no)->

    new SaveFileModal (err, fileName)=>
      fileName = "file-#{fileName}"
      if err then @cm.focus() else @saveFile fileName, silence

  handleSave:(silence = no)->

    unless @fileName
      @handleSaveAs silence
    else
      @saveFile @fileName, silence
