define([
    'jquery', 
    'cookie',
    'app/core/utils/inheritance'
], function($, _cookies, Class) {
    //https://github.com/carhartl/jquery-cookie#json
    $.cookie.json = true;
    $.cookie.defaults = {
        expires: 365,
        path: '/'
    };

    var getData = function(namespace) {
        return $.cookie(namespace);
    };

    var State = Class.extend({
        namespace: '',
        init: function(namespace) {
            this.namespace = namespace || this.namespace;
            var data = getData(this.namespace);
            if (typeof data === 'undefined')
                $.cookie(this.namespace, { });
        },
        get: function(key) {
            var data = getData(this.namespace);
            return key ? data[key] : data;
        },
        set: function(key, val) {
            var data = getData(this.namespace);
            data[key] = val;
            $.cookie(this.namespace, data);
        }
    });
    return State;
});
