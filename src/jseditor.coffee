
CodeEditor = require './editor'

module.exports = class JSEditor extends CodeEditor

  constructor:->
    super
      mode : "javascript"

  compile:(target)->

    try
      target.cm.setValue js2coffee.build @cm.getValue()
    catch error
      console.warn error  if @getOption 'logToConsole'

  handleSave:-> no