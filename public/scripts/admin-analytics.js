/**
 * Created by ben on 3/6/2016.
 */
var dailyData = {
    labels: ['12AM','1AM','2AM','3AM','4AM','5AM','6AM','7AM', '8AM','9AM','10AM','11AM','12PM','1PM',
        '2PM','3PM', '4PM','5PM', '6PM','7PM','8PM','9PM','10PM', '11PM', '12PM'],

    datasets: [{
        label: '2010 customers #',
        fillColor: '#3498db',
        data: [3, 10, 13, 25, 40, 45,30,22,33,15,22,10,4,8,10]
    }]
};

var AnalyticsModel = function () {
    var self = this;
    self.getDailyOrderData = function () {
        // Default to Today
        var fromDate = new Date();
        var toDate = new Date();
        fromDate.setHours(0,0,0,0);
        toDate.setHours(23,59,59,999);

        var dateRange = {fromDate: fromDate, toDate: toDate};
        $.post('admin/getDailyOrderData', dateRange, function(orderCountByHours) {
            dailyData.datasets[0].data = orderCountByHours;
            var context = document.getElementById('clients').getContext('2d');
            var clientsChart = new Chart(context).Bar(dailyData);
        });
    };
};


var CustomerHistoryModel = function () {
    var self = this;
    self.customers = ko.observableArray();
    self.getCustomerHistory = function () {
        $.get('admin/getCustomerHistory', function(customers) {
            customers.forEach(function(customer) {
                if (!customer.gender) {
                    customer.gender = '';
                }
                if (!customer.occupation) {
                    customer.occupation = '';
                }
                if (!customer.ethnicity) {
                    customer.ethnicity = '';
                }
                if (customer.dob) {
                    var dob = new Date(customer.dob).getFullYear();
                    console.log(customer);
                    customer.dob = new Date().getFullYear() - dob;    
                }
            });
            self.customers(customers);
        });        
    }

};


$(document).ready(function(){
    if ($('#analytics-home').length > 0) {
       var analyticsModel = new AnalyticsModel();
        ko.applyBindings(analyticsModel);
        analyticsModel.getDailyOrderData();     
    }
    if ($('#customer-history').length > 0) {
       var customerHistoryModel = new CustomerHistoryModel();
        ko.applyBindings(customerHistoryModel);
        customerHistoryModel.getCustomerHistory();     
    }
});