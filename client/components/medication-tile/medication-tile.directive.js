'use strict';

angular.module('medicationReminderApp').directive('medicationTile', function () {
  return {
    templateUrl: 'components/medication-tile/medication-tile.html',
    restrict: 'E',
    scope: {
      medication: '='
    },
    link: function($scope) {
      $scope.medication.prettyTime = moment($scope.medication.time).format('h:mm a');


    }
  };
});
