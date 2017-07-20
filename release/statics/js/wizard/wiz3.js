define(["core/uk", "core/config", "core/token", "./defaults", "./share"], function (uk, conf, token, d, share) {
	var inst = u.extend(newPubSub());
	var ROOT = "[data-root='wiz3']";
	var temp = u.getTemps("wizard/wiz3");

	var els = void 0;
	var firstGroupFetch = true;
	var c = { add: {}, edit: {} }; // event callbacks
	var toggle = {
		submit: function submit(b) {
			els.submit.attr({ disabled: !b });
		},
		prev: function prev(b) {
			els.prev.attr({ disabled: !b });
		},
		toDisable: function toDisable(b) {
			els.toDisable.attr({ disabled: !b });
		},
		modal: function modal(b) {
			uk[b ? "openModal" : "closeModal"](ROOT);
		}
	};

	function groupSucc(arr) {
		if (!els) {
			setTimeout(groupSucc, 1000);return;
		}
		els.stat.empty();
		arr.forEach(function (i) {
			els.groups.append(temp.groupOpt({ name: i.name, value: i.id }));
		});
	}
	function groupFail() {
		if (!els) {
			setTimeout(groupFail, 1000);return;
		}
		els.btnParent.empty().append(temp.groupOptBtn());
		els.stat.empty().append(temp.groupOptDanger());
	}
	function fetchGroups() {
		if (!firstGroupFetch) {
			els.btnParent.empty();
			els.stat.empty().append(temp.smallSpinner());
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
			groupSucc(arr);
			inst.emit("group_fetch_succ", arr);
		}).fail(function (x) {
			if (x.status === 403) {
				inst.emit("login_error");
			} else {
				inst.emit("group_fetch_fail");
			}
			groupFail();
		});
		firstGroupFetch = false;
	}

	c.groupChange = function (e) {
		var curr = e.data;
		var v = e.target.value;
		if (curr) {
			els.submit.attr({ disabled: !v || parseInt(v, 10) === curr.groupId });
		} else {
			els.submit.attr({ disabled: v ? false : true });
		}
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
		toggle.submit(v !== curr.type || count !== curr.count);
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
			toggle.submit(num !== curr.count || type !== curr.type);
		} else {
			el.val(d.RANGE_COUNT_DEF[type]);
		}
	};
	function setForAdd() {
		inst.shallow = true;
		toggle.prev(true);
		els.rangeType.off("change").on("change", c.add.typeChange).val(d.RANGE_TYPE).change();
		els.rangeCount.off("change").on("change", c.add.countChange);
		els.groups.off("change").on("change", c.groupChange).val("").change();
	}
	function setForEdit(o) {
		toggle.prev(false);
		var type = o.rangeType;
		var count = o.rangeCount;
		var groupId = o.group.id;
		var curr = {
			type: type,
			count: count
		};

		els.rangeType.off("change").on("change", curr, c.edit.typeChange).val(type).change();

		els.rangeCount.off("change").on("change", curr, c.edit.countChange).val(count).change();

		els.groups.off("change").on("change", { groupId: groupId }, c.groupChange).val(groupId).change();
	}
	function get() {
		var rangeTypeVal = els.rangeType.val();
		var rangeCountVal = els.rangeCount.val();
		var groups = els.groups;
		return {
			rangeType: rangeTypeVal,
			rangeCount: parseInt(rangeCountVal, 10),
			rangeTitle: share.getRangeTitle(rangeTypeVal, rangeCountVal),
			group: {
				id: parseInt(groups.val(), 10),
				name: groups.find(":selected").text()
			},
			statKpis: conf.STAT_KPIS
		};
	}
	function close() {
		inst.shallow = false;
		toggle.modal(false);
	}

	inst.open = function () {
		toggle.modal(true);
		return inst;
	};
	inst.set = function (o) {
		o ? setForEdit(o) : setForAdd();
		return inst;
	};
	inst.fetchGroups = fetchGroups;
	inst.init = function () {
		els = u.getEls(ROOT);

		els.prev.on("click", function (e) {
			if (e.target.disabled) return;
			inst.emit("prev");
		});

		els.btnParent.on("click", "[data-retry]", fetchGroups);

		els.submit.on("click", function (e) {
			if (e.target.disabled) return;
			var toDis = els.toDisable;
			toDis.attr({ disabled: true });
			inst.emit("submit", get(), function (success) {
				toDis.attr({ disabled: false });
				if (success) close();
			});
		});
	};

	return inst;
});
//# sourceMappingURL=wiz3.js.map