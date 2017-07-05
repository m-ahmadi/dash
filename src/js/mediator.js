define([
	"core/config",
	"core/token",
	"login",
	"core/uk",
	"header",
	"./toolbar",
	"./wizard/wizard",
	"./confirm",
	"./process",
	"./widget/widget"
], (
	conf,
	token,
	login,
	uk,
	header,
	toolbar,
	wizard,
	confirm,
	process,
	widget
) => {
	const inst = u.extend( newPubSub() );
	const ROOT = "[data-root='content']";
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
	const WAIT_TIME = 400;
	let counter = 1;
	let timer,
		timeout = 0;
	
	function refreshAll() {
		Object.keys(widgets).forEach(k => {
			let widget = widgets[k];
			setTimeout( widget.refresh, (timeout+=WAIT_TIME) );
		});
	}
	function autoRefresh(interval) {
		timer = setTimeout(() => {
			refreshAll();
			autoRefresh(interval);
		}, interval);
	}
	function cancelTimeout() {
		clearTimeout(timer);
	}
	function isStatWrong(n) {
		return n && (n === 403 || n === 404) ? true : false;
	}
	function fetchAllFail() {
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
	}
	function fetchAll() {
		let timer;
		if (counter === 1) {
			process.open();
			process.inc( u.randInt(5, 15) );
		}
		process.doing("Fetching widget list.");
		$.ajax({
			url: conf.ALT + conf.LOAD + token(),
			method: "GET",
			dataType: "json",
			cache: false
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
				process.inc(2);
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
		.fail(x => {
			if ( isStatWrong(x.status) ) {
				login.start(() => {
					process.resume();
					fetchAllFail();
				});
			} else {
				fetchAllFail();
			}
		})
		.always();
	}
	function save(done, fail, always) {
		$.ajax({
			url: conf.ALT + "dashboard/save" + token(), // "widget/add",
			method: "POST",
			contentType: "application/json",
			data: JSON.stringify(_WIDGETS_)
		})
		.done(done)
		.fail( x => isStatWrong(x.status) ? login.start(fail) : fail() )
		.always(always);
	}
	function onLoginErr(cb) {
		login.start(cb);
	}
	function css(el, prop) {
		el = u.isStr(el) ? $(el) : el;
		return parseInt( el.css(prop).slice(0, -2), 10 );
	}
	function adjustHeight() {
		let el = els.root;
		// let h = css(el, "min-height");
		let avail = window.innerHeight - ( css("#heading", "height") + css("#footer", "height") );
		el.css("min-height", avail);
	}
	function doAll(action) {
		if ( !u.isEmptyObj(widgets) ) {
			Object.keys(widgets).forEach( k => widgets[k][action]() );
		}
	}
	
	function addCustomEvt() {
		wizard.on("submit:create", (e, fn) => {
			processNote = uk.note.process(MSG[0], 0, "top-center");
			_WIDGETS_[e.id] = e;
			save(() => {
				widgets[e.id] = widget.create(els.widgets, e);
				fn(true);
				processNote.close();
			}, () => {
				fn(false);
				processNote.close();
				uk.note.error("Could not create the widget. Try again.");
			});
		});
		wizard.on("submit:edit", (e, fn) => {
			processNote = uk.note.process(MSG[0], 0, "top-center");
			_WIDGETS_[e.id] = e;
			save(() => {
				widgets[e.id].update(e);
				fn(true);
				processNote.close();
			}, () => {
				fn(false);
				processNote.close();
				uk.note.error("Could not edit the widget. Try again.");
			});
		});
		confirm.on("submit", (id, fn) => {
			let cb;
			processNote = uk.note.process(MSG[0], 0, "top-center");
			
			if (id === "delete_all") {
				_WIDGETS_ = {};
				cb = () => {
					Object.keys(widgets).forEach(k => widgets[k].remove());
					widgets = {};
				};
			} else if (id === "save_all") {
				
				els.widgets.find("> div").each((i, l) => {
					let d = $(l).data();
					_WIDGETS_[d.id].order = i;
					_WIDGETS_[d.id].expand = parseInt(d.expand);
					_WIDGETS_[d.id].min = d.min;
				});
			} else {
				delete _WIDGETS_[id];
				cb = () => {
					widgets[id].remove();
					delete widgets[id];
				};
			}
			
			save(() => {
				if (cb) cb();
				processNote.close();
				fn();
			}, () => {
				fn();
				uk.note.error("Couldn't remove the widget.");
				processNote.close();
			});
		});
		wizard.on("login_error", onLoginErr);
		widget.on("login_error", onLoginErr);
		widget.on("save_signal", e => {
			let s = e.action;
			if (s === "create") {
				
			} else if (s === "edit") {
			
				_WIDGETS_[e.id][e.key] = e.val;
				
			} else if (s === "delete") {
				
			}
			
			save(e.done, e.fail);
		});
		widget.on("create_node", (id, widget)=> {
			widgets[id] = widget;
			els.widgets.sortable("refresh");
		});
		widget.on("delete", id => {
			confirm.open(id);
		});
		widget.on("edit", e => {
			wizard.edit(e);
		});
		
		toolbar
			.on( "add", () => wizard.start( els.widgets.children().length ) )
			.on("save_all", () => {
				if ( !u.isEmptyObj(widgets) ) {
					confirm.open("save_all");
				}
			})
			.on("delete_all", () => {
				if ( !u.isEmptyObj(widgets) ) {
					confirm.open("delete_all");
				}
			})
			.on("min_all", doAll, "min")
			.on("max_all", doAll, "max")
			.on("shrink_all", doAll, "shrink")
			.on("expand_all", doAll, "expand")
			.on("start_auto_refresh", autoRefresh)
			.on("end_auto_refresh", cancelTimeout);
		header.on("time", offset => {
			
			widget.setGlobalTZ(offset);
		});
	}

	
	inst.beforeReady = () => {
		if ( token(true) ) {
			wizard.fetchGroups();
		}
	};
	inst.onReady = () => {
		els = u.getEls(ROOT);
		adjustHeight();
		$(window).on("resize", adjustHeight);
		els.widgets.sortable({
			items: "> div",
			handle: ".uk-sortable-handle",
			delay: 50,
			opacity: 0.5,
			distance: 5,
			revert: 300, // true
			scroll: false,
			tolerance: "pointer"
		//	placeholder: "ui-state-highlight"
		});
		
		$(window).on("beforeunload", e => {
			if (false) { // changed then return
				return null;
			}
			
		});
		
		addCustomEvt();
		header.init();
		toolbar.init(els.toolbar);
		wizard.init();
		confirm.init();
		process.init();
		login.init();
		widget.init();
		
		if ( !token(true) ) {
			login.start(() => {
				header.adjust();
				fetchAll();
				wizard.fetchGroups();
			});
		} else {
			header.adjust();
			fetchAll();
		}
	};
	window.ws = () => widgets;
	return inst;
});