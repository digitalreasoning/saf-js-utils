define(['app/core/utils/viewmodel-base'], function(VMBaseClass) {
    var ModuleBaseClass = VMBaseClass.extend({
        activate: function() {
            this._super();
            this.router.guardRoute = function(instance, instruction) {
                return (instance.canRoute && instance.canRoute(instruction)) || true;
            };
        }
    });
    return ModuleBaseClass;
});
