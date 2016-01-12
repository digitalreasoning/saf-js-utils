// This file describes the endpoint to the synthesys server servlets
// and with what options it should be reached.
// You may pass in options to the ajax function to
// override the defaults below.
define([
    'jquery',
    'settings',
    'app/core/api/services/generic'
], function($, appSettings, GenericApi) {
    return {
        // Default settings for synthesys server requests
        defaults: {
            url: "glance/query",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            data: {
                knowledge_base: ''
            }
        },
        ajax: function(options) {
            return GenericApi.ajax($.extend(true, { }, this.defaults, options));
        },
        getDefaults: function() {
            return $.extend(true, { }, this.defaults);
        }
    };
});
