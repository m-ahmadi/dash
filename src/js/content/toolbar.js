define([], () => {
	const inst = u.extend( newPubSub() );
	const ROOT = "[data-root='toolbar']";
	let els;
	
	let timer;
	const DEFAULT_INTERVAL = 30000;
	const MIN_MINUTE = 1;
	const MAX_MINUTE = 5;
	const MIN_SECONDS = 15;
	const MAX_SECONDS = 300;
	function refreshAll() {
		Object.keys(widgets).forEach(k => {
			let widget = widgets[k];
			setTimeout(widget.refresh, 500);
		});
	}
	function autoRefresh(interval) {
		timer = setTimeout(() => {
			refreshAll();
			autoRefresh();
		}, interval || DEFAULT_INTERVAL);
	}
	function startAutoRefresh(n) {
		autoRefresh(n);
	}
	function endAutoRefresh() {
		clearTimeout(timer);
	}
	function enableBtns() {
		els.cancel.attr({disabled: false}).addClass("danger");
		els.apply.attr({disabled: false}).addClass("success");
	}
	function disableBtns() {
		els.cancel.attr({disabled: true}).removeClass("danger");
		els.apply.attr({disabled: true}).removeClass("success");
	}
	function init() {
		els = u.getEls(ROOT);
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
		els.autoref.on("click change", e => {
			let checked = e.target.checked;
			let toDis = els.stepCount.add( els.stepType );
			if (checked) {
				// startAutoRefresh();
				toDis.attr({disabled: false});
			} else {
				endAutoRefresh();
				toDis.attr({disabled: true});
			}
		});
		els.stepCount.on("input keyup change blur", e => {
			let val = parseInt(e.target.value, 10);
			enableBtns();
		});
		els.stepType.on("change", () => {
			
		});
		els.cancel.on("click", () => {
			disableBtns();
		});
		els.apply.on("click", () => {
			startAutoRefresh();
			disableBtns();
		});
		
		els.add.on("click", () => {
			wizard.start( els.widgets.children().length );
		});
		els.deleteAll.on("click", () => {
			confirm.open("delete_all");
		});
		els.save.on("click", () => {
			confirm.open("save_all");
		});
		els.minAll.on("click", () => {
			Object.keys(widgets).forEach( k => widgets[k].min() );
		});
		els.maxAll.on("click", () => {
			Object.keys(widgets).forEach( k => widgets[k].max() );
		});
		els.shrinkAll.on("click", () => {
			Object.keys(widgets).forEach( k => widgets[k].shrink() );
		});
		els.expandAll.on("click", () => {
			Object.keys(widgets).forEach( k => widgets[k].expand() );
		});
	}
	
	inst.init = init;
	
	return inst;
});