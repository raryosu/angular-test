'use strict';

var app = angular.module('QiitaApp', ['ngResource']);

app.controller('EntriesListCtrl', ['$scope', 'EntriesFactory', function($scope, EntriesFactory) {
	var per = 10;
	$scope.initialized = true;
	$scope.init = function(args) {
		var params = args.params;
		$scope.page = 1;
		$scope.params = { page: $scope.page, per_page: per };
		if( angular.isObject(args) ) {
			$scope.page = args.page;
		}
		$scope.params = angular.extend($scope.params, args.params);
		EntriesFactory().query($scope.params).$promise.then(function(entries) {
			$scope.items = entries; 
		}, function(v){
			// resolved
		}, function(v){
			alert(v);
		});
	};

	$scope.readmore = function(args) {
		console.log("called readmore");
		if( $scope.page == 1 ) {
			return;
		} else {
			if( angular.isObject(args) ) {
				$scope.page = args.params.page;
			}
			$scope.params = angular.extend($scope.params, args.params);
			EntriesFactory().query($scope.params).$promise.then(function(entries) {
				$scope.items = $scope.items.concat(entries);
				$scope.initialized = false;
			}, function(v){
				// resolved
			}, function(v){
				alert(v);
			});
		}
	}

	$scope.$watch('page', function() {
		$scope.readmore({params: {page: $scope.page}});
	})
}]);

app.factory('EntriesFactory', ['$resource', function($resource) {
	return function(args) {
		args = angular.extend({timeout: 0, cache: true}, args);
		var api = 'http://qiita.com/api/v2/items';
		return $resource(api, {}, {
			query: {
				method: 'GET',
				params: {},
				// headers: {'Authorization': 'Bearer xxxx'},
				isArray: true,
				timeout: args.timeout,
				cache: true,
				transformResponse: function(json){
					var items;
					if (json) {
						items = angular.fromJson(json);
					} else {
						items = [];
					}
					return items;
				}
			}
		});
	};
}]);