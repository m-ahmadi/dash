define([
	"uk",
	"./wizard/main",
	"./widget/main"
], (
	uk,
	wizard,
	widget
) => {
	const inst = u.extend( newPubSub() );
	const ROOT = "[data-root='content']";
	const BODY = "[data-container]"
	
	let els;
	const temp = Handlebars.templates;
	
	let k = "";
	k += "uk-width-1-1@s ";
	k += "uk-width-1-1@m ";
	k += "uk-width-1-2@l ";
	k += "uk-width-1-2@xl ";
	/* function viewport() {
		const w = window.innerWidth;
		return w > 0     && w < 640   ? 0 :
			   w >= 640  && w <= 960  ? 0 :
			   w >= 960  && w <= 1200 ? 1 :
			   w >= 1200 && w <= 1600 ? 2 :
			   w >= 1600 ? 3 : false;
	} */
	
	
	function shrink(el) {
		el.removeClass(k);
		el.find(BODY).highcharts().setSize();
	}
	function expand(el) {
		if ( !el.hasClass(k) ) {
			el.addClass(k);
			el.find(BODY).highcharts().setSize();
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
	function initJqSortable() {
		els.components.sortable({
			items: "> div.panel",
			handle: ".uk-sortable-handle"
		});
	}
	function addCustomEvt() {
		wizard.on("submit", (e) => {
			console.log(e);
		});
		/*
			result  =  device/:device_id/detail
			forEach result.circuits as circuit
				if
					circuit.ServiceForward == service_id    ||
					circuit.ServiceBackward === service_id
				then
					return circuit.ID
		*/
	}
	inst.init = () => {
		els = u.getEls(ROOT);
		initJqSortable();
		
		els.add.on("click", wizard.start);
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
		
		wizard.init();
		widget.init();
		addCustomEvt();
	};
	
	return inst;
});