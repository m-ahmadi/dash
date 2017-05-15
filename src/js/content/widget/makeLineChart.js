define(() => {
	let data;
	let options = {
        series: [{
            name: "Olagh",
            data: [0, 5, 3, 5, 0, 5, 3, 5, 0, 5, 3, 5, 0, 5, 3, 5],
            tooltip: {
                valueDecimals: 2
            }
        }],
		rangeSelector: false
	};
	function make(container) {
		window.asad = Highcharts.stockChart(container[0], {
        series: [{
            name: "Olagh",
            data: [0, 5, 3, 5, 0, 5, 3, 5, 0, 5, 3, 5, 0, 5, 3, 5],
            tooltip: {
                valueDecimals: 2
            }
        }],
		rangeSelector: false
	});
	}
	
	return make;
});