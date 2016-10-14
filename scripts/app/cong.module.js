(function () {
    "use strict";

    angular.module("cong", ["ngRoute"]);

    angular.module("cong")
        .config(["$routeProvider", routeConfig]);

    function routeConfig($routeProvider) {
        $routeProvider
            .when("/list", {
                templateUrl: "list.html",
                controller: "ElementController",
                controllerAs: "ctrl"
            })
            .when("/readme", {
                templateUrl: "readme.html",
                controller: "ReadmeController",
                controllerAs: "ctrl"
            })
            .otherwise({
                redirectTo: "/list"
            });
    }
})();