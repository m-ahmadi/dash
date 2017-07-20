define([], function () {
	var inst = u.extend(newPubSub());
	var temp = u.getTemps("wizard/wiz4");

	var parent = void 0;
	var rows = {};

	function newRow(device) {
		var id = device.id;
		parent.append(temp.deviceRow({
			id: id,
			name: device.name
		}));
		var root = parent.children().last();
		var els = u.getEls(root);
		els.remove.on("click", remove);

		function bleep() {
			els.root.effect("highlight", { color: "#bcff65" }, 400);
		}
		function toggle(b) {
			els.toDisable.attr({ disabled: !b });
		}
		function remove() {
			parent.find("> tr[data-id=\"" + id + "\"]").remove();
			delete rows[id];
			inst.emit("remove", id);
			if (u.isEmptyObj(rows)) inst.emit("remove_all");
		}

		return {
			id: id,
			name: device.name,
			toggle: toggle, remove: remove, bleep: bleep
		};
	}

	function addRow(device) {
		var id = device.id;
		if (!rows[id]) {
			rows[id] = newRow(device);
			inst.emit("add", id);
		} else {
			rows[id].bleep();
		}
	}
	function getData() {
		if (u.isEmptyObj(rows)) return;
		var data = {};
		Object.keys(rows).forEach(function (k) {
			var row = rows[k];
			var id = row.id;
			data[id] = {
				id: id,
				name: row.name
			};
		});
		return data;
	}
	function doAll(action, arg) {
		Object.keys(rows).forEach(function (k) {
			return rows[k][action](arg);
		});
	}

	inst.addRow = addRow;
	inst.getData = getData;

	inst.removeAll = function () {
		doAll("remove");
		return inst;
	};
	inst.toggleAll = function (b) {
		doAll("toggle", b);
		return inst;
	};

	inst.init = function (root) {
		parent = root;
	};
	return inst;
});
//# sourceMappingURL=dataTable.js.map