define(() => {
	return (container) => {
		var data = {
			labels: ["January", "February", "March", "April", "May", "June", "July"],
			datasets: [
				{
					label: "My First dataset",
					fill: false,
					lineTension: 0.1,
					backgroundColor: "rgba(75,192,192,0.4)",
					borderColor: "rgba(75,192,192,1)",
					borderCapStyle: 'butt',
					borderDash: [],
					borderDashOffset: 0.0,
					borderJoinStyle: 'miter',
					pointBorderColor: "rgba(75,192,192,1)",
					pointBackgroundColor: "#fff",
					pointBorderWidth: 1,
					pointHoverRadius: 5,
					pointHoverBackgroundColor: "rgba(75,192,192,1)",
					pointHoverBorderColor: "rgba(220,220,220,1)",
					pointHoverBorderWidth: 2,
					pointRadius: 1,
					pointHitRadius: 10,
					data: [65, 59, 80, 81, 56, 55, 40],
					spanGaps: false,
				}
			]
		};
		var myLineChart = new Chart(container, {
			type: 'line',
			data: data
		});
		
		
		
		
		
		
		
		
		/* var seriesOptions = [],
			seriesCounter = 0,
			names = ['MSFT', 'AAPL', 'GOOG'];
			
		function createChart() {
			Highcharts.stockChart(container, {

				rangeSelector: {
					selected: 4
				},

				yAxis: {
					labels: {
						formatter: function () {
							return (this.value > 0 ? ' + ' : '') + this.value + '%';
						}
					},
					plotLines: [{
						value: 0,
						width: 2,
						color: 'silver'
					}]
				},

				plotOptions: {
					series: {
						compare: 'percent',
						showInNavigator: true
					}
				},

				tooltip: {
					pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
					valueDecimals: 2,
					split: true
				},

				series: seriesOptions
			});
		}

		$.each(names, function (i, name) {

			$.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=' + name.toLowerCase() + '-c.json&callback=?', function (data) {

				seriesOptions[i] = {
					name: name,
					data: data
				};

				// As we're loading the data asynchronously, we don't know what order it will arrive. So
				// we keep a counter and create the chart when all the data is loaded.
				seriesCounter += 1;

				if (seriesCounter === names.length) {
					createChart();
				}
			});
		}); */
		
		
		
		
		
		
		
		
		
		
		
		
		
		
	};
});