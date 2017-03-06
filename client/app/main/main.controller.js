'use strict';

angular.module('medicationReminderApp').controller('MainCtrl', function ($scope, $http, $window) {

    var ctl = this,
        upcomingMedModal = Modal.confirm.upcomingMed(),
        missedMedModal = Modal.confirm.missedMed();

    /*
      Helper function to split the full array of medications
      into more useable chunks. Namely, past, future, and complete.

      It's not the most efficient function in the world. An obvious
      improvement would be to make it iterate over the full array only once.
    */
    var splitMedications = function(now) {
      $scope.pastMedications = _.sortBy(
        _.filter(ctl.medications, function(med) {
          if (med.completed) {
            return false;
          }

          var medTime = moment(med.time);
          return medTime.diff(now, 'minutes') < -5;
        }), 'time').reverse();

      $scope.futureMedications = _.sortBy(
        _.filter(ctl.medications, function(med) {
          if (med.completed) {
            return false;
          }

          var medTime = moment(med.time);
          return medTime.diff(now, 'minutes') >= -5;
        }), 'time');

      $scope.completeMedications = _.sortBy(
        _.filter(ctl.medications, function(med) {
          return med.completed;
        }), 'time').reverse();
    };

    /*
      Helper function to fetch medications for a given date.
    */
    $scope.refreshMedications = function(start, end) {
      start = start || moment($scope.selectedDate).format('MM/DD/YYYY');
      end = end || moment($scope.selectedDate).add(1, 'day').format('MM/DD/YYYY');

      $http.get('/api/medications?start=' + start + '&end=' + end).then(function (meds) {
        ctl.medications = meds.data;
      });
    };

    });

    $window.setInterval(function () {
      var now = moment(),
          selectedDate = moment($scope.selectedDate);

      $scope.currentDate = selectedDate.format('dddd MMMM Do');
      $scope.currentTime = now.format('h:mm a');

      splitMedications(now);

      // Loop through incomplete meds and alert as appropriate.
      var incompleteMeds = $scope.pastMedications.concat($scope.futureMedications);

      _.forEach(incompleteMeds, function(med) {
        var medTime = moment(med.time);

        if (medTime.isSame(now)) {
          upcomingMedModal(med.name, med.dosage);
        }

        if (medTime.diff(now, 'minutes') === -5) {
          missedMedModal(med.name, med.dosage);
        }
      });

      $scope.$apply();
    }, 1000);

});
