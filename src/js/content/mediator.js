define([
	"config",
	"token",
	"uk",
	"./wizard/main",
	"./widget/main",
	"./process"
], (
	conf,
	token,
	uk,
	wizard,
	widget,
	process
) => {
	const inst = u.extend( newPubSub() );
	const ROOT = "[data-root='content']";
	const BODY = "[data-container]";
	const temp = Handlebars.templates;
	const MSG = [
		"Processing your request...",
		"Fetching your widgets..."
	];
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
	
	function fetchAll(notFirst) {
		// process.open();
		if (!notFirst) {
			processNote = uk.note.process(MSG[1], 0, "top-center");
			els.add.attr({disabled: true});
		}
		$.ajax({
			url: conf.TMP + "widget/fetch",
			method: "GET",
			dataType: "json"
		})
		.done( data => {
			if (!data.length) {
				processNote.close();
				els.add.attr({disabled: false});
				uk.note.info("No widgets to fetch.", undefined, "top-center");
			}
			widget.addMany(data, els.widgets, () => {
				processNote.close();
				els.add.attr({disabled: false});
			});
		})
		.fail(()=> {
			setTimeout(fetchAll, 1000, true);
		});
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
		wizard.on("submit", (e, fn) => {
			cb = fn;
			processNote = uk.note.process(MSG[0], 0, "top-center");
			widget.add(e, els.widgets, true);
		});
		widget.on("error", e => {
			processNote.close();
			if (e && e.set && e.msg) {
				wizard.alertMsg(e.set, e.msg);
			}
			cb ? cb() : undefined;
		});
		widget.on("add", many => {
			!many ? processNote.close() : undefined;
			cb ? cb() : undefined;
			if ( wizard.isOpen() ) {
				wizard.close();
			}
		});
	}
	inst.init = () => {
		els = u.getEls(ROOT);
		initJqSortable();
		
		els.add.on("click", () => {
			wizard.start( els.widgets.children().length );
		});
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
		process.init();
		addCustomEvt();
		fetchAll();
	};
	
	return inst;
});