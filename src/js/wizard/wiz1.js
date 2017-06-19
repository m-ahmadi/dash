define(["uk", "./defaults"], (uk, d) => {
	const inst = u.extend( newPubSub() );
	const ROOT = "[data-root='wiz1']";
	const temp = Handlebars.templates;
	let els;
	
	function checked() {
		let checked = els.radios.filter(":checked").val();
		return parseInt(checked, 10);
	}
	
	function set(o) {
		type = o ? o.type : d.TYPE;
		els.radios.eq(type).prop({checked: true});
	}
	
	function get() {
		return checked();
	}
	
	function start(o) {
		set(o);
		uk.openModal(ROOT);
	}
	
	function init() {
		els = u.getEls(ROOT);
		
		els.next.on("click", () => {
			inst.emit( "next", checked() );
		});
	}
	
	inst.set = set;
	inst.get = get;
	inst.start = start;
	inst.init = init;
	
	return inst;
});