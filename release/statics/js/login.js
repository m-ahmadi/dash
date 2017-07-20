define(["core/config", "core/uk"], function (conf, uk) {
	var inst = u.extend(newPubSub());
	var ROOT = "[data-root='login']";
	var temp = u.getTemps("login/");

	var MIN_USER_CHARS = 4;
	var MIN_PASS_CHARS = 4;
	var ALERT_TIMEOUT = 4000;

	var data = {
		username: undefined,
		password: undefined
	};
	var els = void 0,
	    callback = void 0;

	function alert(ctx, keep) {
		var alerts = els.alerts;
		alerts.append(temp.alert(ctx));
		if (!keep) {
			var el = alerts.find("[uk-alert]:last-child [uk-close]");
			setTimeout(function () {
				return el.click();
			}, ALERT_TIMEOUT);
		}
	}
	function request() {
		els.toDisable.attr({ disabled: true });
		els.process.append(temp.alert({ type: "primary", process: true, message: "Processing your request...", noClose: true }));
		$.ajax({
			url: conf.BASE + "user/login",
			method: "POST",
			data: data
		}).done(function (d) {
			els.process.empty();
			alert({ type: "success", success: true, message: "Login Succesfull." }, true);
			Cookies.remove("user");
			Cookies.set("user", d);
			callback();
		}).fail(function (x, stat) {
			var resTxt = x.responseText;
			o = resTxt ? JSON.parse(x.responseText) : { Msg: stat + ": " + x.state() };
			els.process.empty();
			alert({ type: "danger", danger: true, message: o.Msg + "." });
			els.toDisable.attr({ disabled: false });
		});
	}
	function changeSubmitBtn() {
		var u = data.username;
		var p = data.password;
		if (u && u.length >= MIN_USER_CHARS && p && p.length >= MIN_PASS_CHARS) {
			els.submit.attr({ disabled: false });
		} else {
			els.submit.attr({ disabled: true });
		}
	}
	function keyup(e) {
		var el = $(e.target);
		var val = el.val();
		var key = el.data().el;
		var min = key === "username" ? MIN_USER_CHARS : MIN_PASS_CHARS;
		data[key] = val;
		if (val.length >= min) {
			el.removeClass("uk-form-danger").addClass("uk-form-success");
		} else {
			el.removeClass("uk-form-success").addClass("uk-form-danger");
		}
		changeSubmitBtn();
	}
	function start(cb) {
		$("#overlay").remove();
		callback = cb;
		uk.openModal(ROOT);
		var inpust = els.username.add(els.password);
		inpust.val("");
		inpust.attr({ disabled: false });
		els.username.val("").focus();
		changeSubmitBtn();
	}
	function init() {
		els = u.getEls(ROOT);

		els.username.on("keyup blur input change", keyup);
		els.password.on("keyup blur input change", keyup);
		els.submit.on("click", function (e) {
			if (e.target.disabled) return;
			request();
		});
	}

	inst.init = init;
	inst.start = start;
	window.login = inst;
	return inst;
});
//# sourceMappingURL=login.js.map