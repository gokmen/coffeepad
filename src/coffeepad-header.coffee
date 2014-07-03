
class CPShortcutItemView extends KDListItemView

  Mac = navigator.userAgent.indexOf("Mac OS X") > -1

  partial :->

    [title, shortcut] = @getData()

    scs  = ""
    for shortcut in shortcut.split " "
      scs += " "
      scs += "<cite>#{sc}</cite>+" for sc in shortcut.split("+")
      scs  = scs.replace /\+$/, ""

    unless Mac
      scs  = scs.replace /\Cmd/, "super"

    """<h2>#{title}</h2>
       <div class='shortcuts'>#{scs}</div>"""

module.exports = class CoffeePadHeader extends KDView

  CoffeePadShortcuts = [
    ["Run"                      , "Cmd+Enter"]
    ["Save"                     , "Cmd+S"]
    ["Save As"                  , "Cmd+Shift+S"]
    ["Show Help"                , "Ctrl+H"]
    ["Toggle File List"         , "Ctrl+O"]

    ["Select Next File"         , "Alt+Down"]
    ["Select Previous File"     , "Alt+Up"]

    ["Toggle Javascript editor" , "Ctrl+J"]
    ["Autocomplete if possible" , "Ctrl+Space"]
    ["Go Subword Left"          , "Alt+Left"]
    ["Go Subword Right"         , "Alt+Right"]
    ["Scroll Line Up"           , "Cmd+Up"]
    ["Scroll Line Down"         , "Cmd+Down"]
    ["Split Selection ByLine"   , "Shift+Cmd+L"]
    ["Indent Less"              , "Shift+Tab"]
    ["Single Selection Top"     , "Esc"]
    ["Select Line"              , "Cmd+L"]
    ["Delete Line"              , "Shift+Cmd+K"]
    # ["Insert Line After"        , "Cmd+Enter"]
    ["Insert Line Before"       , "Shift+Cmd+Enter"]
    ["Select Next Occurrence"   , "Cmd+D"]
    ["Select Scope"             , "Shift+Cmd+Space"]
    ["Select Between Brackets"  , "Shift+Cmd+M"]
    ["Go To Bracket"            , "Cmd+M"]
    ["Swap Line Up"             , "Shift+Cmd+Up"]
    ["Swap Line Down"           , "Shift+Cmd+Down"]
    ["Toggle Comment"           , "Cmd+/"]
    ["Join Lines"               , "Cmd+J"]
    ["Duplicate Line"           , "Shift+Cmd+D"]
    ["Transpose Chars"          , "Cmd+T"]
    ["Sort Lines"               , "F9"]
    ["Sort Lines Insensitive"   , "Cmd+F9"]
    ["Next Bookmark"            , "F2"]
    ["Prev Bookmark"            , "Shift+F2"]
    ["Toggle Bookmark"          , "Cmd+F2"]
    ["Clear Bookmarks"          , "Shift+Cmd+F2"]
    ["Select Bookmarks"         , "Alt+F2"]
    ["Wrap Lines"               , "Alt+Q"]
    ["Select Lines Upward"      , "Shift+Alt+Up"]
    ["Select Lines Downward"    , "Shift+Alt+Down"]
    ["Find Under"               , "Cmd+F3"]
    ["Find Under Previous"      , "Shift+Cmd+F3"]
    ["Fold"                     , "Shift+Cmd+["]
    ["Unfold"                   , "Shift+Cmd+]"]
    ["Replace"                  , "Cmd+H"]
    ["Del Line Left"            , "Ctrl+K Cmd+Backspace"]
    ["Del Line Right"           , "Ctrl+K Cmd+K"]
    ["Upcase At Cursor"         , "Ctrl+K Cmd+U"]
    ["Downcase At Cursor"       , "Ctrl+K Cmd+L"]
    ["Set Sublime Mark"         , "Ctrl+K Cmd+Space"]
    ["Select To SublimeMark"    , "Ctrl+K Cmd+A"]
    ["Delete To SublimeMark"    , "Ctrl+K Cmd+W"]
    ["Swap With SublimeMark"    , "Ctrl+K Cmd+X"]
    ["Sublime Yank"             , "Ctrl+K Cmd+Y"]
    ["Clear Bookmarks"          , "Ctrl+K Cmd+G"]
    ["Show In Center"           , "Ctrl+K Cmd+C"]
    ["Unfold All"               , "Ctrl+K Cmd+j"]
    ["Unfold All"               , "Ctrl+K Cmd+0"]
  ]

  constructor:(options = {})->
    options.cssClass = 'cp-header'
    super options

  viewAppended: ->

    @addSubView new KDView
      cssClass : 'header-logo'
      partial  : "<img src='images/coffeepad-logo.png'/>"

    @addSubView new KDView
      cssClass : 'readme'
      partial  : """
        <p>CoffeePad is actually nothing more than putting some awesome pieces together.
        It provides live compiling for CoffeeScript to JavaScript with hints.</p>

        <p>It's built with <a href="https://koding.com">Koding</a>'s Framework
        <a href="https://github.com/koding/kd">KD</a>, uses
        <a href="http://codemirror.net/">CodeMirror</a> as editor and
        <a href="http://coffeescript.org">CoffeeScript</a>'s browser compiler.</p>

        <p>It can be used as <a href="https://chrome.google.com/webstore/detail/coffeepad/iomhnnbecciohkiilfebodfghbnpoopf">Chrome extension</a> or a standalone web app from <a href="http://coffeepad.co/">coffeepad.co</a>.
        It keeps everyting in <code>localStorage</code> even in Chrome extension, which means there is no server dependency. Everything happens in your browser.</p>

        <p>You can fork it from <a href="https://github.com/gokmen/coffeepad">https://github.com/gokmen/coffeepad</a></p>
      """

    @addSubView @filterView = new KDInputView
      title       : "Filter"
      placeholder : "filter shortcuts"

      keyup       : =>

        val = @filterView.getValue().replace /cmd/, "⌘"
        res = CoffeePadShortcuts.filter (item)->
          ((item.join "").toLowerCase().indexOf val) > -1

        @shortcutController.replaceAllItems res

    @addSubView new KDButtonView
      title    : "X"
      cssClass : "clean-gray close-help"
      callback : @parent.bound 'toggleHelpMode'

    @shortcutController = new KDListViewController
      viewOptions  :
        itemClass  : CPShortcutItemView

    @shortcutController.replaceAllItems CoffeePadShortcuts

    @addSubView @shortcutController.getView()
