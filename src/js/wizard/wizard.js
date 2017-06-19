define([
	"config",
	"token",
	"uk",
	"./defaults",
	"./fn",
	"./wiz1",
	"./wiz2",
	"./wiz3",
	"./wiz4"
], (
	conf,
	token,
	uk,
	d,
	fn,
	wiz1,
	wiz2,
	wiz3,
	wiz4
) => {
	const inst = u.extend( newPubSub() );
	const temp = Handlebars.templates;
	
	let id, order, editMode;
	
	function uid() {
		return Math.floor( Math.random() * 1000 );
	}
	function newData() {
		let data = {
			id:         id || uid(),
			type:       undefined,
			rangeType:  undefined,
			rangeCount: undefined,
			rangeTitle: undefined,
			device:     undefined,
			service:    undefined,
			sensors:    undefined,
			group:      undefined,
			statKpis:   undefined,
			order:      order,
			expand:     0,
			min:        false
		};
		return data;
	}
	
	function merge(o) {
		let data = newData();
		
		data.type = wiz1.get();
		
		Object.keys(o).forEach(k => {
			data[k] = o[k];
		});
		
		return data;
	}
	
	function start(childs) {
		id = undefined;
		order = childs ? childs : 0;
		editMode = false;
		wiz1.start();
	}
	function edit(o) {
		let w = JSON.parse(JSON.stringify(o)); // deep copy
		id = w.id;
		order = w.order;
		editMode = true;
		let t = w.type;
		
		if (t === 0) {
			
			wiz1.set(w);
			wiz2.start(w);
			
		} else if (t === 1) {
			
			wiz1.set(w);
			wiz3.start(w);
			
		} else if (t === 2) {
			
			wiz1.set(w);
			wiz3.start(w);
			
		} else if (t === 3) {
			
			wiz1.set(w);
			wiz4.start(w);
			
		}
	}
	
	function emitSubmit(d) {
		inst.emit("submit", d);
	}
	
	
	
	function addCustomEvt() {
		wiz1.on("next", type => {
			switch (type) {
				case 0: wiz2.start(); break;
				case 1: wiz3.start(); break;
				case 2: wiz3.start(); break;
				case 3: wiz4.start(); break;
			}
		});
		wiz2.on( "prev", () => wiz1.start({type:0}) );
		wiz3.on( "prev", t  => wiz1.start({type:t}) );
		wiz4.on( "prev", () => wiz1.start({type:3}) );
		
		wiz2.on("submit", (d, cb) => {
			inst.emit(editMode ? "submit:edit" : "submit:create", merge(d), cb);
		});
		wiz3.on("submit", (d, cb) => {
			inst.emit(editMode ? "submit:edit" : "submit:create", merge(d), cb);
		});
		wiz4.on("submit", emitSubmit);
	}
	function beforeInit() {
		wiz3.fetchGroups();
	}
	function init() {
		// reset();
		wiz1.init();
		wiz2.init();
		wiz3.init();
		wiz4.init();
		
		addCustomEvt();
	}
	
	inst.start = start;
	inst.edit = edit;
	inst.init = init;
	inst.beforeInit = beforeInit;
	return inst;
});

/* 
function alertMsg(w, msg) {
	let set;
	switch (w) {
		case 2: set = wiz2; break;
		case 3: set = wiz3; break;
		case 4: set = wiz4; break;
	}
	set.toAppendAlert.append( temp.alert({message: msg}) );
}
*/