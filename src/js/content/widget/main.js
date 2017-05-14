define(() => {
	const inst = u.extend( newPubSub() );
	
	function add(type) {
		let html;
		let o = {body: undefined};
		switch (type) {
			case 0: o.body = temp.lineChart(); break;
			case 1: o.body = temp.barChart(); break;
			case 2: o.body = temp.table( gen() ); break;
			case 3: o.body = temp.map(); break;
		}
		html = temp.panel(o);
		els.components.append(html);
		const container = els.components.find(`[data-panel]:last-child ${BODY}`);
		switch (type) {
			case 0: lineChart.init(container); break;
			case 1: initBarChart(container); break;
			case 2: undefined; break;
			case 3: initMap(container); break;
		}
	}
	function init() {
		
	}
	return {init};
});