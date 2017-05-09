define(["uk"], (uk) => {
	const inst = u.extend( newPubSub() );
	const ROOT = "[data-root='content']";
	const WIZ_1 = "[data-root='wiz1']";
	const WIZ_2 = "[data-root='wiz2']";
	const WIZ_3 = "[data-root='wiz3']";
	
	let els1, els2, els3, els4;
	
	function shrink(el) {
		const k = "uk-width-1-1";
		if ( el.hasClass(k) ) {
			el.removeClass(k);
		}
	}
	function expand(el) {
		const k = "uk-width-1-1";
		if ( !el.hasClass(k) ) {
			el.addClass(k);
		}
	}
	
	inst.init = () => {
		els1 = u.getEls(ROOT);
		els2 = u.getEls(WIZ_1);
		els3 = u.getEls(WIZ_2);
		els4 = u.getEls(WIZ_3);
		
		els1.root.on("click", "[data-panel] [data-menu]", e => {
			const el = $(e.target);
			const panel = el.closest("[data-panel]");
			const action = parseInt(el.data().action, 10);
			switch (action) {
				case 0: expand(panel); break;
				case 1: shrink(panel); break;
				case 2: undefined; break;
				case 3: undefined; break;
			}
		});
		els1.add.on("click", () => {
			uk.openModal(WIZ_1);
		});
		els2.next.on("click", () => {
			const checked = els2.radios.filter(":checked").val();
			const type = parseInt(checked, 10);
			switch (type) {
				case 0: uk.openModal(WIZ_2); break;
				case 1: uk.openModal(WIZ_3); break;
				case 2: uk.openModal(WIZ_3); break;
				case 3: undefined; break;
			}
			
		});
		els3.prev.on("click", () => {
			uk.openModal(WIZ_1);
		});
		els3.next.on("click", () => {
			
		});
	};
	
	return inst;
});