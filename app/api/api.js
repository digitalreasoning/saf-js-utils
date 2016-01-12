define([
    'jquery',
    'underscore',
    'moment',
    'knockout',
    'durandal/app',
    'app/core/api/services/generic'
], function($, _, moment, ko, app, GenericService) {
    var self = {
        ajax: function(options) {
            var settings = $.extend({
                // defaults here
            }, options);
            settings.url = SAF.paths.root + '/' + settings.url;
            return GenericService.ajax(settings).then(function(data) {
                if (!data || !data.success) return $.Deferred().reject(data).promise();  
                return data;
            });
        },
        kgs: function() {
            return self.ajax({
                url: 'core/kgs'
            }).then(function(data) {
                return data.payload.kgs;
            });
        },
        user: function() {
            return self.ajax({
                url: 'users/self'
            }).then(function(data) {
                return data.payload.user;  
            });
        },
        userHasPerms: function(options) {
            var $deferred = $.Deferred();
            var settings = $.extend({
                permission: null
                // TODO: We could do this in the future if we want multiple permissions
                // perms: [ ... ]
            }, options);
            return self.ajax({
                url: 'users/permissions/' + encodeURIComponent(settings.permission)
            }).then(function(data, status, xhr) {
                if (data.success && data.payload.permitted)
                    $deferred.resolve(true);
                else
                    $deferred.resolve(false);
            }).fail(function() {
                $deferred.resolve(false);
            });
        },
        findUserByUsername: function(username) {
            return self.ajax({
                url: 'users/search/username/' + encodeURIComponent(username)
            }).then(function(data) {
                return data.payload.user;   
            });
        },
        findUserById: function(id) {
            return self.ajax({
                url: 'users/search/id/' + encodeURIComponent(id)
            }).then(function(data) {
                return data.payload.user;
            });
        },
        findUsersByTerm: function(term, options) {
            var settings = $.extend({
                limit: 20
            }, options);
            return self.ajax({
                url: 'users/search/term/' + encodeURIComponent(term),
                data: {
                    limit: settings.limit
                }
            }).then(function(data) {
                return data.payload.users;   
            });
        },
        timeFormat: 'YYYY-MM-DD hh:mm:ss',
        parseTime: function(obj) {
            if (typeof obj === 'object')
                obj = obj.format(self.timeFormat);
            return obj;
        },
        apiError: function(msgTitle, msgBody, fullError){
            GenericService.serviceError(msgTitle, msgBody, fullError);
        }
    };
    return self;
});
