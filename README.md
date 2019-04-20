**Archived project. No maintenance.**

This project is not maintained anymore and is archived. Feel free to fork and make your own changes if needed.

# CoffeePad [coffeepad.rocks](http://coffeepad.rocks/)
### CoffeeScript editor in your browser

<img width="100%" align="center"
     src="https://raw.githubusercontent.com/gokmen/coffeepad/master/src/images/screenshot.png" />

CoffeePad is actually nothing more than putting some awesome pieces together.
It provides live compiling for CoffeeScript to JavaScript with hints.

It's built with [Koding](https://koding.com)'s Framework
[KD](https://github.com/koding/kd), uses
[CodeMirror](http://codemirror.net/) as editor and
[CoffeeScript](http://coffeescript.org)'s browser compiler.

It can be used as [Chrome extension](https://chrome.google.com/webstore/detail/coffeepad/iomhnnbecciohkiilfebodfghbnpoopf) or a standalone web app from [coffeepad.rocks](http://coffeepad.rocks/).
It keeps everyting in `localStorage` even in Chrome extension, which means there is no server dependency. Everything happens in your browser.

You can fork it from https://github.com/gokmen/coffeepad

## Try locally

- Assuming that you already installed [Node.js](http://nodejs.org)

```
 git clone git@github.com:gokmen/coffeepad.git coffeepad
 cd coffeepad
 npm start
````

then open `http://localhost:1903` in your browser

Have fun!
