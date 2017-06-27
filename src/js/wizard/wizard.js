define([
	"config",
	"token",
	"uk",
	"./defaults",
	"./share",
	"./wiz1",
	"./wiz2/wiz2",
	"./wiz3",
	"./wiz4"
], (
	conf,
	token,
	uk,
	d,
	share,
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
	function emitLoginErr(cb) {
		inst.emit("login_error", cb);
	}
	function emitSubmit(data, cb) {
		let eStr = editMode ? "submit:edit" : "submit:create";
		inst.emit(eStr, merge(data), cb);
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
		wiz2.on("prev", () => {
			
			wiz1.open();
		});
		wiz3.on("prev", wiz1.open);
		wiz4.on("prev", wiz1.open);
		
		wiz2
			.on("submit", (data, cb) => {
				let eStr = editMode ? "submit:edit" : "submit:create";
				inst.emit(eStr, merge(data), cb);
			})
			.on("login_error", emitLoginErr, wiz2.open);
		
		wiz3
			.on("submit", emitSubmit)
			.on("login_error", emitLoginErr, wiz3.open);
		
		wiz4.on("submit", emitSubmit);
	}

	inst.start = start;
	inst.edit = edit;
	
	inst.init = () => {
		wiz1.init();
		wiz2.init();
		wiz3.init();
		wiz4.init();
		
		addCustomEvt();
	};
	inst.beforeInit = () => {
		wiz3.fetchGroups();
	};
	
	return inst;
});