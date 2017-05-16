define(() => {
	function color() {
		return "#"+ u.randInt( 0, parseInt("999999", 16) ).toString(16);
	}
	function getRandColor(brightness) {
		// Six levels of brightness from 0 to 5, 0 being the darkest
		var rgb = [Math.random() * 256, Math.random() * 256, Math.random() * 256];
		var mix = [brightness * 51, brightness * 51, brightness * 51]; //51 => 255/5
		var mixedrgb = [rgb[0] + mix[0], rgb[1] + mix[1], rgb[2] + mix[2]].map(function (x) {
			return Math.round(x / 2.0)
		})
		return "rgb(" + mixedrgb.join(",") + ")";
	}
	function format(ts) {
		let n;
		switch (ts.toString().length) {
			case 10: n = ts * 1000; break;
			case 16: n = ts / 1000; break;
			case 13: n = ts;        break;
		}
		return n;
	}
	function extract(data) {
		let res = [];
		let target = data[0].Data;
		if (target.length) {
			target.forEach(i => {
				res.push( [format(i.Timestamp), i.Value] );
			});
		}
		return res;
	}
	function make(container, data, text) {
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
			series: [{
				type: "line",
				name: "Value",
				color: getRandColor(0),
				data: extract(data),
			//	data: [[0, 0], [1, 5], [2, 3], [4, 8]],
				tooltip: {
					valueDecimals: 2
				}
			}]
		});
	}
	
	return make;
});