function demoTwoPageDocument() {
	var doc = new jsPDF();
	doc.text(80, 20, 'Date Range: ' + $('#dateRange').val());
	doc.text(20, 30, $('#totalOrders').text());
	doc.text(20, 40, $('#totalSales').text());
	doc.text(20, 50, $('#topSellingItem').text());
	doc.text(20, 60, $('#dayOfMostOrders').text());
	doc.text(20, 70, $('#dayOfHighestSales').text());
	doc.text(20, 80, $('#timeOfMostOrders').text());
	
	// Save the PDF
	doc.save('Report.pdf');
}

