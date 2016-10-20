describe('ElementController', function () {
    var elementController;

    beforeEach(function () {
        module('cong.element');
    });

    var ROUTES = {
        getAll: 'getAll path'
    };
    beforeEach(module('cong', function ($provide) {
        $provide.constant('ROUTES', ROUTES);
    }));

    it('Should have a ElementController controller', function () {
        expect("cong.element.ElementController").toBeDefined();
    });

    describe('Testing routes', function () {
        var location, route, rootScope;

        beforeEach(inject(function (_$location_, _$route_, _$rootScope_) {
            location = _$location_;
            route = _$route_;
            rootScope = _$rootScope_;
        }));

        beforeEach(inject(function ($httpBackend) {
            $httpBackend.expectGET('list.html')
            .respond(200);
        }));

        it('Should load the list page on successful load of /list and with ElementController', function () {
            location.path('/list');
            rootScope.$digest();
            expect(route.current.controller).toBe('ElementController');
        });

        it('Should load the list page on access root page', function () {
            location.path('/');
            rootScope.$digest();
            expect(route.current.controller).toBe('ElementController');
        });
    });

    describe('Testing Service', function () {
        it('Should have a working Element service', inject(['Element',
            function (Element) {
                expect(Element.getAll).not.toEqual(null);
                expect(Element.get).not.toEqual(null);
                expect(Element.getTypes).not.toEqual(null);
            }])
        );
    });

    describe('Testing Controller', function () {

        var passPromise;
        var elementServiceMock;
        var $controller;

        beforeEach(inject(function (_$controller_) {
            $controller = _$controller_;

            elementServiceMock = {};
            elementServiceMock.getAll = function () { return { then: function() { return "getAll"; } }; };
            elementServiceMock.getTypes = function () { return { then: function () { return "getTypes"; } }; };
            elementServiceMock.get = function () { return { then: function () { return "get"; } }; };

            elementController = $controller('ElementController', {
                Element: elementServiceMock
            });
        }));

        it('Should Controller attributes be defined', function () {
            expect(elementController.types).toBeDefined();
            expect(elementController.elementsList).toBeDefined();
            expect(elementController.status).toBeDefined();
            expect(elementController.elementSelected).toBeDefined();
        });

        // it('Should controller has service methods available', function() {
        //   expect(elementController.Element)
        // });

        it('Should sort environments list', function () {
            elementController.types = {
                environments: [
                    {
                        "id": 2,
                        "name": "Test"
                    },
                    {
                        "id": 3,
                        "name": "Homologation"
                    },
                    {
                        "id": 1,
                        "name": "Production"
                    }
                ]
            };

            var sortedEnvs = [
                    {
                        "id": 3,
                        "name": "Homologation"
                    },
                    {
                        "id": 1,
                        "name": "Production"
                    },
                    {
                        "id": 2,
                        "name": "Test"
                    }
            ];

            passPromise = true;
            var sortedElements = elementController.getSortedEnvironments();
            expect(sortedElements).toEqual(sortedEnvs);
        });
    });
});
