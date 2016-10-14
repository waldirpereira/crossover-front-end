(function () {
    "use strict";

    angular.module("cong.test", ["cong"]);

    angular.module("cong.test")
        .directive("congTestResults", ["$compile", congTestResults]);

    function congTestResults($compile) {
        return {
            restrict: 'E',
            link: function (scope, element) {
                var html = '<div></div>';
                var e = $compile(html)(scope);
                element.replaceWith(e);

                $(".jasmine_html-reporter").appendTo(e);
            }
        };
    }
})();

