
class Storage

  constructor:->
    @data = {}

  setValue: (key, value, callback)->
    oldValue = @data[key]
    @data[key] = value
    @onChangeFn? key, oldValue, value
    callback? null

  getValue: (key, callback)->
    callback @data[key]

  getAll: (callback)->
    callback @data

  unsetKey: (key)->
    delete @data[key]

  onChange: (@onChangeFn = ->)->

  filter: (reg, callback)->

    result = []
    for key in Object.keys @data when reg.test key
      result.push name: key, value: @data[key]

    callback result


class ChromeStorage extends Storage

  constructor:->
    super

    chrome.storage.onChanged.addListener (changes)=>
      return unless @onChangeFn?
      for key, change of changes
        @onChangeFn key, change.oldValue, change.newValue

  setValue: (key, value, callback = ->)->

    data = {}
    data[key] = value

    chrome.storage.sync.set data, callback


  getValue: (key, callback = ->)->
    return callback null  unless key

    chrome.storage.sync.get key, (item)->
      callback item?[key] or null


  getAll: (callback = ->)->
    chrome.storage.sync.get null, callback


class LocalStorage extends Storage

  constructor:->
    @data = window.localStorage

    storageHandler = (event)=>
      {key, oldValue, newValue} = event
      @onChangeFn? key, oldValue, newValue

    if window.addEventListener?
      window.addEventListener "storage", storageHandler, no
    else
      window.attachEvent "onstorage", storageHandler

  setValue: (key, value, callback)->

    @data.setItem key, value
    callback? null

  unsetKey: (key)->
    @data.removeItem key

# Chrome.storage has issues with devtools.panels, until its fixed
# keep using LocalStorage instead
# if chrome?.storage? then module.exports = ChromeStorage
if window.localStorage?
then module.exports = LocalStorage
else module.exports = Storage