var barData = {
    
    labels: ['8AM','9AM','10AM','11AM','12PM','1PM', 
            '2PM','3PM', '4PM','5PM', '6PM','7PM','8PM','9PM','10PM'],
    
    datasets: [
        {
            label: '2010 customers #',
            fillColor: '#3498db',
            data: [3, 10, 13, 25, 40, 45,30,22,33,15,22,10,4,8,10]
        },
       
            ]
};

var context = document.getElementById('clients').getContext('2d');
var clientsChart = new Chart(context).Bar(barData);