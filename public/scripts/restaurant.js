/**
 * Created by Ben on 2/24/2016.
 */
'use strict';

// Order Model
var OrderModel = function () {
  var self = this;
  // Members
  self.addOrderItem = function () {
    localStorage.setItem('orderItemIds', ['56cb96b87c9a80727f72d72e', '56cb96b87c9a80727f72d72e']);
    localStorage.setItem('userId', '56cb96b87c9a80727f72d72e');
    localStorage.setItem('paymentMethodId', '56cb96b87c9a80727f72d72e');
  };
  self.submitOrder = function () {
    // construct data to send
    var orderData = {
      'userId': localStorage.userId,
      'paymentMethodId': localStorage.paymentMethodId,
      'orderItemIds': localStorage.orderItemIds
    };
    $.ajax({
      url: '/submitOrder',
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(orderData),
      success: function (response) {
        console.log('Success!');
        console.log(response);
      },
      error: function (response) {
        console.log(response);
      }
    });
  };
};

$(document).ready(function () {
  console.log('test');
  var orderModel = new OrderModel();
  orderModel.addOrderItem();
  orderModel.submitOrder();
});
