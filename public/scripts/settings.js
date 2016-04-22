'use strict';

var userInfo = {
	firstName: ko.observable(),
	lastName: ko.observable(),
	phone: ko.observable(),
	dob: ko.observable(),
	ethnicity: ko.observable(),
	gender: ko.observable(),
	save: function(data, event){
		$.post('/saveUserInfo', {
			firstName: userInfo.firstName(),
			lastName: userInfo.lastName(),
			phone: userInfo.phone(),
			dob: userInfo.dob(),
			ethnicity: userInfo.ethnicity()
		}, function(res) {
			console.log('res', res);
		});
	}
}
var restaurantInfo = {
	//favorites: ko.observableArray(),
	save: function(data, event){

	}
}
var emailInfo = {
	email: ko.observableArray(),
	save: function(data, event){
		if(emailInfo.email()){
			$.post('/saveUserInfo', {
				email: emailInfo.email()			
			}, function(res) {
				console.log('res', res);
			});
		} else {
			console.log('email cannot be blank');
		}		
	}
}
var passwordInfo = {
	newPassword: ko.observable(),
	confirmPassword: ko.observable(),
	save: function(data, event){
		if(passwordInfo.newPassword() == passwordInfo.confirmPassword()){
			$.post('/saveUserInfo', {
				password: passwordInfo.newPassword()					
			}, function(res) {
				console.log('res', res);
			});
		} else {
			console.log('password does not match');
		}		
	}
}
var paymentInfo = {
	nameOnCard: ko.observable(),
	number: ko.observable(),
	expirationDate: ko.observable(),
	cvv: ko.observable(),
	address: ko.observable(),
	city: ko.observable(),
 	state: ko.observable(),
	zip: ko.observable(),
	save: function(data, event){		
		$.post('/savePaymentInfo', {
			nameOnCard: paymentInfo.nameOnCard(),
			number: paymentInfo.number(),
			expirationDate: paymentInfo.expirationDate(),
			cvv: paymentInfo.cvv(),
			address: paymentInfo.address(),
			city: paymentInfo.city(),
		 	state: paymentInfo.state(),
			zip: paymentInfo.zip()					
		}, function(res) {
			console.log('res', res);
		});		
	}
}

function SettingsViewModel(){
	var self = this;
	self.userInfo = userInfo;
	self.emailInfo = emailInfo;
	self.passwordInfo = passwordInfo;
	self.paymentInfo = paymentInfo;

	//business user
	self.restaurantInfo = restaurantInfo;
}

$(document).ready(function(){
	ko.bindingHandlers.initWithValue = {
    'init': function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var initialValue = element.getAttribute('value');
        ko.bindingHandlers.value.init(element, valueAccessor, allBindingsAccessor, viewModel);
        valueAccessor()(initialValue);
    },
    'update': ko.bindingHandlers.value.update
};

   var settingsModel = new SettingsViewModel();
   //menuModel.fetchMenus();
   ko.applyBindings(settingsModel, document.getElementById('account-settings'));
});
