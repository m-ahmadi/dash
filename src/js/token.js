define(() => {
	function main(pure) {
		let cookie, o, res;
		cookie = Cookies.get("user");
		
		if ( cookie && u.isStr(cookie) ) {
			o = JSON.parse(cookie);
			res = o.Token; 
		} else {
			res = false;
		}
		
		
		return pure ? res : `?Token=${res}`;
	}
	
	window.tok = main;
	return main;
});