(function () {
    "use strict";

    angular.module("cong")
        .directive("congReadme", ["$compile", "ROUTES", "TemplateService", congReadme]);

    function congReadme($compile, ROUTES, TemplateService) {
        return {
            restrict: 'E',
            link: function (scope, element) {

                TemplateService.getTemplate(ROUTES.readmeFile).then(function (response) {
                    var readme = response.data;
                    var pre = $("<PRE/>").html(readme);
                    element.html(pre);
                    $compile(element.contents())(scope);
                });
            }
        };
    }
})();

