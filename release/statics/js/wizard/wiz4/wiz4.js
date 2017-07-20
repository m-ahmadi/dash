define(["core/uk", "core/config", "core/token", "../defaults", "../share", "./device", "./dataTable"], function (uk, conf, token, d, share, device, dataTable) {
	var inst = u.extend(newPubSub());
	var ROOT = "[data-root='wiz4']";
	var temp = u.getTemps("wizard/wiz4");

	var els = void 0;
	var c = { add: {}, edit: {} };
	var groups = void 0;
	var checkboxes = newPubSub();
	var firstGroupFetch = true;
	var toggle = {
		submit: function submit(b) {
			els.submit.attr({ disabled: !b });
		},
		prev: function prev(b) {
			els.prev.attr({ disabled: !b });
		},
		toDisable: function toDisable(b) {
			els.toDisable.prop({ disabled: !b });
		}
	};

	function fetchGroups() {
		if (!firstGroupFetch) {
			els.groups.html(temp.loading());
		}
		$.ajax({
			url: conf.BASE + "device/grouptree" + token(),
			method: "GET",
			data: "parent_only=true"
		}).done(function (d) {
			var arr = [];
			d.groups[0].Groups.forEach(function (i) {
				return arr.push({ name: i.Name, id: i.ID });
			});
			setGroups(arr);
			renderForm();
		}).fail(function (x) {
			if (x.status === 403) inst.emit("login_error");
			firstGroupFetch = false;
			clearAlerts();
			els.groups.html(temp.danger());
		});
	}
	function clearAlerts() {
		els.groups.empty();
	}
	function setGroups(arr) {
		arr.unshift({ id: "all", name: "All" });
		groups = arr;

		return inst;
	}
	function renderForm() {
		if (!groups) throw new Error("renderForm(): groups must be set before calling.");
		clearAlerts();
		var g = els.groups;
		g.html(temp.formRow({ groups: groups }));
		els.checkboxes = g.find(":checkbox");
		els.toDisable = els.toDisable.add(els.checkboxes);
		checkboxes.emit("ready", els.checkboxes);
		return inst;
	}

	c.retry = function () {
		clearAlerts();
		fetchGroups();
	};
	c.add.typeChange = function (e) {
		var val = e.target.value;
		var n1 = d.RANGE_COUNT_DEF[val];
		var n2 = d.RANGE_COUNT_MAX[val];
		els.rangeCount.val(n1);
		els.rangeCount.attr("max", n2);
	};
	c.add.countChange = function (e) {
		var el = $(e.target);
		var type = els.rangeType.val();
		var max = d.RANGE_COUNT_MAX[type];
		var min = parseInt(el.attr("min"), 10);
		var val = el.val();
		if (val) {
			var num = parseInt(val, 10);
			if (num > max) {
				el.val(max);
			} else if (num < min) {
				el.val(min);
			}
		} else {
			el.val(d.RANGE_COUNT_DEF[type]);
		}
	};
	c.edit.typeChange = function (e) {
		var curr = e.data;
		var v = e.target.value;
		var rc = els.rangeCount;
		var count = parseInt(rc.val(), 10);
		rc.attr("max", d.RANGE_COUNT_MAX[v]).change();
		// toggle.submit( v !== curr.type || count !== curr.count );
	};
	c.edit.countChange = function (e) {
		var curr = e.data;
		var el = $(e.target);
		var type = els.rangeType.val();
		var max = d.RANGE_COUNT_MAX[type];
		var min = parseInt(el.attr("min"), 10);
		var val = el.val();
		if (val) {
			var num = parseInt(val, 10);
			if (num > max) {
				el.val(max);
			} else if (num < min) {
				el.val(min);
			}
			// toggle.submit(num !== curr.count || type !== curr.type);
		} else {
			el.val(d.RANGE_COUNT_DEF[type]);
		}
	};

	function setChk(checkboxes, selected) {
		checkboxes.prop({ checked: false }).each(function (x, l) {
			this.checked = selected.indexOf(parseInt(this.value, 10)) !== -1;
		});
		if (selected.indexOf('all') !== -1) {
			checkboxes.filter("[value='all']").prop({ checked: true });
		}
	}
	function setForAdd() {
		inst.shallow = true;
		toggle.prev(true);
		if (els.checkboxes) {
			els.checkboxes.prop({ checked: false });
		} else {
			checkboxes.on("ready", function (els) {
				els.prop({ checked: false });
			});
		}

		dataTable.removeAll();
		device.off().on("select", function (device) {
			dataTable.addRow(device);
		});

		els.violated.prop({ checked: false });
		els.live.prop({ checked: false });

		/* els.rangeType
  	.off("change")
  	.on("change", c.add.typeChange)
  	.val(d.RANGE_TYPE)
  	.change();
  els.rangeCount
  	.off("change")
  	.on("change", c.add.countChange); */
	}
	function setForEdit(o) {
		var m = o.map;
		var devices = m.devices;
		toggle.prev(false);
		if (els.checkboxes) {
			setChk(els.checkboxes, m.groups);
		} else {
			checkboxes.on("ready", function (els) {
				setChk(els, m.groups);
			});
		}

		dataTable.removeAll();
		if (devices) {
			Object.keys(devices).forEach(function (k) {
				return dataTable.addRow(devices[k]);
			});
		}

		device.off().on("select", function (device) {
			dataTable.addRow(device);
		});

		els.violated.prop({ checked: m.violated });
		els.live.prop({ checked: m.live });

		/* let type = o.rangeType;
  let count = o.rangeCount;
  let curr = {
  	type: type,
  	count: count
  };
  els.rangeType
  	.off("change")
  	.on("change", curr, c.edit.typeChange)
  	.val(type)
  	.change();
  els.rangeCount
  	.off("change")
  	.on("change", curr, c.edit.countChange)
  	.val(count)
  	.change(); */
	}
	function get() {
		// let rangeTypeVal = els.rangeType.val();
		// let rangeCountVal = els.rangeCount.val();
		var res = {
			// rangeType: rangeTypeVal,
			// rangeCount: parseInt(rangeCountVal, 10),
			// rangeTitle: share.getRangeTitle(rangeTypeVal, rangeCountVal),
			map: {
				groups: null,
				devices: dataTable.getData() || null,
				violated: els.violated.prop("checked"),
				live: els.live.prop("checked")
			}
		};
		var groups = [];
		els.groups.find(":checkbox:checked").each(function (x, l) {
			var v = l.value;
			var id = v === "all" ? v : parseInt(v, 10);
			if (id) groups.push(id);
		});
		res.map.groups = groups;
		return res;
	}
	function close() {
		inst.shallow = false;
		uk.closeModal(ROOT);
	}

	inst.shallow = false;
	inst.setGroups = setGroups;
	inst.renderForm = renderForm;
	inst.fetchGroups = fetchGroups;

	inst.set = function (o) {
		o ? setForEdit(o) : setForAdd();
		return inst;
	};
	inst.open = function () {
		uk.openModal(ROOT);
	};
	inst.init = function () {
		els = u.getEls(ROOT);
		device.init(els.device);
		dataTable.init(els.table);

		els.prev.on("click", function (e) {
			if (e.target.disabled) return;
			inst.emit("prev");
		});
		els.groups.on("click", "[data-retry]", c.retry).on("click", "input:checkbox", function (e) {
			var chks = els.checkboxes;
			var el = e.target;
			var v = el.value;
			if (v === "all") {
				chks.prop({ checked: el.checked });
			} else {
				chks.filter("[value='all']").prop({ checked: false });
			}
		});

		els.submit.on("click", function (e) {
			if (e.target.disabled) return;
			toggle.toDisable(false);
			dataTable.toggleAll(false);
			inst.emit("submit", get(), function (success) {
				toggle.toDisable(true);
				dataTable.toggleAll(true);
				if (success) close();
			});
		});
	};

	window.w4 = function () {
		return els;
	};
	return inst;
});
//# sourceMappingURL=wiz4.js.map