
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

        modal = new KDModalView

          title         : "Confirmation required..."
          content       : """
            <div class='modalformline'>
              <p>Do you want to remove this script ?</p>
            </div>
          """

          cssClass      : "savefile-modal"
          width         : 305
          overlay       : yes

          buttons       :

            Remove      :
              style     : "kdbutton clean-gray"
              callback  : =>
                @getDelegate().emit "removeItem", this
                modal.destroy()

            Cancel      :
              style     : "kdbutton clean-gray"
              callback  : -> modal.destroy()
