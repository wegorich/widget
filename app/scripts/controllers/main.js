'use strict';

angular.module('widgetApp').controller('MainCtrl', function ($scope, api, $timeout) {
  var questions = null;
  var urlVars = (function()
  {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
  })();

  var _selectQuestion = function(id){
    $scope.question = undefined;

    $timeout(function(){
      $scope.question = questions[id];
      $scope.params.curAnswer = undefined;
    }, 1);
  };

  var _openEndPage = function(){
    $scope.question = undefined;

    var url = 'https://www.migreat.com',
      params = '?';

    $scope.params.selected.forEach(function(i){
      if (i.question.propName) {
        params += i.question.propName + '=' + i.answer.key + '&';
      }
      else {
        url += i.answer.key;
      }
    });

    $scope.params.url = url + params;
    $scope.params.showEndForm = true;
  };



  api.getData(urlVars.lang || 'en').then(function(data){
    if(data){
      questions = data.questions;
      $scope.params.title = data.title;
      $scope.lastInfo = data.lastInfo;
      _selectQuestion(0);
    }
  });

  $scope.params = {
    selected: []
  };

  $scope.answerSelected = function(item){
    $scope.params.selected.push({question: $scope.question, answer: item});

    var id = questions.indexOf($scope.question) + 1;

    if (id < questions.length) {
      _selectQuestion(id);
    }
    else{
      _openEndPage();
    }
  };

  $scope.reset = function(){
    $scope.params.selected.length = 0;
    $scope.params.showEndForm = false;

    _selectQuestion(0);
  };

});
