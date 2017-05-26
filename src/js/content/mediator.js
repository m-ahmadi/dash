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
	let _WIDGETS_ = {};
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
			url: conf.ALT + "dashboard" + token(), // "widget/fetch",
			method: "GET",
			dataType: "json",
			header: {"cache-control": "no-cache"}
		})
		.done( data => {
			if ( u.isEmptyObj(data) ) {
				process.finish();
				process.log("No widgets to fetch", "primary");
				return;
			}
			_WIDGETS_ = data;
			const len = u.objLength(data);
			process.log(`Found ${len} widgets.`, "success");
			process.doing("Creating widgets.");
			
			let step = 100 - process.get() / len;
			let sorted = [];
			Object.keys(data).forEach(k => {
				sorted.push([data[k].order, k]);
			});
			sorted.sort();
			sorted.forEach(i => {
				let w = data[ i[1] ];
				process.inc(step);
				widgets[w.id] = widget.create(els.widgets, w);
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
	function save(done, fail) {
		$.ajax({
			url: conf.ALT + "dashboard/save" + token(), // "widget/add",
			method: "POST",
			contentType: "application/json",
			data: JSON.stringify(_WIDGETS_)
		})
		.done(done)
		.fail(fail);
	}
	
	function addCustomEvt() {
		wizard.on("submit", (e, fn) => {
			processNote = uk.note.process(MSG[0], 0, "top-center");
			_WIDGETS_[e.id] = e;
			save(() => {
				widgets[e.id] = widget.create(els.widgets, e);
				fn();
				processNote.close();
			}, () => {
				fn();
				processNote.close();
			});
			/* $.ajax({
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
			}); */
		});
		wizard.on("delete_confirm_submit", (id, fn) => {
			processNote = uk.note.process(MSG[0], 0, "top-center");
			
			delete _WIDGETS_[id];
			save(() => {
				widgets[id].remove();
				processNote.close();
				fn();
			}, () => {
				fn();
				uk.note.error("Couldn't remove the widget.");
				processNote.close();
			});
			/* $.ajax({
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
			}); */
		});
		widget.on("save_signal", e => {
			let s = e.action;
			if (s === "create") {
				
			} else if (s === "edit") {
			
				_WIDGETS_[e.id][e.key] = e.val;
				
			} else if (s === "delete") {
				
			}
			
			save(e.done, e.fail);
		});
		widget.on("create", (id, widget)=> {
			widgets[id] = widget;
			els.widgets.sortable("refresh");
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
	
	window.ws = {_WIDGETS_, save};
	return inst;
});