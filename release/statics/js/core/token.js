define(function () {
	function main(pure) {
		var cookie = void 0,
		    o = void 0,
		    res = void 0;
		cookie = Cookies.get("user");

		if (cookie && u.isStr(cookie)) {
			o = JSON.parse(cookie);
			res = o.Token;
		} else {
			res = false;
		}

		return pure ? res : "?Token=" + res;
	}

	window.tok = main;
	return main;
});
//# sourceMappingURL=token.js.map