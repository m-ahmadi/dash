define(function () {
	function format(ts) {
		var n = void 0;
		switch (ts.toString().length) {
			case 10:
				n = ts * 1000;break;
			case 16:
				n = ts / 1000;break;
			case 13:
				n = ts;break;
		}
		return n;
	}
	function generate(data, opts) {
		var res = [];
		data.forEach(function (i, x) {
			var arr = i.Data;
			var d = [];
			if (arr.length) {
				arr.forEach(function (i) {
					d.push([format(i.Timestamp), i.Value]);
				});
			}
			var sensor = opts[i.SensorId];
			res.push({
				type: "line",
				name: sensor.name,
				color: "#" + sensor.color,
				data: d,
				tooltip: {
					valueDecimals: 2
				}
			});
		});
		return res;
	}
	function make(container, data, opts, text) {
		return Highcharts.stockChart(container[0], {
			title: {
				align: "left",
				text: text,
				style: {
					color: "#717171",
					fontSize: "14px"
				}
			},
			rangeSelector: false,
			exporting: false,
			credits: false,
			chart: {
				zoomType: "x"
			},
			series: generate(data, opts)
		});
	}

	return make;
});
//# sourceMappingURL=makeLineChart.js.map