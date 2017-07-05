define(["core/config", "core/token", "login"], (conf, token, login) => {
	const inst = u.extend( newPubSub() );
	const ROOT = "[data-root='header']";
	const temp = u.getTemps("header/");
	const FORMAT = "MMMM Do YYYY, h:mm:ss a";
	const HIDE_KLASS = "uk-hidden";
	let els;
	
	function getUserInfo(userCookie) {
		let o = userCookie;
		return {
			name:      o.Name,
			username:  o.Username,
			admin:     o.Admin,
			unreadMsg: o.UnreadMassage
		};
	}
	function fetchTime() {
		els.now.html( temp.smallSpinner() );
		$.ajax({
			url: conf.BASE + "time" + token(),
			method: "GET"
		})
		.done(data => {
			if ( data && u.isNum(data.offset) ) {
				els.now.empty();
				timer();
				inst.emit("time", data.offset);
			} else {
				els.now.html( temp.danger() );
			}
		})
		.fail(x => {
			els.now.html( temp.danger() );
		});
	}
	function timer(ts) {
		els.now.text( moment(ts).format(FORMAT) );
		setTimeout(timer, 1000);
	}
	
	inst.adjust = () => {
		fetchTime();
		let user = getUserInfo( JSON.parse( Cookies.get("user") ) );
		if (!user) throw new Error("No user cookie.");
		let umsg = user.UnreadMassage;
		if (user.admin) {
			els.adonly.removeClass(HIDE_KLASS);
		}
		els.name.text(user.name);
		// els.username.text(user.username);
		if ( u.isNum(umsg) && umsg > 0 ) {
			els.unredMsg
				.text(umsg)
				.removeClass(HIDE_KLASS);
		}
	};
	inst.init = () => {
		els = u.getEls(ROOT);
		els.now.on("click", "[data-retry]", fetchTime);
	};
	
	return inst;
});