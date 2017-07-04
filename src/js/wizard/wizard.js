define([
	"core/config",
	"core/token",
	"core/uk",
	"./defaults",
	"./share",
	"./wiz1",
	"./wiz2/wiz2",
	"./wiz3",
	"./wiz4/wiz4"
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
	
	let id, order, addMode, shallow;
	let w;
	let prefetch = true;
	
	function uid() {
		return Math.floor( Math.random() * 1000 );
	}
	function newData() {
		let data = {
			id:         id || uid(),
			type:       null,
			rangeType:  null,
			rangeCount: null,
			rangeTitle: null,
			device:     null,
			service:    null,
			sensors:    null,
			group:      null,
			statKpis:   null,
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
		addMode = true;
		shallow = false;
		w = undefined;
		id = undefined;
		order = childs ? childs : 0;
		wiz1.set().open();
	}
	function edit(o) {
		addMode = false;
		shallow = false;
		w = JSON.parse( JSON.stringify(o) ); // deep copy
		id = w.id;
		order = w.order;
		wiz1.set(w);
		switch (w.type) {
			case 0: wiz2.set(w).open(); break;
			case 1: wiz3.set(w).open(); break;
			case 2: wiz3.set(w).open(); break;
			case 3: wiz4.set(w).open(); break;
		}
	}
	function emitLoginErr(cb) {
		inst.emit("login_error", cb);
	}
	function emitSubmit(data, cb) {
		let eStr = addMode ? "submit:create" : "submit:edit";
		inst.emit(eStr, merge(data), cb);
	}
	function go(which) {
		if (!which.shallow) {
			if (addMode) {
				which.set();
			} else {
				which.set(w);
			}
		}
		which.open();
	}
	function back(state) {
		shallow = state;
		wiz1.open();
	}
	function addCustomEvt() {
		wiz1.on("next", t => {
			if (t === 0) {
				go(wiz2);
			} else if (t === 1) {
				go(wiz3);
			} else if (t === 2) {
				go(wiz3);
			} else if (t === 3) {
				go(wiz4);
			}
		});
		wiz2.on("prev", back);
		wiz3.on("prev", back);
		wiz4.on("prev", back);
		
		wiz2
			.on("submit", emitSubmit)
			.on("login_error", emitLoginErr, wiz2.open);
		
		wiz3
			.on("submit", emitSubmit)
			.on("login_error", emitLoginErr, wiz3.open)
			.on("group_fetch_succ", (groupsArr) => {
				wiz4.setGroups(groupsArr).renderForm();
			})
			.on("group_fetch_fail", () => {
				wiz4.fetchGroups();
			});
		
		wiz4
			.on("submit", emitSubmit)
			.on("login_error", emitLoginErr, wiz4.open);
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
	inst.fetchGroups = () => {
		wiz3.fetchGroups(); 
	};
	
	return inst;
});