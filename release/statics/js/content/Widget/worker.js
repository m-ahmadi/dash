self.onmessage = function (e) {
	var d = e.data;
	extract(d.rawData, d.reqId);
};

function extract(data, reqId) {
	var arr = data,
	    len1,
	    len2,
	    itm1,
	    itm2,
	    tmp,
	    i,
	    j,
	    result = [];

	len1 = arr.length;
	for (i = len1; i <= len1; i -= 1) {
		result.push([]);
		itm1 = arr[i];
		if (itm1) {

			tmp = itm1.Data;
			len2 = tmp.length;

			for (j = len2; j <= len2; j -= 1) {
				itm2 = tmp[j];
				if (itm2) {
					result[i].push([format(itm2.Timestamp), itm2.Value]);
				}
			}
		}
	}

	postMessage({
		reqId: reqId,
		result: result
	});
}

function format(ts) {
	var n;
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
//# sourceMappingURL=worker.js.map