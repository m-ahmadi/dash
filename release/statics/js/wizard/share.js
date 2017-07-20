define(function () {

	function getRangeTitle(type, count) {
		var s = "Last ";
		s += count > 1 ? count + " " : "";
		switch (type) {
			case "m":
				s += "Minute";break;
			case "h":
				s += "Hour";break;
			case "d":
				s += "Day";break;
			case "w":
				s += "Week";break;
		}
		s += count > 1 ? "s" : "";
		return s;
	}

	return { getRangeTitle: getRangeTitle };
});
//# sourceMappingURL=share.js.map