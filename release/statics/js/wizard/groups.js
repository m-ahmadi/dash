define(["core/config", "core/token"], function (uk, conf) {
	var inst = u.extend(newPubSub());

	function fetchGroups() {
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
			inst.emit("groups_fetched", arr);
		}).fail(function (x) {
			if (x.status === 403) {
				inst.emit("login_error", !firstGroupFetch);
			} else {
				groupFail();
			}
		});
		if (firstGroupFetch) firstGroupFetch = false;
	}
	function init() {}

	inst.init = init;

	return inst;
});
//# sourceMappingURL=groups.js.map