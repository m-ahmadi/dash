self.onmessage = e => {
	var d = e.data;
	var res;
	switch (d.action) {
		case "line_chart":
		res = buildLineSeries(d.rawData); break;
		
		case "bar_chart":
		res = buildBarSeries(d.rawData, d.statKpis); break;
		
		case "table":
		res = buildTableData(d.rawData, d.statKpis); break;
	}
	self.postMessage({
		reqId: d.reqId,
		result: res
	});
};

function buildTableData(data) {
	var o = data;
	var viols = {};
	
	o.kpis_data.forEach(o => {
		viols[o.KPI] = o.violation;
	});
	var result = {
		total_link_count:                  o.total_links_count,
		total_violation:                   o.total_violation,
		total_packet_losss_ne_violation:   viols["packet_loss_ne"],
		total_two_way_delay_max_violation: viols["two_way_delay_max"],
		total_two_way_dv_max_violation:    viols["two_way_dv_max"]
	};
	
	return result;
}

function buildBarSeries(data, statKpis) {
	var arr = data;
	var result = [];
	arr.forEach(i => {
		let name = i.KPI;
		result.push({
			id: statKpis.filter(v => {return v.name = name})[0].id,
			name: name,
			data: [i.ratio]
		});
	});
	return result;
}

function buildLineSeries(data) {
	var arr = data,
		len1, len2, itm1, itm2, tmp, i, j,
		result = {},
		k, res2;
	
	len1 = arr.length;
	for (i=0; i < len1; i+=1) {
		itm1 = arr[i];
		k = itm1.SensorId;
		result[k] = [];
		res2 = result[k];
		tmp = itm1.Data;
		
		if (tmp) {
			len2 = tmp.length;
			
			/* for (j=0; j < len2; j+=1) { // 5000
				itm2 = tmp[j];
				res2.push( [format(itm2.Timestamp), itm2.Value] );
			} */
			for (j=len2-1; j >= 0; j-=1) { // 3000
				itm2 = tmp[j];
				res2.push( [format(itm2.Timestamp), itm2.Value] );
			}
		}
	}
	return result;
}

function format(ts) {
	var n;
	switch (ts.toString().length) {
		case 10: n = ts * 1000; break;
		case 16: n = ts / 1000; break;
		case 13: n = ts;        break;
	}
	return n;
}