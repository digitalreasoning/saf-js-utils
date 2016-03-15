// Intented for tracking page loads for testing with selenium.
// AutoUI will inject a small script that listens for the `vm.page-loaded` event.
(function() {
    var debug = false;
    var activatedStack = [];
    var composedStack = [];
    // Triggered by all classes that implement app/core/utils/viewmodel-base.js
    window.addEventListener = typeof window.addEventListener === 'function' ? window.addEventListener : function() { };
    window.addEventListener('vm.deactivate', function(e) {
        logEvent('vm.deactivate', e.detail);
        var index = activatedStack.indexOf(e.detail);
        if (index === -1 && debug) { throw e.detail + ' has not been activated!!'; }
        activatedStack.splice(index, 1);
        printStacks();
    });
    window.addEventListener('vm.activate', function(e) {
        logEvent('vm.activate', e.detail);
        var index = activatedStack.indexOf(e.detail);
        if (index !== -1 && debug) { throw e.detail + ' is already activated!!'; }
        activatedStack.push(e.detail);
        // If we activate but the page is already composed check to see if we're done.
        if (composedStack.indexOf(e.detail) !== -1 && stacksEqual()) { pendingPageLoaded(); }
        printStacks();
    });
    window.addEventListener('vm.detached', function(e) {
        logEvent('vm.detached', e.detail);
        var index = composedStack.indexOf(e.detail);
        if (index === -1 && debug) { throw e.detail + ' has not been composed!!'; }
        composedStack.splice(index, 1);
        printStacks();
    });
    window.addEventListener('vm.compositionComplete', function(e) {
        logEvent('vm.compositionComplete', e.detail);
        var index = composedStack.indexOf(e.detail);
        if (index !== -1 && debug) { throw e.detail + ' is already composed!!'; }
        composedStack.push(e.detail);
        printStacks();
        if (stacksEqual()) { pendingPageLoaded(); }
    });
    // Waits briefly to see if another module is activated or removed.
    // If the stacks are equal then emit the page loaded event.
    var pendingPageLoaded = function() {
        // Sloppy but works for the time being.
        setTimeout(function() {
            if (!stacksEqual()) { return; }
            if (debug) { console.warn('vm.page-loaded'); }
            window.dispatchEvent(new Event('vm.page-loaded'));
        }, 500);
    };
    // Compares stacks to see if they contain the same modules.
    // Order is not important.
    var stacksEqual = function() {
        if (activatedStack.length !== composedStack.length) { return false; }
        for (var i = 0; i < activatedStack.length; i++) {
            var index = composedStack.indexOf(activatedStack[i]);
            if (index === -1) { return false; }
        }
        return true;
    };
    // Debugging functions.
    var printStacks = function() {
        if (!debug) { return; }
        console.log('Activated Stack: ' + activatedStack);
        console.log(' Composed Stack: ' + composedStack);
    };
    var logEvent = function(eventName, modId) {
        if (!debug) { return; }
        console.warn(eventName + Array(27 - eventName.length).join(' ') + ', ' + modId);
    };
})();
