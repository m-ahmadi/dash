define([
	"config",
	"token",
	"uk",
	"./wizard",
	"./process",
	"./Widget/Widget"
], (
	conf,
	token,
	uk,
	wizard,
	process,
	widget
) => {
	const inst = u.extend( newPubSub() );
	const ROOT = "[data-root='content']";
	const temp = Handlebars.templates;
	const MSG = [
		"Processing your request...",
		"Fetching your widgets..."
	];
	let widgets = {};
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
			
			let step = 100 - process.get() / data.length;
			data.forEach(i => {
				process.inc(step);
				widgets[i.id] = widget.create(els.widgets, i);
			});
			process.log("Finished.", "success");
			process.close();
		})
		.fail(()=> {
			if (counter > 1) {
				process.doing(` (${counter}${ori[counter]} attempt)`, true);
			}
			counter += 1;
			process.log("Fetching widget list failed.", "danger");
			if (counter > 3) {
				process.log("Aborted.", "danger");
				return;
			}
			setTimeout(fetchAll, 1000);
		});
	}
	function addCustomEvt() {
		wizard.on("submit", (e, fn) => {
			processNote = uk.note.process(MSG[0], 0, "top-center");
			$.ajax({
				url: conf.TMP + "widget/add",
				method: "GET",
				data: {
					widget: JSON.stringify(e)
				}
			})
			.done(() => {
				widgets[e.id] = widget.create(els.widgets, e);
				fn();
				processNote.close();
			})
			.fail(() => {
				fn();
				processNote.close();
			});
		});
		wizard.on("delete_confirm", (id, fn) => {
			processNote = uk.note.process(MSG[0], 0, "top-center");
			$.ajax({
				url: conf.TMP + "widget/delete",
				method: "GET",
				data: {id: id}
			})
			.done(() => {
				widgets[id].remove();
				processNote.close();
				fn();
			})
			.fail(() => {
				fn();
				uk.note.error("Couldn't remove the widget.");
				processNote.close();
			});
		});
		widget.on("create", (id, widget )=> {
			widgets[id] = widget;
			// sortable( "refresh" )
		});
		widget.on("delete", id => {
			wizard.deleteConfirm(id);
		});
	}
	inst.init = () => {
		els = u.getEls(ROOT);
		
		els.widgets.sortable({
			items: "> div.panel",
			handle: ".uk-sortable-handle",
			delay: 50,
			opacity: 0.5,
			distance: 5,
			revert: 300, // true
			scroll: false,
			tolerance: "pointer"
		//	placeholder: "ui-state-highlight"
		});
		
		let index;
		els.widgets.on("sortstart", (e, ui) => {
			index = ui.item.index();
		});
		els.widgets.on("sortupdate", (e, ui) => {
			let el = ui.item;
			let other = els.widgets.children().eq(index);
			
			widgets[ el.data().id ].changeOrder( el.index() );
			widgets[ other.data().id ].changeOrder( other.index() );
		});
		els.add.on("click", () => {
			wizard.start( els.widgets.children().length );
		});
		
		wizard.init();
		process.init();
		addCustomEvt();
		widget.init();
		fetchAll();
	};
	
	window.ws = () => { return widgets; };
	return inst;
});