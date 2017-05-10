define([
	"uk",
	"./initLineChart",
	"./initBarChart",
	"./initMap",
], (
	uk,
	initLineChart,
	initBarChart,
	initMap
) => {
	const inst = u.extend( newPubSub() );
	const ROOT = "[data-root='content']";
	const WIZ_1 = "[data-root='wiz1']";
	const WIZ_2 = "[data-root='wiz2']";
	const WIZ_3 = "[data-root='wiz3']";
	const WIZ_4 = "[data-root='wiz4']";
	
	let els, wiz1, wiz2, wiz3, wiz4;
	const temp = Handlebars.templates;
	let data = {
		type: undefined
	};
	
	let k = "";
	k += "uk-width-1-1@s ";
	k += "uk-width-1-2@m ";
	k += "uk-width-1-2@l ";
	k += "uk-width-1-2@xl ";
	k += "uk-width-1-2@xll";
	function shrink(el) {
		if ( el.hasClass(k) ) {
			el.removeClass(k);
		}
	}
	function expand(el) {
		if ( !el.hasClass(k) ) {
			el.addClass(k);
		}
	}
	function gen() {
		var o = {
			sla:      u.randInt(10, 100),
			kpiName:  u.randInt(10, 100),
			severity: u.randInt(10, 100),
			value:    u.randInt(10, 100)
		};
		return o;
	}
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
		const container = els.components.find("[data-panel]:last-child [data-container]");
		switch (type) {
			case 0: initLineChart(container); break;
			case 1: initBarChart(container); break;
			case 2: undefined; break;
			case 3: initMap(container); break;
		}
	}
	
	inst.init = () => {
		els = u.getEls(ROOT);
		wiz1 = u.getEls(WIZ_1);
		wiz2 = u.getEls(WIZ_2);
		wiz3 = u.getEls(WIZ_3);
		wiz4 = u.getEls(WIZ_4);
		
		els.root.on("click", "[data-panel] [data-menu]", e => {
			const el = $(e.target);
			const panel = el.closest("[data-panel]");
			const action = parseInt(el.data().action, 10);
			switch (action) {
				case 0: expand(panel); break;
				case 1: shrink(panel); break;
				case 2: undefined; break;
				case 3: undefined; break;
			}
		});
		els.add.on("click", () => {
			uk.openModal(WIZ_1);
		});
		wiz1.next.on("click", () => {
			const checked = wiz1.radios.filter(":checked").val();
			const type = parseInt(checked, 10);
			data.type = type;
			switch (type) {
				case 0: uk.openModal(WIZ_2); break;
				case 1: uk.openModal(WIZ_3); break;
				case 2: uk.openModal(WIZ_3); break;
				case 3: uk.openModal(WIZ_4); break; 
			}
			
		});
		wiz2.prev.on( "click", () => uk.openModal(WIZ_1) );
		wiz3.prev.on( "click", () => uk.openModal(WIZ_1) );
		wiz4.prev.on( "click", () => uk.openModal(WIZ_1) );
		
		wiz2.submit.on("click", () => {
			add(data.type);
		});
		wiz3.submit.on("click", () => {
			add(data.type);
		});
		wiz4.submit.on("click", () => {
			add(data.type);
		});
	};
	
	return inst;
});