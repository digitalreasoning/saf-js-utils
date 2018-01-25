// This file is for the application level configuration.
// Services should be using this file for ajax calls.
// Services may then pass in their own configuration options to
// override the defaults below.
define([
    'jquery'
], function($) {
    var self = {
        defaults: {
            // Default settings across all modules
            cache: false,
            type: 'GET',
            success: function(result) {
                if (result.authenticated === false) {
                    if (typeof this.unauthenticatedAction === 'function') { this.unauthenicatedAction(); }
                    // Don't override this function only the one above.
                    this.afterUnauthenticatedAction();
                }
            },
            error: function(http, state, msg) {
              if ([401].indexOf(http.status) !== -1) {
                this.afterUnauthenticatedAction();
              }
            },
            // Default response to an unauthenticated json request. Simple redirect to /apps/login
            afterUnauthenticatedAction: function() {
                window.location.reload();
            }
        },
        // Call this function with standard $.ajax options object
        // to override any settings you want.
        ajax: function(options) {
            return $.ajax($.extend(true, { }, this.defaults, options)).done(function(resp) {
                return resp;
            }).fail(function(resp){
                return resp;
            });
        },
        serviceError: function(title, msg, stacktrace) {
            var errModal = $('#statusCodeModal');
            var errModalTitle = $('#statusCodeModalTitle');
            var errModalBody = $('#statusCodeModalBody');
            var errModalDetailContainer = $('#statusCodeModalDetailContainer');
            var errModalDetails = $('#statusCodeModalDetails');
            errModalTitle.text(title);
            errModalBody.text(msg);
            if(stacktrace){
                errModalDetails.text(stacktrace);
                errModalDetailContainer.show();
            }
            errModal.modal('show');
        }
    };
    return self;
});
