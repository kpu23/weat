'use strict';

var viewModel = function () {
  this.firstName = ko.observable('this is text from javascript');
};

var newModelInstance = new viewModel();
ko.applyBindings(newModelInstance, document.getElementById('test'));