(function () {
    "use strict";
    angular.module("cong.element")
        .component('progressbox', {
            bindings: {
                status: '<'
            },
            controller: function () {
                var ctrl = this;
                ctrl.resolveClass = function (state) {
                    return state ? state.toLowerCase() : "rejected";
                };
            },
            template: [
                "<div class=\"progress-box\">",
                "   <div class=\"progress-inner\" ng-class=\"$ctrl.resolveClass($ctrl.status.state)\" style=\"width: {{$ctrl.status.percentage*100}}%;\"></div>",
                "</div>"
            ].join("")
        });


    angular.module("cong.element")
        .component('detailbox', {
            transclude: true,
            bindings: {
                success: '<'
            },
            controller: function () {
                var ctrl = this;
                ctrl.resolveClass = function (success) {
                    success = success === undefined ? true : success;
                    return success ? "complete" : "rejected";
                };
            },
            template: [
                "<div class=\"detail-box\" ng-class=\"$ctrl.resolveClass($ctrl.success)\" ng-transclude>",
                "</div>"
            ].join("")
        });


    angular.module("cong.element")
        .component('boxtitle', {
            transclude: true,
            bindings: {},
            template: [
                "<span class=\"box-title\" ng-transclude>",
                "</span>"
            ].join("")
        });
})();