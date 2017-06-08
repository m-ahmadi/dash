define(["header", "content/mediator", "templates"], function (header, content) {
	var inst = u.extend(newPubSub());

	function customEvents() {}
	inst.beforeReady = function () {};
	inst.onReady = function () {
		header.init();
		content.init();

		customEvents();
	};

	return inst;
});
//# sourceMappingURL=mediator.js.map