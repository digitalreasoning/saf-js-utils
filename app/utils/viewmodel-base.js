define([
    'jquery',
    'app/core/utils/inheritance',
    'durandal/app',
    'underscore'
], function($, Class, app) {
    var ViewModelBaseClass = Class.extend({
        _active: false,
        $view: null,
        init: function() {
            // When binding events bind them to the object below. 
            // The events will automatically be unbound when
            // the viewmodel is deactivated.
            this.subscriptions = { };
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
                if (this.setRoot) throw "Invalid event binding. Try app.on('some string').then(function() ... );"
                this.off();
            });
            this.subscriptions = { };
        }
    });
    return ViewModelBaseClass;
});
