define([], () => {
	const inst = u.extend( newPubSub() );
	let els;
	let autorefOn, gapCount, gapType;

	const DEFAULT_GAP = 15000;
	const DEFAULT_MINUTES = 2;
	const DEFAULT_SECONDS = 15;
	const MIN_MINUTES = 1;
	const MAX_MINUTES = 5;
	const MIN_SECONDS = 15;
	const MAX_SECONDS = 300;
	
	
	function gap(count, type) {
		return type === "s" ? count * 1000 : type === "m" ? count * 60000 : DEFAULT_GAP;
	}
	function parseGapCount() {
		return parseInt(els.gapCount.val(), 10);
	}
	function enableBtns() {
		els.cancel.attr({disabled: false}).addClass("danger");
		els.apply.attr({disabled: false}).addClass("success");
	}
	function disableBtns() {
		els.cancel.attr({disabled: true}).removeClass("danger");
		els.apply.attr({disabled: true}).removeClass("success");
	}
	function emitStart() {
		let count = parseGapCount();
		let type = els.gapType.val();
		inst.emit( "start_auto_refresh", gap(type, count) );
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
		els.autoref.on("click", e => {
			let checked = e.target.checked;
			let toDis = els.gapCount.add( els.gapType );
			if (checked) {
				autorefOn = true;
				emitStart();
				toDis.attr({disabled: false});
			} else {
				autorefOn = false;
				emitEnd();
				toDis.attr({disabled: true});
			}
		});
		els.gapCount.on("input keyup change", e => {
			let el = $(e.target);
			let val = parseInt(el.val(), 10);
			let type = els.gapType.val();
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
			if ( gap(gapCount, gapType) !== gap(val, type) ) {
				enableBtns();
			} else {
				disableBtns();
			}
		});
		els.gapType.on("change", e => {
			if (autorefOn) {
				let val = e.target.value;
				let gapCount = els.gapCount;
				if (val === "m") {
					gapCount.attr("min", MIN_MINUTES).val(DEFAULT_MINUTES);
				} else if (val === "s") {
					gapCount.attr("min", MIN_SECONDS).val(DEFAULT_SECONDS);
				}
				gapCount.change();
			}
		});
		
		
		
		
		
		els.cancel.on("click", () => {
			disableBtns();
		});
		els.apply.on("click", () => {
			gapCount = parseGapCount();
			gapType = els.gapType.val();
			emitEnd();
			emitStart();
			disableBtns();
		});
		
		els.add.on      ( "click", () => inst.emit("add")        );
		els.save.on     ( "click", () => inst.emit("save_all")   );
		els.deleteAll.on( "click", () => inst.emit("delete_all") );
		els.minAll.on   ( "click", () => inst.emit("min_all")    );
		els.maxAll.on   ( "click", () => inst.emit("max_all")    );
		els.shrinkAll.on( "click", () => inst.emit("shrink_all") );
		els.expandAll.on( "click", () => inst.emit("expand_all") );
	}
	
	inst.init = init;
	
	return inst;
});