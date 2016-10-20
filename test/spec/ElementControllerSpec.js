describe('All tests', function () {
  var ROUTES = {
      getAll: 'getAll path',
      get: 'get path',
      getTypes: 'getTypes path'
  };

  beforeEach(module('cong', function ($provide) {
      $provide.constant('ROUTES', ROUTES);
  }));

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
          $httpBackend.flush();
          $httpBackend.expectGET('readme.html')
            .respond(200);
      }));

      it('Should load the list page on successful load of /list and with ElementController', function () {
          location.path('/list');
          rootScope.$digest();
          expect(route.current.controller).toBe('ElementController');
      });

      it('Should load the readme page on successful load of /readme and with ReadmeController', function () {
          location.path('/readme');
          rootScope.$digest();
          expect(route.current.controller).toBe('ReadmeController');
      });

      it('Should load the list page on access root page', function () {
          location.path('/');
          rootScope.$digest();
          expect(route.current.controller).toBe('ElementController');
      });
  });

  describe('Testing Element Service', function () {
    var elementService, $httpBackend, $http, $timeout, $q, scope;

    beforeEach(module('cong.element'));

    beforeEach(inject(function(_$rootScope_, _$httpBackend_, _$http_, _$timeout_, _$q_, _Element_) {
      scope = _$rootScope_.$new();
      $httpBackend = _$httpBackend_;
      $http = _$http_;
      $timeout = _$timeout_;
      $q = _$q_;
      elementService = _Element_;

      window.jasmine.DEFAULT_TIMEOUT_INTERVAL = 10;
    }));

    it('Should have a working Element service', function () {
      expect(elementService.getAll).toBeDefined();
      expect(elementService.get).toBeDefined();
      expect(elementService.getTypes).toBeDefined();

      expect(elementService.getAll).toEqual(jasmine.any(Function));
      expect(elementService.get).toEqual(jasmine.any(Function));
      expect(elementService.getTypes).toEqual(jasmine.any(Function));
    });

    it('should use ROUTES.getAll on method getAll', function() {
      // given
      spyOn($http, 'get').and.callThrough();

      // when
      elementService.getAll();

      // then
      expect(elementService.getAll).toBeDefined();
      expect($http.get).toHaveBeenCalledWith(ROUTES.getAll);
    });

    it('should use ROUTES.get on method myGet', function(done) {
      spyOn(Math, "random").and.returnValue(0);
      spyOn($http, "get").and.callThrough();
      
      elementService.get('elem1')
        .then(function(res) {
          expect($http.get).toHaveBeenCalledWith(ROUTES.get, {params: {id: 'elem1'}});
          done();
        });
      
      $httpBackend
        .when('GET', ROUTES.get + "?id=elem1")
        .respond(200, { foo: 'bar' });
        
       $timeout.flush();
       $timeout.verifyNoPendingTasks();
       $httpBackend.flush();
    });

    it('should use ROUTES.getTypes on method getTypes', function() {
      // given
      spyOn($http, 'get').and.callThrough();

      // when
      elementService.getTypes();

      // then
      expect(elementService.getTypes).toBeDefined();
      expect($http.get).toHaveBeenCalledWith(ROUTES.getTypes);
    });
  });

  describe('Testing Element Controller', function() {
     var scope, deferred, elementController, mockElement, $controller, $location, $q;

     beforeEach(module('cong.element'));

     function makeController() {
      elementController = $controller('ElementController', {
        $scope: scope,
        Element: mockElement
      });
     }

     beforeEach(inject(function (_$rootScope_, _$q_, _$controller_, _$location_) {
        scope = _$rootScope_.$new();
        $q = _$q_;
        $location = _$location_;

        function emptyPromise() {
            deferred = $q.defer();
            return deferred.promise;
        }

        mockElement = {
            getTypes: emptyPromise,
            getAll: emptyPromise,
            get: emptyPromise
        };

        $controller = _$controller_;
    }));

    it('Should have a ElementController controller', function () {
      // then
      expect("cong.element.ElementController").toBeDefined();
    });

    it('Should have a Element service', function () {
      // then
      expect(Element).toBeDefined();
    });

    it('Should have mthods inside Element service', function () {
      // then
      expect(mockElement.getTypes).toEqual(jasmine.any(Function));
      expect(mockElement.getAll).toEqual(jasmine.any(Function));
      expect(mockElement.get).toEqual(jasmine.any(Function));
    });

    it('Should Controller attributes be defined', function () {
      // when
      makeController();
      
      // then
      expect(elementController.types).toBeDefined();
      expect(elementController.elementsList).toBeDefined();
      expect(elementController.status).toBeDefined();
      expect(elementController.elementSelected).toBeDefined();
    });

    it('should call getTypes method on init', function () {
      // given
      spyOn(mockElement, 'getTypes').and.callFake(function() {
        var deferred = $q.defer();
        deferred.resolve({ environments: ['env1', 'env2'] });
        return deferred.promise;
      });
      
      // when
      makeController();
      scope.$root.$digest();
      
      // then
      expect(mockElement.getTypes).toHaveBeenCalled();
      expect(elementController.types.environments.length).toBeGreaterThan(0);
      expect(elementController.types.environments[0]).toBe('env1');
    });

    it('should call getAll method on init', function () {
      // given
      spyOn(mockElement, 'getTypes').and.callFake(function() {
        var deferred = $q.defer();
        deferred.resolve({ environments: ['env1', 'env2'] });
        return deferred.promise;
      });
      spyOn(mockElement, 'getAll').and.callFake(function() {
        var deferred = $q.defer();
        deferred.resolve([ { "id": "elem1" }, { "id": "elem2" } ]);
        return deferred.promise;
      });
      
      // when
      makeController();
      scope.$root.$digest();
      
      // then
      expect(mockElement.getAll).toHaveBeenCalled();
      expect(elementController.elementsList.length).toBeGreaterThan(0);
      expect(elementController.elementsList[0].id).toBe('elem1');
    });

    it('should not call service get method if open method called for the openned element', function() {
      // given
      spyOn(mockElement, 'get').and.callFake(function() {
        var deferred = $q.defer();
        return deferred.promise;
      });
      makeController();

      elementController.elementSelected = { "id": "elem1" };

      // when
      elementController.open("elem1");
      scope.$root.$digest();

      // then
      expect(mockElement.get).not.toHaveBeenCalled();
    });

    it('should call service get method if open method called adn there is no openned element', function() {
      // given
      spyOn(mockElement, 'get').and.callFake(function(id) {
        var deferred = $q.defer();
        deferred.resolve({ "metrics": { "test": 0.64 } });
        return deferred.promise;
      });
      
      makeController();

      elementController.elementsList = [ { "id": "elem1" } ];
      elementController.elementSelected = null;

      // when
      elementController.open("elem1");
      scope.$root.$digest();

      // then
      expect(mockElement.get).toHaveBeenCalledWith("elem1");
      expect(elementController.elementSelected.details).toBeDefined();
      expect(elementController.elementSelected.details.metrics).toBeDefined();
      expect(elementController.elementSelected.details.metrics.test).toBe(0.64);
    });

    it('Should sort environments list', function () {
      // given
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

      // when
      var sortedElements = elementController.getSortedEnvironments();

      // then
      expect(sortedElements).toEqual(sortedEnvs);
    });

    it('should redirect to /readme when call openReadme method', function() {
      // given
      spyOn($location, 'path').and.callThrough();
      makeController();

      // when
      elementController.openReadme();

      // then
      expect($location.path).toHaveBeenCalledWith("/readme");
    });
  });

  describe('Testing Readme Controller', function() {
    var readmeController, scope, $location, $controller;

    beforeEach(module('cong.element'));

    function makeController() {
      readmeController = $controller('ReadmeController', {
        $scope: scope
      });
     }

    beforeEach(inject(function (_$controller_, _$rootScope_, _$location_) {
      scope = _$rootScope_.$new();
      $location = _$location_;
      $controller = _$controller_;
    }));

    it('Should have a ReadmeController controller', function () {
      // then
      expect("cong.element.ReadmeController").toBeDefined();
    });

    it('should redirect to /list when call openList method', function() {
      // given
      spyOn($location, 'path').and.callThrough();
      makeController();

      // when
      readmeController.openList();

      // then
      expect($location.path).toHaveBeenCalledWith("/list");
    });
  });

});
