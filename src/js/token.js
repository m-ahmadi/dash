define(() => {
	const hard = "9bffd43629b0223beea5";
	
	return (pure) => {
		let userCookie; // = Cookies.get("user");
		const token = userCookie ? JSON.parse(userCookie).Token :  hard;
		const toAppend = `?Token=${token}`;
		
		return pure ? token : toAppend;
	};
});