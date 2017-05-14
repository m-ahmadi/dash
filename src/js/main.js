var __Token = "9bffd43629b0223beea5";

require.config({
	baseUrl: "js/",
	paths: {
		lib: "../lib"
	}
});

require(["./mediator"], (page) => {
	page.beforeReady();
	
	$(function () {
		page.onReady();
	});
});