define(['jquery', 'app/core/utils/inheritance'], function($, Class) {
    var Default = Class.extend({
        init: function(data) {
            // Add all the properties of the data
            // to the class. Subclasses should be
            // defining default values that will
            // be overwritten by this extend.
            if (data)
                $.extend(true, this, data); 
        }
    });
    return Default;
});
