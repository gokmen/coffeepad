
module.exports = class CPMultipleChoice extends KDMultipleChoice

  setValue:(label, wCallback = yes)->

    @_lastOperation = if label in @currentValue
    then removed: label else added: label

    super
