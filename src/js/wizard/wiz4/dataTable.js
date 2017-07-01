define([], () => {
	const inst = u.extend( newPubSub() );
	const temp = u.getTemps("wizard/wiz4");
	
	let parent;
	let rows = {};
	
	function newRow(device) {
		let id = device.id;
		parent.append(temp.deviceRow({
			id: id,
			name: device.name
		}));
		let root = parent.children().last();
		let els = u.getEls(root);
		els.remove.on("click", remove);
		
		function bleep() {
			els.root.effect("highlight", {color: "#bcff65"}, 400);
		}
		function toggle(b) {
			els.toDisable.attr({disabled: !b});
		}
		function remove() {
			parent.find(`> tr[data-id="${id}"]`).remove();
			delete rows[id];
			inst.emit("remove", id);
			if ( u.isEmptyObj(rows) ) inst.emit("remove_all");
		}
		
		return {
			id: id,
			name: device.name,
			toggle, remove, bleep
		};
	}
	
	function addRow(device) {
		let id = device.id;
		if ( !rows[id] ) {
			rows[id] = newRow(device);
			inst.emit("add", id);
		} else {
			rows[id].bleep();
		}
	}
	function getData() {
		if ( u.isEmptyObj(rows) ) return;
		let data = {};
		Object.keys(rows).forEach(k => {
			let row = rows[k];
			let id = row.id;
			data[id] = {
				id: id,
				name: row.name
			};
		});
		return data;
	}
	function doAll(action, arg) {
		Object.keys(rows).forEach( k => rows[k][action](arg) );
	}
	
	inst.addRow = addRow;
	inst.getData = getData;
	
	inst.removeAll = () => {
		doAll("remove");
		return inst;
	};
	inst.toggleAll = b => {
		doAll("toggle", b);
		return inst;
	};
	
	inst.init = (root) => {
		parent = root;
	};
	return inst;
});