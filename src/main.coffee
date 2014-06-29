
# Coffeepad
# 2014 - Gokmen Goksel <gokmen@goksel.me>

# Followings used in this sotware:
#
# CoffeeScript : https://github.com/jashkenas/coffeescript
# KDFramework  : https://github.com/koding/kd
# CodeMirror   : https://github.com/marijnh/CodeMirror
# Node.js      : https://github.com/joyent/node
# Gulp         : https://github.com/gulpjs/gulp
# Stylus       : https://github.com/learnboost/stylus

do ->

  CoffeePad = require './coffeepad'
  (new CoffeePad).appendToDomBody()
