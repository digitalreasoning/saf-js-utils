define(function() {
    var settings = {
        appRoot: "/",
        appLogin: "login",
        documentTitle: "Synthesys",
        modules: {
            core: {
                timeline: {
                    // Refer here for options
                    // http://momentjs.com/docs/#/durations/
                    forward:  { 'years':  1 },
                    backward: { 'years':  5 }
                }
            }
        }
    };
    return settings;
});
