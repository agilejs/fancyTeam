var styleService = angular.module('styleServ', []);

styleService.factory('styleServ', function() {
    'use strict';
    var currentLocation;
    var myStyleServ = {};

    myStyleServ.getStyle = function(givenLocation) {
        if (currentLocation === givenLocation) {
            return { color : 'white' };
        }
    };

    myStyleServ.setCurrentLocation = function(location) {
        currentLocation = location;
    };

    return myStyleServ;
});

function AppCtrl ($scope, styleServ) {
    'use strict';
    $scope.title = 'The Movie Database';
    $scope.styleServ = styleServ;
}

function WelcomeCtrl ($scope, moviesResponse) {
    'use strict';
    $scope.movies = moviesResponse.data;
    $scope.styleServ.setCurrentLocation('index');
}

function MoviesListCtrl ($scope, $location, moviesResponse) {
    'use strict';
    $scope.movies = moviesResponse.data;
    $scope.add = function () {
        $location.path('/movies/new');
    };
    $scope.styleServ.setCurrentLocation('movies');
}

function ActorsListCtrl ($scope, $location, actorsResponse) {
    'use strict';
    $scope.actors = actorsResponse.data;
    $scope.add = function () {
        $location.path('/actors/new');
    };
    $scope.styleServ.setCurrentLocation('actors');
}

MoviesListCtrl.resolve = {
    moviesResponse: function ($http) {
        'use strict';
        return $http.get('/movies');
    }
};

ActorsListCtrl.resolve = {
    actorsResponse: function ($http) {
        'use strict';
        return $http.get('/actors');
    }
};

function MoviesAddCtrl ($scope, $http, $location) {
    'use strict';
    $scope.movie = {};
    $scope.save = function (movie) {
        $http.post('/movies', movie)
        .success(function(res) {
            $location.path('/movies/' + res.id);
        });
    };
}

function ActorsAddCtrl ($scope, $http, $location) {
    'use strict';
    $scope.actor = {};
    $scope.save = function (actor) {
        $http.post('/actors', actor)
        .success(function(res) {
            $location.path('/actors/' + res.id);
        });
    };
}

function MovieDetailCtrl ($scope, $http, $location, moviesResponse) {
    'use strict';
    $scope.movie = moviesResponse.data;

    $scope['delete'] = function () {
        $http['delete']('/movies/' + $scope.movie.id).success(function (res) {
            $location.path('/movies');
        });
    };
}

function movieDetailResolver ($http, $route) {
    'use strict';
    var id = $route.current.params.id;
    return $http.get('/movies/' + id);
}

MovieDetailCtrl.resolve = {
    moviesResponse: movieDetailResolver
};

function ActorDetailCtrl ($scope, $http, $location, actorResponse) {
    'use strict';
    $scope.actor = actorResponse.data;

    $scope['delete'] = function () {
        $http['delete']('/actors/' + $scope.actor.id).success(function (res) {
            $location.path('/actors');
        });
    };
}

function actorDetailResolver ($http, $route) {
    'use strict';
    var id = $route.current.params.id;
    return $http.get('/actors/' + id);
}

ActorDetailCtrl.resolve = {
    actorResponse: actorDetailResolver
};

function MovieEditCtrl ($scope, $http, $location, moviesResponse) {
    'use strict';
    if(!moviesResponse.data.release) {
        moviesResponse.data.release = '';
    }
    $scope.movie = moviesResponse.data;

    $scope.save = function () {
        console.log($scope.movie);
        $http.put('/movies/' + $scope.movie.id, $scope.movie)
        .success(function (res) {
            $location.path('/movies/' + $scope.movie.id);
        });
    };
}

MovieEditCtrl.resolve = {
    moviesResponse: movieDetailResolver
};

function ActorEditCtrl ($scope, $http, $location, actorResponse) {
    'use strict';
    $scope.actor = actorResponse.data;

    $scope.save = function () {
        console.log($scope.actor);
        $http.put('/actors/' + $scope.actor.id, $scope.actor)
        .success(function (res) {
            $location.path('/actors/' + $scope.actor.id);
        });
    };
}

ActorEditCtrl.resolve = {
    actorResponse: actorDetailResolver
};

function NotFoundCtrl ($scope, $location) {
    'use strict';
    $scope.culprit = $location.search().culprit || 'unknown beast';
}

var ErrorCtrl = NotFoundCtrl;
