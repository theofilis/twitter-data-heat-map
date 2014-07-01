(function () {
    'use strict';

    // We define an EsConnector module that depends on the elasticsearch module.     
    var app = angular.module('app', ['elasticsearch', 'ngAnimate','cgBusy']);

    // Create the es service from the esFactory
    app.service('es', function (esFactory) {
        return esFactory({
            host: 'http://83.212.98.174:9200'
        });
    });

    app.controller('AppCtrl', function ($scope, es) {
        $scope.myPromise = es.search({
            index: 'twitter',
            size: 1000,
            body: {
                "query": {
                    "match": {
                        "geo.type": "Point"
                    }
                }
            }
        }).then(function (response) {
            $scope.hits = response.hits.hits;

            var map, pointarray, heatmap;
            var taxiData = [];

            $scope.hits.forEach(function (item, i) {
                taxiData.push(new google.maps.LatLng(item['_source']['geo']['coordinates'][0], item['_source']['geo']['coordinates'][1]));
            });
            var mapOptions = {
                zoom: 2,
                center: new google.maps.LatLng(0, 0),
                mapTypeId: google.maps.MapTypeId.SATELLITE
            };

            map = new google.maps.Map(document.getElementById('map-canvas'),
                mapOptions);

            var pointArray = new google.maps.MVCArray(taxiData);

            heatmap = new google.maps.visualization.HeatmapLayer({
                data: pointArray
            });
            heatmap.setMap(map);
        });
    });
}());
19.349492, -99.161631