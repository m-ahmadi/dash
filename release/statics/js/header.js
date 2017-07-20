define(["core/config", "core/token", "login"], function (conf, token, login) {
	var inst = u.extend(newPubSub());
	var ROOT = "[data-root='header']";
	var temp = u.getTemps("header/");
	var FORMAT = "MMMM Do YYYY, h:mm:ss a";
	var HIDE_KLASS = "uk-hidden";
	var els = void 0;

	function getUserInfo(userCookie) {
		var o = userCookie;
		return {
			name: o.Name,
			username: o.Username,
			admin: o.Admin,
			unreadMsg: o.UnreadMassage
		};
	}
	function fetchTime() {
		els.now.html(temp.smallSpinner());
		$.ajax({
			url: conf.BASE + "time" + token(),
			method: "GET"
		}).done(function (data) {
			if (data && u.isNum(data.offset)) {
				els.now.empty();
				timer();
				inst.emit("time", data.offset);
			} else {
				els.now.html(temp.danger());
			}
		}).fail(function (x) {
			els.now.html(temp.danger());
		});
	}
	function timer(ts) {
		els.now.text(moment(ts).format(FORMAT));
		setTimeout(timer, 1000);
	}

	inst.adjust = function () {
		fetchTime();
		var user = getUserInfo(JSON.parse(Cookies.get("user")));
		if (!user) throw new Error("No user cookie.");
		var umsg = user.UnreadMassage;
		if (user.admin) {
			els.adonly.removeClass(HIDE_KLASS);
		}
		els.name.text(user.name);
		// els.username.text(user.username);
		if (u.isNum(umsg) && umsg > 0) {
			els.unredMsg.text(umsg).removeClass(HIDE_KLASS);
		}
	};
	inst.init = function () {
		els = u.getEls(ROOT);
		els.now.on("click", "[data-retry]", fetchTime);
	};

	return inst;
});
//# sourceMappingURL=header.js.map