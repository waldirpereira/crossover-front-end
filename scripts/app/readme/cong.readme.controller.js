(function () {
    "use strict";
    
    angular.module("cong.element")
        .controller("ReadmeController", ["$location", ReadmeController]);

    function ReadmeController($location) {
        var ctrl = this;

        ctrl.openList = openList;

        function openList() {
            $location.path("/list");
        }
    }
})();