
module.exports = class CPFileItem extends KDListItemView

  viewAppended: ->

    {name} = @getData()
    name = name.replace /^file\-/, ''

    @addSubView new KDView
      tagName : "h1"
      partial : name

    @addSubView new KDButtonView
      title    : "X"
      cssClass : 'clean-red'
      callback : =>
        @getDelegate().emit "removeItem", this
