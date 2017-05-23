define(["./makeLineChart"], (makeLineChart) => {
	const temp = Handlebars.templates;
	const BODY = "[data-container]";
	const KLASS = [
		"uk-width-1-1@s",
		"uk-width-1-1@m",
		"uk-width-1-2@l",
		"uk-width-1-2@xl"
	].join(" ");
	
	function makeLineChart(container, series, text) {
		return Highcharts.stockChart(container[0], {
			rangeSelector: false,
			exporting: false,
			credits: false,
			title: {
				align: "left",
				text: text || "",
				style: {
					color: "#717171",
					fontSize: "14px"
				}
			},
			chart: {
				zoomType: "x"
			},
			legend: {
				enabled: true
            },
			series: series || []
		});
	}
	function createPanel(parent, type, rangeTitle, id, expand) {
		let body, title;
		switch (type) {
			case 0: body = temp.lineChart(); title = "Graph Sensor";           break;
			case 1: body = temp.barChart();  title = "Sensor Violation Ratio"; break;
			case 2: body = "";               title = "Sensor Violation Stats"; break;
			case 3: body = "";               title = "Map";                    break;
		}
		const ctx = {
			title: title,
			range: rangeTitle,
			body: body,
			id: id,
			expand: expand
		};
		const html = temp.panel(ctx);
		parent.append(html);
		return parent.children().last();
	}
	
	
	function constructor(container, e) {
		let inst = {};
		let root, els,
			chart = {};
		
		
		function init() {
			let root = createPanel(container, e.type, e.rangeTitle, e.id, e.expand);
			els = u.getEls(root);
			
			switch (e.type) {
				case 0: chart = makeLineChart(els.body, []); break;
				case 1: ; break;
				case 2: ; break;
				case 3: ; break;
			}
			els.menus.on("click", "[data-menu]", e => {
				let el = $(e.target);
				let action = parseInt(el.data().action, 10);
				if (action === 0) {
					if ( !el.hasClass(KLASS) ) {
						root.addClass(KLASS);
						els.menus.find("[data-resize]").html( temp.btnShrink() );
						if (chart) {
							chart.setSize();
						}
					}
				} else if (action === 1) {
					root.removeClass(KLASS);
					els.menus.find("[data-resize]").html( temp.btnExpand() );
					if (chart) {
						chart.setSize();
					}
				}
			});
			els.edit.on("click", () => {
				switch (e.type) {
					case 0: chart = makeLineChart(els.body, []); break;
					case 1: ; break;
					case 2: ; break;
					case 3: ; break;
				}
			});
			els.remove.on("click", () => {
				alert(4);
			});
			els.refresh.on("click", () => {
				alert(5);
			});
		}
		
		inst.shrink = () => {
			el.removeClass(KLASS);
			el.find("[data-resize]").html(temp.btnExpand);
			el.find(BODY).highcharts().setSize();
		};
		inst.chart = () => {return chart};
		
		init();
		
		return inst;
	}
	
	
	window.newWidget = constructor;
	return constructor;
});