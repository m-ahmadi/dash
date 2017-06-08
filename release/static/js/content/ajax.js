define(["./login"], function (login) {

	function main(o, done, fail, always) {
		var x = $.ajax(o).done(function () {}).fail(function () {}).always(function () {});
	}
	return main;
});
//# sourceMappingURL=ajax.js.map