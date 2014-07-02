chrome.devtools.panels.create(
    "CoffeePad", "../images/coffeepad-icon.png", "index.html",
    function cb(panel) {
        panel.onShown.addListener(function(win){ win.focus(); });
    }
);