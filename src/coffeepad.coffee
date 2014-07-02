
CoffeeEditor     = require './coffeeeditor'
JSEditor         = require './jseditor'
Storage          = require './storage'
SaveFileModal    = require './savemodal'
CoffeePadHeader  = require './coffeepad-header'
CPFileItem       = require './fileitem'
CPMultipleChoice = require './multiplechoice'

module.exports = class CoffeePad extends KDView

  constructor:(options = {}, data)->

    options.cssClass = "main-view"
    super options, data

    @storage = new Storage()

    @header  = new CoffeePadHeader parent: this
    @header.appendToDomBody()

  viewAppended:->

    @coffeeEditor  = new CoffeeEditor

    @jsEditor      = new JSEditor
    @jsEditor.ready @bound 'attachListeners'

    @fileList = new KDListViewController
      selection    : yes
      viewOptions  :
        cssClass   : "file-list"
        wrapper    : yes
        itemClass  : CPFileItem

    @fileListView = @fileList.getListView()

    @splitView     = new KDSplitView
      cssClass     : "split-view js-hidden"
      resizable    : yes
      sizes        : [ "50%", "50%" ]
      views        : [ @coffeeEditor, @jsEditor ]

    @multipleChoice = new CPMultipleChoice
      labels       : ['JavaScript', '...']
      cssClass     : 'options-button'
      defaultValue : []
      multiple     : yes
      callback     : =>

        {added, removed} = @multipleChoice._lastOperation

        if "JavaScript" is added
          @storage.setValue 'hideJs', no
          @splitView.showPanel 1, =>
            @jsEditor.cm.refresh()
            @jsEditor.cm.setOption "lineWrapping", yes
            @splitView.unsetClass "js-hidden"
          @splitView.options.sizes = ["50%", "50%"]

        if "JavaScript" is removed
          @storage.setValue 'hideJs', yes
          @jsEditor.cm.setOption "lineWrapping", no
          @hideJsPane()

        if "..." is added
          @setClass 'in'
          @storage.setValue 'hidePanel', no

        if "..." is removed
          @unsetClass 'in'
          @storage.setValue 'hidePanel', yes

        KD.utils.defer => @coffeeEditor.cm.focus()

    KD.utils.defer =>

      {hideJs, hidePanel} = @storage.data
      if not hideJs or hideJs is "false"
        @multipleChoice.setValue 'JavaScript'
      else
        @hideJsPane()

      if not hidePanel or hidePanel is "false"
        @multipleChoice.setValue '...'

    @addSubView @multipleChoice
    @addSubView @splitView

    @addSubView new KDButtonView
      title    : "+"
      cssClass : "clean-gray create-new"
      callback : => @jsEditor.ready =>

        @coffeeEditor.handleSave yes

        new SaveFileModal (err, fileName)=>
          fileName = "file-#{fileName}"
          if err
            @coffeeEditor.cm.focus()
          else
            @coffeeEditor.cm.getDoc().clearHistory()
            @coffeeEditor.cm.setValue ""
            @coffeeEditor.saveFile fileName

    @addSubView new KDButtonView
      title    : "?"
      cssClass : "clean-gray help"
      callback : @bound 'toggleHelpMode'

    @addSubView @fileListView

    @addSubView new KDButtonView
      title    : "Run"
      cssClass : "clean-gray run-button"
      callback : @bound 'runJsCode'


  attachListeners:->

    @fileListView.on 'removeItem', (item)=>
      @storage.unsetKey item.data.name
      @updateFileList()

    @coffeeEditor.compile @jsEditor

    @coffeeEditor.on "change", =>
      @coffeeEditor.compile @jsEditor

    @jsEditor.on     "runCode", @bound 'runJsCode'
    @coffeeEditor.on "runCode", @bound 'runJsCode'

    @jsEditor.on "toggleFiles", =>
      @multipleChoice.setValue '...'

    @coffeeEditor.on "toggleFiles", =>
      @multipleChoice.setValue '...'

    @jsEditor.on "toggleJs", =>
      @multipleChoice.setValue 'JavaScript'

    @coffeeEditor.on "toggleJs", =>
      @multipleChoice.setValue 'JavaScript'

    @jsEditor.on "toggleHelper", @bound 'toggleHelpMode'
    @coffeeEditor.on "toggleHelper", @bound 'toggleHelpMode'

    @coffeeEditor.on "loadPreviousFile", @lazyBound 'loadFileAtDirection', -1
    @coffeeEditor.on "loadNextFile",     @lazyBound 'loadFileAtDirection', 1

    @coffeeEditor.on "fileSaved", @bound 'updateFileList'

    @storage.getValue "lastFile", (file)=>

      if not file or not @storage.data[file]?
        file = @createNewFile()

      @coffeeEditor.openFile file
      @updateFileList file

      @fileList.on 'ItemSelectionPerformed', (..., {items})=>
        @coffeeEditor.handleSave yes
        @coffeeEditor.openFile items.first.data.name


  toggleHelpMode:->

    body = $('body')
    if body.hasClass 'helpMode'
      body.removeClass 'helpMode'
      @coffeeEditor.cm.focus()
    else
      body.addClass 'helpMode'
      @header.filterView.setFocus()


  loadFileAtDirection:(direction)->

    items = @fileList.itemsOrdered
    return  if items.length < 2

    return  unless @fileList.selectedItems
    activeFile =   @fileList.selectedItems.first

    for item, i in items

      if item.data.name is activeFile.data.name

        nextIndex = i + direction

        if nextIndex < 0
          nextIndex = items.length - 1
        else if nextIndex is items.length
          nextIndex = 0

        @fileList.selectItem items[nextIndex]

        break


  createNewFile:->

    file = "file-Coffee-#{new Date().format("d-mm HH:MM:ss")}"
    @coffeeEditor.cm.getDoc().clearHistory()
    @coffeeEditor.cm.setValue ""
    @coffeeEditor.saveFile file
    return file


  updateFileList:(newname)->

    prevFile = newname ? @fileList.first?.data?.name
    @storage.filter /file\-/, (files)=>
      @fileList.replaceAllItems files

      if files.length is 0
        @coffeeEditor.openFile file = @createNewFile()
        return @updateFileList file

      if prevFile
        for item in @fileList.itemsOrdered
          if item.data.name is prevFile
            @fileList.selectItem item


  runJsCode:->

    codeToEval = @jsEditor.cm.getValue()

    if chrome?.devtools?.inspectedWindow?
      { inspectedWindow } = chrome.devtools
      inspectedWindow.eval codeToEval, (err, exception)->
        if exception?.isException
          inspectedWindow.eval "console.error('#{exception.value}');"
    else
      eval codeToEval


  hideJsPane:->

    @splitView.hidePanel 1
    @splitView.setClass "js-hidden"
    @splitView.options.sizes = ["100%", "0%"]
