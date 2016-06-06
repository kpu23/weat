function demoTwoPageDocument() {
    var sales = $('#totalSales').text();
    sales = sales.replace("0", "");

	var doc = new jsPDF();
	doc.text(80, 20, 'Date Range: ' + $('#dateRange').val());
	doc.text(20, 30, $('#totalOrders').text());
	doc.text(20, 40, sales);
	doc.text(20, 50, $('#topSellingItem').text());
	doc.text(20, 60, $('#dayOfMostOrders').text());
	doc.text(20, 70, $('#dayOfHighestSales').text());
	doc.text(20, 80, $('#timeOfMostOrders').text());
	
	// Save the PDF
	doc.save('Report.pdf');
}

$(function() {

    $('input[name="datefilter"]').daterangepicker({
        autoUpdateInput: false,
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            },
        locale: {
        cancelLabel: 'Clear'
        }
    });

    $('input[name="datefilter"]').on('apply.daterangepicker', function(ev, picker) {
    	$(this).val(picker.startDate.format('MM/DD/YYYY') + ' - ' + picker.endDate.format('MM/DD/YYYY'));      
        $.post("/getReportData", 
            {
                fromDate: picker.startDate.format('MM/DD/YYYY'),
                toDate: picker.endDate.format('MM/DD/YYYY')
            }, 
            function (result) {
                console.log(result);
                $('#totalOrders').text('Total Orders: ' + result.totalOrders);
                $('#totalSales').text('Total in Sales: ' + result.totalSales.toFixed(2));
                $('#topSellingItem').text('Top Selling Item: ' + result.topSellingItem);
                $('#dayOfMostOrders').text('Day with Most Orders: ' + result.dayOfMostOrders);
                $('#dayOfHighestSales').text('Day with Highest Sales: ' + result.dayOfHighestSales);
                $('#timeOfMostOrders').text('Time of Day with Most Orders: ' + result.timeOfMostOrders);
            });
    });

    $('input[name="datefilter"]').on('cancel.daterangepicker', function(ev, picker) {
    	$(this).val('');
    });
    $('input[name="datefilter"]').val(moment().format('MM/DD/YYYY') + ' - '+ moment().format('MM/DD/YYYY'));

});