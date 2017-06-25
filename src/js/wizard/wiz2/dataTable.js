define(["./colorpick"], (colorpick) => {
	const inst = u.extend( newPubSub() );
	const temp = Handlebars.templates;
	
	let parent;
	let rows = {};
	
	function randColor(brightness) {
		// Six levels of brightness from 0 to 5, 0 being the darkest
		var rgb = [Math.random() * 256, Math.random() * 256, Math.random() * 256];
		var mix = [brightness * 51, brightness * 51, brightness * 51]; //51 => 255/5
		var mixedrgb = [rgb[0] + mix[0], rgb[1] + mix[1], rgb[2] + mix[2]].map(function (x) {
			return Math.round(x / 2.0)
		})
		return "rgb(" + mixedrgb.join(",") + ")";
	}
	function onColorChange(color) {
		inst.emit( "color_change", color.toHex() );
	}
	function newRow(sensor) {
		let units = sensor.units;
		parent.append(temp.sensorRow({
			name: sensor.name,
			id: sensor.id,
			units: units
		}));
		let root = parent.children().last();
		let els = u.getEls(root);
		
		let selectedUnit = units.filter(o => o.selected ? o.name : undefined)[0];
		
		if (selectedUnit) {
			els.select.val(selectedUnit.name).change();
		}
		colorpick.init(els.colorpick, sensor.color || randColor( u.randInt(0, 6) ), onColorChange);
		
		els.select.on("change", e => {
			inst.emit("unit_change", e.target.value);
		});
		els.remove.on("click", remove);
		
		function toggle(b) {
			els.toDisable.attr({disabled: !b});
			els.colorpick.spectrum(b ? "enable" : "disable");
		}
		function remove() {
			let id = sensor.id;
			els.colorpick.spectrum("destroy");
			parent.find(`> tr[data-id="${id}"]`).remove();
			
			inst.emit("sensor_remove", id);
			
			delete rows[id];
			if ( u.isEmptyObj(rows) ) inst.emit("sensor_remove_all");
		}
		function getUnits() {
			let selectedVal = els.select.val().trim();
			return sensor.units.map(o => {
				let name = o.name;
				let res = {
					name: name,
					selected: false
				};
				if (name === selectedVal) {
					res.selected = true;
				}
				return res;
			});
		}
		function color() {
			return els.colorpick.spectrum("get").toHex();
		}
		
		inst.emit("sensor_add", sensor);
		
		return {
			id: sensor.id,
			name: sensor.name,
			toggle, remove, getUnits, color
		};
	}
	function addRow(sensor) {
		let id = sensor.id;
		if ( !rows[id] ) {
			rows[id] = newRow(sensor);
		}
	}
	function getData() {
		if ( u.isEmptyObj(rows) ) return;
		let data = {};
		
		Object.keys(rows).forEach(k => {
			let row = rows[k];
			let id = row.id;
			data[id] = {
				id: id,
				name: row.name,
				units: row.getUnits(),
				color: row.color()
			};
		});
		return data;
	}
	function doAll(action, arg) {
		Object.keys(rows).forEach( k => rows[k][action](arg) );
	}
	function init(root) {
		parent = root;
		
	}
	
	inst.removeAll = () => doAll("remove");
	inst.toggleAll = b => doAll("toggle", b);
	inst.addRow = addRow;
	inst.getData = getData;
	inst.init = init;
	return inst;
});