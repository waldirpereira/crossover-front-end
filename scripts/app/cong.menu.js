(function () {
    "use strict";

    angular.module("cong")
        .directive("congMenu", ["$compile", "ROUTES", "TemplateService", congMenu]);

    function congMenu($compile, ROUTES, TemplateService) {
        return {
            restrict: 'E',
            link: function (scope, element) {

                TemplateService.getTemplate(ROUTES.menuTemplate).then(function (response) {
                    var menu = response.data;
                    element.html(menu);
                    $compile(element.contents())(scope);
                });
            }
        };
    }
})();

