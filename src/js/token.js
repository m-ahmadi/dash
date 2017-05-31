define(() => {
	const hard = "10037c4d7bbb0407d1e2";
	
	return (pure) => {
		let userCookie = Cookies.get("user");
		const token = userCookie ? JSON.parse(userCookie).Token :  hard;
		const toAppend = `?Token=${token}`;
		
		return pure ? token : toAppend;
	};
});