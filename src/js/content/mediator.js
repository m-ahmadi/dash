define([
	"config",
	"token",
	"uk",
	"./wizard/main",
	"./widget/main",
	"./process",
	"./Wiget/Widget"
], (
	conf,
	token,
	uk,
	wizard,
	widget,
	process,
	newWidget
) => {
	const inst = u.extend( newPubSub() );
	const ROOT = "[data-root='content']";
	const temp = Handlebars.templates;
	const MSG = [
		"Processing your request...",
		"Fetching your widgets..."
	];
	let els, processNote;
	
	/* function viewport() {
		const w = window.innerWidth;
		return w > 0     && w < 640   ? 0 :
			   w >= 640  && w <= 960  ? 0 :
			   w >= 960  && w <= 1200 ? 1 :
			   w >= 1200 && w <= 1600 ? 2 :
			   w >= 1600 ? 3 : false;
	} */
	
	const ori = ["", "st","nd","rd","th","th","th","th","th","th"];
	
	let counter = 1;
	
	function initJqSortable() {
		els.widgets.sortable({
			items: "> div.panel",
			handle: ".uk-sortable-handle"
		});
	}
	function fetchAll() {
		let timer;
		if (counter === 1) {
			process.open();
		}
		process.doing("Fetching widget list.");
		$.ajax({
			url: conf.TMP + "widget/fetch",
			method: "GET",
			dataType: "json"
		})
		.done( data => {
			if (!data.length) {
				process.finish();
				process.log("No widgets to fetch", "primary");
				return;
			}
			process.log(`Found ${data.length} widgets.`, "success");
			process.doing("Creating widgets.");
			
			widget.addMany(data, els.widgets, () => {
				process.log("Finished.", "success");
				process.close();
			});
		})
		.fail((x, err)=> {
			if (counter > 1) {
				process.doing(` (${counter}${ori[counter]} attempt)`, true);
			}
			counter += 1;
			process.log(`Fetching widget list failed. ${err}`, "danger");
			if (counter > 3) return;
			setTimeout(fetchAll, 1000);
		});
	}
	function addCustomEvt() {
		let cb;
		wizard.on("submit", (e, fn) => {
			cb = fn;
			processNote = uk.note.process(MSG[0], 0, "top-center");
			widget.add(e, els.widgets);
		});
		widget.on("create_err", msg => {
			if (processNote) {
				processNote.close();
			}
			if ( wizard.isOpen() ) {
				wizard.alertMsg(2, msg);
			}
			cb ? cb() : undefined;
		});
		widget.on("add", many => {
			!many && processNote ? processNote.close() : undefined;
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
				case 0: widget.shrink(panel); break;
				case 1: widget.expand(panel); break;
				case 2: widget.edit(panel); break;
				case 3: widget.remove(panel); break;
			}
		});
		
		wizard.init();
		process.init();
		addCustomEvt();
		fetchAll();
	};
	
	window.newWidget = newWidget;
	return inst;
});