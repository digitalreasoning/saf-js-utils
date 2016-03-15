define([
    'jquery',
    'app/core/utils/inheritance',
    'durandal/app',
    'underscore'
], function($, Class, app) {
    var ViewModelBaseClass = Class.extend({
        init: function() {
            this._active = false;
            this.$view = null;
            // When binding events bind them to the object below.
            // The events will automatically be unbound when
            // the viewmodel is deactivated.
            this.subscriptions = { };

            // Trigger events when a module is activated and finished rendering.
            // This will mainly be used for testing.
            // This side-steps the inheritance model to ensure the methods are ran.
            // In the event someone forgets to use this._super these functions will still be called.
            // Also these events need to trigger once the functions are complete vs. when they start.
            var wrapLifecycleCallback = function(methodName) {
                this['_' + methodName] = this[methodName] || function() { return true; };
                this[methodName] = function() {
                    var retVal = this['_' + methodName].apply(this, arguments);
                    if (typeof window.dispatchEvent === 'function' && typeof window.CustomEvent === 'function') {
                        window.dispatchEvent(new CustomEvent('vm.' + methodName, { detail: this.__moduleId__ }));
                    }
                    return retVal;
                };
            };

            // Activation Lifecycle
            // wrapLifecycleCallback.call(this, 'canDeactivate');
            // wrapLifecycleCallback.call(this, 'canActivate');
            wrapLifecycleCallback.call(this, 'deactivate');
            wrapLifecycleCallback.call(this, 'activate');

            // Composition Lifecycle
            // wrapLifecycleCallback.call(this, 'binding');
            // wrapLifecycleCallback.call(this, 'bindingComplete');
            // wrapLifecycleCallback.call(this, 'attached');
            wrapLifecycleCallback.call(this, 'detached');
            wrapLifecycleCallback.call(this, 'compositionComplete');
        },
        activate: function() {
            this._active = true;
        },
        attached: function(view, parent) {
            this.$view = $(view);
        },
        // this.subscriptions.resize = app.on('window.resize').then(function() {
        //     // whatever you want to do here
        // });
        // When the VM is deactivated all the events will be unbound.
        deactivate: function() {
            this.unbindSubscriptions();
            this._active = false;
        },
        bindEvents: function() {
            this.unbindSubscriptions();
        },
        unbindSubscriptions: function() {
            $.each(this.subscriptions, function() {
                // Someone may accidentally add the app object
                // here, make sure we don't unbind from the app.
                if (this.setRoot) throw "Invalid event binding. Try app.on('some string').then(function() ... );";
                this.off();
            });
            this.subscriptions = { };
        }
    });
    return ViewModelBaseClass;
});
