define([
	"config",
	"token",
	"uk",
	"./wizard/main",
	"./widget/main"
], (
	conf,
	token,
	uk,
	wizard,
	widget
) => {
	const inst = u.extend( newPubSub() );
	const ROOT = "[data-root='content']";
	const BODY = "[data-container]";
	const temp = Handlebars.templates;
	const MSG = "Processing your request...";
	let els, processNote;
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
	
	function fetchAll() {
		/* $.ajax({
			url: "127.0.0.1:2000/widget/fetchAll"
		})
		.done()
		.fail(); */
	}
	function shrink(el) {
		el.removeClass(k);
		el.find("[data-resize]").html(temp.btnExpand);
		el.find(BODY).highcharts().setSize();
	}
	function expand(el) {
		if ( !el.hasClass(k) ) {
			el.addClass(k);
			el.find("[data-resize]").html(temp.btnShrink);
			el.find(BODY).highcharts().setSize();
		}
	}
	function initJqSortable() {
		els.widgets.sortable({
			items: "> div.panel",
			handle: ".uk-sortable-handle"
		});
	}
	function addCustomEvt() {
		let cb;
		wizard.on("submited", e => {
			cb = e.cb;
			processNote = uk.note.process(MSG, 0, "top-center");
			widget.add(e, els.widgets);
		});
		widget.on("error", e => {
			processNote.close();
			if (e && e.set && e.msg) {
				wizard.alertMsg(e.set, e.msg);
			}
			cb();
		});
		widget.on("added", e => {
			processNote.close();
			cb();
			wizard.close();
		});
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
		addCustomEvt();
	};
	
	return inst;
});