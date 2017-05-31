define(["config", "uk"], (conf, uk) => {
	const inst = u.extend( newPubSub() );
	const ROOT = "[data-root='login']";
	const MIN_USER_CHARS = 4;
	const MIN_PASS_CHARS = 4;
	const ALERT_TIMEOUT = 4000;
	const temp = Handlebars.templates;
	const data = {
		username: undefined,
		password: undefined
	};
	let els, callback;
	
	
	function alert(ctx, keep) {
		let alerts = els.alerts;
		alerts.append( temp.loginAlert(ctx) );
		if (!keep) {
			let el = alerts.find("[uk-alert]:last-child [uk-close]");
			setTimeout(() => el.click(), ALERT_TIMEOUT);
		}
	}
	function request() {
		els.toDisable.attr({disabled: true});
		els.process.append( temp.loginAlert({type: "primary", process: true, message: "Processing your request..."}) );
		$.ajax({
			url: conf.BASE + "user/login",
			method: "POST",
			data: data
		})
		.done(d => {
			els.process.empty();
			alert({type: "success", success: true, message: "Login Succesfull."}, true);
			Cookies.remove("user");
			Cookies.set("user", d);
			callback();
		})
		.fail(x => {
			let o = JSON.parse( x.responseText );
			els.process.empty();
			alert({type: "danger", danger: true, message: `${o.Msg}.`});
			els.toDisable.attr({disabled: false});
		});
	}
	function changeSubmitBtn() {
		const u = data.username;
		const p = data.password;
		if ( (u && u.length >= MIN_USER_CHARS) && (p && p.length >= MIN_PASS_CHARS) ) {
			els.submit.attr({disabled: false});
		} else {
			els.submit.attr({disabled: true});
		}
	}
	function keyup(e) {
		let el = $(e.target);
		let val = el.val();
		let key = el.data().el;
		let min = key === "username" ? MIN_USER_CHARS : MIN_PASS_CHARS;
		data[key] = val;
		if (val.length >= min) {
			el.removeClass("uk-form-danger").addClass("uk-form-success");
		} else {
			el.removeClass("uk-form-success").addClass("uk-form-danger");
		}
		changeSubmitBtn();
	}
	function open(cb) {
		callback = cb;
		uk.openModal(ROOT);
		els.username.focus();
		changeSubmitBtn();
	}
	function init() {
		els = u.getEls(ROOT);
		
		els.username.on("keyup", keyup);
		els.password.on("keyup", keyup);
		els.submit.on("click", e => {
			request();
		});
	}
	
	inst.init = init;
	inst.open = open;
	window.login = inst;
	return inst;
});