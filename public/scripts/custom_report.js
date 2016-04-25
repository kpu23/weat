function demoTwoPageDocument() {
	var doc = new jsPDF();
	doc.text(80, 20, 'Date Range: ')
	doc.text(20, 30, 'Total Orders: ');
	doc.text(20, 40, 'Total in Sales: ');
	doc.text(20, 50, 'Top Selling Item: ');
	doc.text(20, 60, 'Day with Most Orders: ');
	doc.text(20, 70, 'Day with Highest Sales: ');
	doc.text(20, 80, 'Time of Day with Most Orders: ');
	
	// Save the PDF
	doc.save('Report.pdf');
}

