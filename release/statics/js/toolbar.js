define([], function () {
	var inst = u.extend(newPubSub());
	var els = void 0;
	var autorefOn = void 0,
	    gapCount = void 0,
	    gapType = void 0;

	var DEFAULT_GAP = 15000;
	var DEFAULT_MINUTES = 2;
	var DEFAULT_SECONDS = 15;
	var MIN_MINUTES = 1;
	var MAX_MINUTES = 5;
	var MIN_SECONDS = 15;
	var MAX_SECONDS = 300;

	function gap(count, type) {
		return type === "s" ? count * 1000 : type === "m" ? count * 60000 : DEFAULT_GAP;
	}
	function parseGapCount() {
		return parseInt(els.gapCount.val(), 10);
	}
	function enableBtns() {
		els.cancel.attr({ disabled: false }).addClass("danger");
		els.apply.attr({ disabled: false }).addClass("success");
	}
	function disableBtns() {
		els.cancel.attr({ disabled: true }).removeClass("danger");
		els.apply.attr({ disabled: true }).removeClass("success");
	}
	function emitStart() {
		var count = parseGapCount();
		var type = els.gapType.val();
		inst.emit("start_auto_refresh", gap(type, count));
	}
	function emitEnd() {
		inst.emit("end_auto_refresh");
	}
	function init(root) {
		els = u.getEls(root);
		gapCount = parseGapCount();
		gapType = els.gapType.val();

		new Switchery(els.autoref[0], {
			color: "#64bd63",
			secondaryColor: "#dfdfdf",
			jackColor: "#fff",
			jackSecondaryColor: null,
			className: "switchery",
			disabled: false,
			disabledOpacity: 0.5,
			speed: "0.2s",
			size: "default"
		});
		els.autoref.on("click", function (e) {
			var checked = e.target.checked;
			var toDis = els.gapCount.add(els.gapType);
			if (checked) {
				autorefOn = true;
				emitStart();
				toDis.attr({ disabled: false });
			} else {
				autorefOn = false;
				emitEnd();
				toDis.attr({ disabled: true });
				disableBtns();
			}
		});
		els.gapCount.on("input keyup change", function (e) {
			var el = $(e.target);
			var val = parseInt(el.val(), 10);
			var type = els.gapType.val();
			if (type === "m") {
				if (val > MAX_MINUTES) {
					el.val(MAX_MINUTES);
				} else if (val < MIN_MINUTES) {
					el.val(MIN_MINUTES);
				}
			} else if (type === "s") {
				if (val > MAX_SECONDS) {
					el.val(MAX_SECONDS);
				} else if (val < MIN_SECONDS) {
					el.val(MIN_SECONDS);
				}
			}
			if (gap(gapCount, gapType) !== gap(val, type)) {
				enableBtns();
			} else {
				disableBtns();
			}
		});
		els.gapType.on("change", function (e) {
			if (autorefOn) {
				var val = e.target.value;
				var _gapCount = els.gapCount;
				if (val === "m") {
					_gapCount.attr("min", MIN_MINUTES).val(DEFAULT_MINUTES);
				} else if (val === "s") {
					_gapCount.attr("min", MIN_SECONDS).val(DEFAULT_SECONDS);
				}
				_gapCount.change();
			}
		});

		els.cancel.on("click", function (e) {
			if (e.target.disabled) return;
			disableBtns();
		});
		els.apply.on("click", function (e) {
			if (e.target.disabled) return;
			gapCount = parseGapCount();
			gapType = els.gapType.val();
			emitEnd();
			emitStart();
			disableBtns();
		});

		els.add.on("click", function () {
			return inst.emit("add");
		});
		els.save.on("click", function () {
			return inst.emit("save_all");
		});
		els.deleteAll.on("click", function () {
			return inst.emit("delete_all");
		});
		els.minAll.on("click", function () {
			return inst.emit("min_all");
		});
		els.maxAll.on("click", function () {
			return inst.emit("max_all");
		});
		els.shrinkAll.on("click", function () {
			return inst.emit("shrink_all");
		});
		els.expandAll.on("click", function () {
			return inst.emit("expand_all");
		});
	}

	inst.init = init;

	return inst;
});
//# sourceMappingURL=toolbar.js.map