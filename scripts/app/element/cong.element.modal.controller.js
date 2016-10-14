(function () {
    "use strict";

    angular.module('cong.element').controller('ModalController', ["$uibModalInstance", "element", "type", ModalController]);

    function ModalController($uibModalInstance, element, type) {
        var ctrl = this;
        ctrl.element = element;
        ctrl.type = type;

        ctrl.ok = ok;
        
        function  ok() {
            $uibModalInstance.close();
        }
    }
})();