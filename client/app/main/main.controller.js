'use strict';

angular.module('medicationReminderApp').controller('MainCtrl', function ($scope, $http, $window) {

    var ctl = this,
        start = moment().format('MM/DD/YYYY'),
        end = moment().add(1, 'day').format('MM/DD/YYYY');

    $http.get('/api/medications?start=' + start + '&end=' + end).then(function (meds) {
      ctl.medications = meds.data;
    });
    });

    $window.setInterval(function () {
      var now = moment();

      $scope.currentDate = now.format('dddd MMMM Do');
      $scope.currentTime = now.format('h:mm a');

      $scope.pastMedications = _.sortBy(
      _.filter(ctl.medications, function(item) {
        var med = moment(item.time);

        return med.diff(now, 'minutes') < 0;
      }), 'time').reverse();

      $scope.futureMedications = _.sortBy(
      _.filter(ctl.medications, function(item) {
        var med = moment(item.time);

        return med.diff(now, 'minutes') >= 0;
      }), 'time');

      $scope.$apply();
    }, 1000);

});
