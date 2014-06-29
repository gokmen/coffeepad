
module.exports = class SaveFileModal extends KDModalViewWithForms

  constructor: (callback)->

    options =
      title                  : "Enter a fancy name..."
      overlay                : yes
      width                  : 305
      height                 : "auto"
      cssClass               : "savefile-modal"
      tabs                   :
        navigable            : yes
        forms                :
          saveForm           :
            callback         : =>
              callback null, @modalTabs.forms.saveForm.inputs.fileName.getValue()
              @destroy()
            buttons          :
              Save           :
                title        : "Save"
                cssClass     : "clean-gray"
                type         : "submit"
            fields           :
              fileName       :
                name         : "fileName"
                placeholder  : "File name"
                validate     :
                  rules      :
                    required : yes
                  messages   :
                    required : "File name required!"

    super options

    @on 'ModalCancelled', -> callback cancel: yes

  viewAppended:->
    super
    @modalTabs.forms.saveForm.inputs.fileName.setFocus()
    $(window).on "keydown.modal",(e)=>
      @cancel() if e.which is 27
