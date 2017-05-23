define(["./makeLineChart"], (makeLineChart) => {
	const temp = Handlebars.templates;
	const BODY = "[data-container]";
	const KLASS = [
		"uk-width-1-1@s",
		"uk-width-1-1@m",
		"uk-width-1-2@l",
		"uk-width-1-2@xl"
	].join(" ");
	
	
	function shrink(el) {
		el.removeClass(KLASS);
		el.find("[data-resize]").html(temp.btnExpand);
		el.find(BODY).highcharts().setSize();
	}
	function expand(el) {
		if ( !el.hasClass(KLASS) ) {
			el.addClass(KLASS);
			el.find("[data-resize]").html(temp.btnShrink);
			el.find(BODY).highcharts().setSize();
		}
	}
	function makeLineChart(container, series) {
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
			series: series || []
		});
	}
	function loadGraphSensorData() {
		
	}
	function createPanel() {
		
	}
	function createGraphSensor(container, e) {
		const o = {
			title: "Graph Sensor",
			range: "Last 15 Minutes",
			body: temp.lineChart(),
			id: e.id
		};
		const html = temp.panel(o);
		container.append(html);
		const chartContainer = container.find(`[data-panel]:last-child [data-container]`)
		return makeLineChart(chartContainer, []);
	}
	function addEvt() {
		
	}
	function create() {
		
	}
	function constructor(container, e) {
		let inst = {};
		let el;
		
		switch(e.type) {
			case 0: el = createGraphSensor(container, e); break;
			case 1: ; break;
			case 2: ; break;
			case 3: ; break;
		}
		
		inst.shrink = () => {
			
		};
		inst.expand = () => {
			
		};
		
		return inst;
	}
	
	return constructor;
});