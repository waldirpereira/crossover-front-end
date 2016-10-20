(function () {
    "use strict";

    angular.module("cong.element")
        .controller("ElementController", ["$document", "$location", "$uibModal", "ROUTES", "Element", ElementController]);

    function ElementController($document, $location, $uibModal, ROUTES, Element) {
        var ctrl = this;

        ctrl.elementSelected = null;
        ctrl.elementsList = [];
        ctrl.status = {
            loading: false,
            loadingElement: false
        };
        ctrl.types = {};
        ctrl.chartLabels = ["passed", "not passed"];
        
        // Public methods
        ctrl.open = open;
        ctrl.getSortedEnvironments = getSortedEnvironments;
        ctrl.openTests = openTests;
        ctrl.openDetailsModalForSelectedElement = openDetailsModalForSelectedElement;
        ctrl.openReadme = openReadme;

        init();

        // Initialization of the controller
        function init() {
            Element.getTypes().then(function (types) {
                angular.extend(ctrl.types, types);
                updateElementsList();
            });
        }

        // Call service to get all elements for the list
        function updateElementsList() {
            Element.getAll().then(function (elementsList) {
                ctrl.elementsList = elementsList;
            });
        }

        // Sort environments by name
        // Just for testing pourpose, since it is easier to use orderBy on ng-repeat expression
        function getSortedEnvironments() {
            var compare = function(a, b) {
                if (a < b)
                    return -1;
                if (a > b)
                    return 1;
                return 0;
            };
            ctrl.types.environments.sort(function (a, b) { return compare(a.name, b.name); });

            return ctrl.types.environments;
        }

        // Call service to get details for the selected element
        function open(id) {
            var extend = function(obj1, obj2) {
                for (var i in obj2) {
                    obj1[i] = obj2[i];
                }
                return obj1;
            };

            if (ctrl.elementSelected && ctrl.elementSelected.id === id) {
                return;
            }

            ctrl.elementSelected = ctrl.elementsList.filter(function (e) { return e.id === id; })[0];
            ctrl.status.loadingElement = true;

            Element.getAll().then(function (elementsList) {
                ctrl.elementsList = elementsList;
            });

            Element.get(id)
                .then(function (details) {
                    ctrl.elementSelected = extend({
                        details: details
                    }, ctrl.elementSelected);
                })
                .finally(function () {
                    ctrl.status.loadingElement = false;
                });
        }

        // Open the details modal
        function openDetailsModalForSelectedElement(type) {
            $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'modal.html',
                controller: 'ModalController',
                controllerAs: 'ctrl',
                resolve: {
                    element: ctrl.elementSelected,
                    type: function() {
                        return type;
                    }
                }
            });
        }

        // Redirect to README file route
        function openReadme() {
            $location.path("/readme");
        }

        // Redirect the browser URL to test page
        function openTests() {
            $document[0].location.href = ROUTES.testingPage;
        }
    }
})();