
CoffeeEditor     = require './coffeeeditor'
JSEditor         = require './jseditor'
Storage          = require './storage'
SaveFileModal    = require './savemodal'
CoffeePadHeader  = require './coffeepad-header'
CPFileItem       = require './fileitem'
CPMultipleChoice = require './multiplechoice'
CoffeeExamples   = require './examples'

module.exports = class CoffeePad extends KDView

  @Compilers = { "Coffee2Js", "Js2Coffee" }

  constructor:(options = {}, data)->

    options.cssClass = "main-view"
    options.bind     = "mousemove"
    super options, data

    @storage = new Storage()

    @header  = new CoffeePadHeader parent: this
    @header.appendToDomBody()

    @loadExamples()

  loadExamples:->

    @storage.filter /file\-/, (files)=>
      return if files.length > 0
      for example in CoffeeExamples
        @storage.setValue "file-#{example.title}", example.content

  viewAppended:->

    @coffeeEditor  = new CoffeeEditor

    @jsEditor      = new JSEditor
    @jsEditor.ready @bound 'attachListeners'

    @fileList = new KDListViewController
      selection    : yes
      viewOptions  :
        cssClass   : "file-list control"
        wrapper    : yes
        itemClass  : CPFileItem

    @fileListView = @fileList.getListView()

    @splitView     = new KDSplitView
      cssClass     : "split-view js-hidden"
      resizable    : yes
      sizes        : [ "50%", "50%" ]
      views        : [ @coffeeEditor, @jsEditor ]

    @multipleChoice = new CPMultipleChoice
      labels       : ['JavaScript', 'Js2Coffee', 'Files']
      cssClass     : 'options-button control'
      defaultValue : []
      multiple     : yes
      callback     : =>

        {added, removed} = @multipleChoice._lastOperation

        if 'JavaScript' is added
          @storage.setValue 'hideJs', no
          @splitView.showPanel 1, =>
            @jsEditor.cm.refresh()
            @jsEditor.cm.setOption "lineWrapping", yes
            @splitView.unsetClass "js-hidden"
          @splitView.options.sizes = ["50%", "50%"]

        else if 'JavaScript' is removed
          @storage.setValue 'hideJs', yes
          @jsEditor.cm.setOption "lineWrapping", no
          @hideJsPane()

        if 'Files' is added
          @setClass 'in'
          @storage.setValue 'hidePanel', no

        else if "Files" is removed
          @unsetClass 'in'
          @storage.setValue 'hidePanel', yes

        if 'Js2Coffee' is added
          @setCompiler CoffeePad.Compilers.Js2Coffee
          @storage.setValue 'js2coffee', yes
          new KDNotificationView title: "Coffee ⇠ Js selected"
        else if "Js2Coffee" is removed
          @setCompiler()
          @storage.setValue 'js2coffee', no
          new KDNotificationView title: "Coffee ⇢ Js selected"

        KD.utils.defer => @coffeeEditor.cm.focus()

    @addSubView @multipleChoice
    @addSubView @splitView

    @addSubView new KDButtonView
      title    : "+"
      cssClass : "clean-gray create-new control"
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
      cssClass : "clean-gray help control"
      callback : @bound 'toggleHelpMode'

    @addSubView @fileListView

    @addSubView new KDButtonView
      title    : "Run"
      cssClass : "clean-gray run-button control"
      callback : @bound 'runJsCode'

    @_body = $('body')

  mouseMove:->
    return unless @_body?
    @_body.removeClass 'hideControls'
    clearTimeout @controlTimer
    @controlTimer = KD.utils.wait 2000, =>
      console.log "Disable"
      @_body.addClass 'hideControls'


  attachListeners:->

    KD.utils.defer =>

      {hideJs, hidePanel, js2coffee} = @storage.data
      if not hideJs or hideJs is "false"
        @multipleChoice.setValue 'JavaScript'
      else
        @hideJsPane()

      if not hidePanel or hidePanel is "false"
        @multipleChoice.setValue 'Files'

      if js2coffee is "true"
        @multipleChoice.setValue 'Js2Coffee'


    @fileListView.on 'removeItem', (item)=>
      @coffeeEditor.fileName = null
      @storage.unsetKey item.data.name
      @updateFileList()

    @setCompiler CoffeePad.Compilers.Coffee2Js, yes

    @jsEditor.on     "runCode", @bound 'runJsCode'
    @coffeeEditor.on "runCode", @bound 'runJsCode'

    @jsEditor.on "toggleFiles", =>
      @multipleChoice.setValue 'Files'

    @coffeeEditor.on "toggleFiles", =>
      @multipleChoice.setValue 'Files'

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

      @coffeeEditor.openFile file  if file?

      @fileList.on 'ItemSelectionPerformed', (..., {items})=>

        if @coffeeEditor.fileName?
          @coffeeEditor.handleSave yes

        @coffeeEditor.openFile items.first.data.name

      @updateFileList file

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

    @loadExamples()
    prevFile = newname ? @fileList.first?.data?.name

    @storage.filter /file\-/, (files)=>

      @fileList.replaceAllItems files

      if prevFile
        for item in @fileList.itemsOrdered
          if item.data.name is prevFile
            @fileList.selectItem item
      else
        @fileList.selectItem @fileList.itemsOrdered.last


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


  setCompiler:(compiler = CoffeePad.Compilers.Coffee2Js, compile)->

    [source, target] = [@coffeeEditor, @jsEditor]
    if compiler is CoffeePad.Compilers.Js2Coffee
      [source, target] = [target, source]

    target.off "change"
    source.compile target  if compile
    source.on "change", ->
      source.compile target
