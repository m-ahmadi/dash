define([], () => {
	
	function main(o, done, fail, always) {
		let x = $.ajax(o)
		.done(() => {
			
		})
		.fail(() => {
			
		})
		.always(() => {
			
		});
	}
	return main;
});