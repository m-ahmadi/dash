define(["uk", "config", "token", "./defaults", "./share"], (uk, conf, token, d, share) => {
	const inst = u.extend( newPubSub() );
	const ROOT = "[data-root='wiz3']";
	const temp = Handlebars.templates;
	let els;
	let type;
	let firstGroupFetch = true;
	
	function groupSucc(arr) {
		if (!els) { setTimeout(groupSucc, 1000); return; }
		els.stat.empty();
		arr.forEach(i => {
			els.groups.append( temp.groupOpt({name: i.name, value: i.id}) );
		});
	}
	function groupFail() {
		if (!els) { setTimeout(groupFail, 1000); return; }
		els.btnParent.empty().append( temp.groupOptBtn() );
		els.stat.empty().append( temp.groupOptDanger() );
	}
	function fetchGroups() {
		if (!firstGroupFetch) {
			els.btnParent.empty();
			els.stat.empty().append( temp.smallSpinner() );
		}
		$.ajax({
			url: conf.BASE + "device/grouptree" + token(),
			method: "GET",
			data: "parent_only=true"
		})
		.done(d => {
			let arr = [];
			d.groups[0].Groups.forEach( i => arr.push({name: i.Name, id: i.ID}) );
			groupSucc(arr);
		})
		.fail(x => {
			if (x.status === 403) {
				inst.emit( "login_error", () => open(WIZ_3) )
			} else {
				groupFail();
			}
		});
		if (firstGroupFetch) firstGroupFetch = false;
	}
	
	function reset() {
		els.groups.val("").change();
		els.rangeType.off("change").on("change", rangeType).val(d.RANGE_TYPE).change();
		els.rangeCount.off("keyup").on("keyup", rangeCount);
	}
	function set(o) {
		let rangeType = els.rangeType;
		let rangeCount = els.rangeCount;
		
		els.groups.val(o.group).change();
		rangeType.val(o.rangeType).change();
		rangeCount.val(o.rangeCount);
		
		let enableSubmit = () => {
			els.submit.attr({disabled: false})
			rangeType.off("change", enableSubmit);
			rangeCount.off("change", enableSubmit);
		};
		rangeType.one("change", enableSubmit);
		rangeCount.one("change", enableSubmit);
	}
	function start(o) {
		reset();
		if (o) set(o);
		uk.openModal(ROOT);
	}
	function get() {
		let rangeTypeVal = els.rangeType.val();
		let rangeCountVal = els.rangeCount.val();
		return {
			rangeType: rangeTypeVal,
			rangeCount: parseInt(rangeCountVal, 10),
			rangeTitle: share.getRangeTitle(rangeTypeVal, rangeCountVal),
			group: parseInt(els.groups.val(), 10),
			statKpis: conf.STAT_KPIS
		};
	}
	function rangeType(e) {
		const val = e.target.value;
		const n1 = d.RANGE_COUNT_DEF[val];
		const n2 = d.RANGE_COUNT_MAX[val];
		els.rangeCount.val(n1);
		els.rangeCount.attr("max", n2);
	}
	function rangeCount(e) {
		const el = e.target;
		const type = els.rangeType.val();
		const max = d.RANGE_COUNT_MAX[type];
		const min = parseInt($(el).attr("min"), 10);
		const val = el.value;
		if (val) {
			let num = parseInt(val, 10);
			if (num > max) {
				el.value = max;
			} else if (num < min) {
				el.value = min;
			}
		}
	}
	function init() {
		els = u.getEls(ROOT);
		
		els.prev.on( "click", () => inst.emit("prev", type) );
		
		els.btnParent.on("click", "[data-retry]", fetchGroups);
		els.groups.on("change", e => {
			let v = e.target.value;
			if (v) {
				els.submit.attr({disabled: false});
			} else {
				els.submit.attr({disabled: true});
			}
			
		});
		els.submit.on("click", () => {
			let toDis = els.toDisable; 
			toDis.attr({disabled: true});
			inst.emit("submit", get(), success => {
				toDis.attr({disabled: false});
				if (success) uk.closeModal(ROOT);
			});
		});
	}
	
	inst.start = start;
	inst.fetchGroups = fetchGroups;
	inst.init = init;
	
	return inst;
});