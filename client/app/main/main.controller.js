'use strict';

angular.module('medicationReminderApp').controller('MainCtrl', function ($scope, $http, $window) {

    var start = moment().format('MM/DD/YYYY'),
        end = moment().add(1, 'day').format('MM/DD/YYYY');

    $http.get('/api/medications?start=' + start + '&end=' + end).then(function (meds) {
        $scope.meds = meds.data;
    });

    $window.setInterval(function () {
      var now = moment();

      $scope.currentDate = now.format('dddd MMMM Do');
      $scope.currentTime = now.format('h:mm a');
      $scope.$apply();
    }, 1000);

});
