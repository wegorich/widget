'use strict';

angular.module('widgetApp').service('api', ['backend', '$q', '$timeout', function ($http, $q, $timeout) {
  var that = this,
      questionUrl = 'question';

  var wrapInDeffer = function(cb){
    var deferred = $q.defer();

    $timeout(function(){
      deferred.resolve(cb());
    }, 30);

    return deferred.promise;
  };

  var normalizeData = function(data){
    /*jshint camelcase: false */
    data.questions = [];
    var arr = [];

    for(var i in data.wizard_type.answers){
      arr.push({title: i, key: data.wizard_type.answers[i]});
    }

    data.wizard_type.answers = angular.copy(arr);
    data.wizard_type.placeholder = 'wizard_type';
    data.questions.push(data.wizard_type);
    arr.length = 0;

    for(i in data.Nationality.answers){
      arr.push({title: data.Nationality.answers[i], key: i});
    }

    data.Nationality.answers = angular.copy(arr);
    data.Nationality.propName = 'nationality';
    data.Nationality.placeholder = 'Nationality';
    data.questions.push(data.Nationality);
    data.lastInfo = {
      reset: data.Reset_button || 'edit answers',
      btn: data.Submit_button
    };

    data.Submit_button =
      data.wizard_type =
        data.Nationality = undefined;

    return data;
  };

  that.getData = function (lang) {
    return wrapInDeffer(function(){
      return normalizeData($http.get(questionUrl, {lang: lang}));
    });
  };
}]);
