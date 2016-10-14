(function () {
    "use strict";

    angular.module("cong.element")
        .factory("Element", ["$http", "$timeout", "ROUTES", ElementFactory]);

    function ElementFactory($http, $timeout, ROUTES) {
        return {
            getAll: function () {
                return $http.get(ROUTES.getAll)
                    .then(returnDataFromXhr);
            },
            getTypes: function () {
                return $http.get(ROUTES.getTypes)
                    .then(returnDataFromXhr);
            },
            get: function (id) {
                var random = Math.random() * 1000;
                return $timeout(function () {
                    return $http.get(ROUTES.get, {
                        params: { id: id }
                    }).then(returnDataFromXhr);
                }, random);
            }
        };

        function returnDataFromXhr(response) {
            return response.data;
        }
    }
})();