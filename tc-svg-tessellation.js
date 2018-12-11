////console.debug("script");
class TcSvgTessellation {
	constructor() {
		window.addEventListener("load", function(event){
			TcSvgTessellation.onLoad(event);
		});
		
		TcSvgTessellation._tessellations = [];
	}
	
	static onLoad(event) {
		console.debug('TcSvgTessellation.onLoad');
		document.querySelectorAll("[data-tc-svg-tessellation-type]").forEach(function(elem) {
			console.debug(elem);
			let type = TcSvgTessellation.TessellationObjects[elem.dataset["tcSvgTessellationType"]];
			if (type) {
				new type(elem);
			}
		});
	}
}

//	Utilities Class
//
TcSvgTessellation.Util = class {
	static setObjectField(object, fields, value) {
		////console.debug("TcSvgTessellation.Util.setObjectField");
		////console.debug(object);
		////console.debug(fields);
		////console.debug(value);
		let field = fields.shift();
		if (0 === fields.length) { 
			object[field] = value;
			return object;
		}
		if ("undefined" === typeof object[field]) {
			object[field] = {};
		}
		return TcSvgTessellation.Util.setObjectField(object[field], fields, value);
	}

	static diff(p1, p2) {
		return { 
			x: p1.x - p2.x,
			y: p1.y - p2.y,
		}
	}
	static distance(p1, p2) {
		let d = TcSvgTessellation.Util.diff(p1, p2);
		return Math.sqrt(d.x * d.x + d.y * d.y);
	}
	static direction(p1, p2) {
		let d = TcSvgTessellation.Util.diff(p1, p2);
		return Math.atan2(d.x, d.y);
	}

	static getId(elem) {
		////console.debug('Util.getId()');
		////console.debug(elem);
		let id = elem.getAttribute('id');
		if ('undefined' === typeof id) {
			id = 'id' +	Math.random().toString(36).substr(2);
			elem.setAttribute('id', id); // elem is an object => by reference, this works!
		}
		return id;
	}
	
	static getControlPosition(control) {
		return {
			x: control.x.elem.getAttribute(control.x.attr),
			y: control.y.elem.getAttribute(control.y.attr),
		}
	}
	
	static createSvgUseElement(elem) {
		////console.debug('Util.createSvgUseElement()');
		////console.debug(elem);
		let u = document.createElementNS("http://www.w3.org/2000/svg", "use");
		u.setAttributeNS("http://www.w3.org/1999/xlink", "href", '#' + TcSvgTessellation.Util.getId(elem));
		////console.debug(u);
		return u;
	}
}

TcSvgTessellation.Tessellation = class {
	constructor(elem) {
		console.debug('Tessellation.constructor');
		this._elem = elem;
		TcSvgTessellation._tessellations.push(this);
		this._elements = {};
		this._controls = {};
		for(let key in elem.dataset) {
			////console.debug("Key: " + key);
			if (key.startsWith("tcSvgTessellationElement")) {
				this._elements[key.replace("tcSvgTessellationElement", "")] = document.querySelector(elem.dataset[key]);
			}
			if (key.startsWith("tcSvgTessellationControlElement")) {
				let celem = document.querySelector(elem.dataset[key]);
				let name = key.replace("tcSvgTessellationControlElement", "");
				if (name.endsWith("X")) {
					name = name.slice(0, -1);
					////this._controls[name].x.elem = celem;
					TcSvgTessellation.Util.setObjectField(this._controls, [name, "x", "elem"], celem);
				} else if (name.endsWith("Y")) {
					name = name.slice(0, -1);
					////this._controls[name].y.elem = celem;
					TcSvgTessellation.Util.setObjectField(this._controls, [name, "y", "elem"], celem);
				} else {
					////this._controls[name].x.elem = celem;
					TcSvgTessellation.Util.setObjectField(this._controls, [name, "x", "elem"], celem);
					////this._controls[name].y.elem = celem;
					TcSvgTessellation.Util.setObjectField(this._controls, [name, "y", "elem"], celem);
				}
			}
			if (key.startsWith("tcSvgTessellationControlAttribute")) {
				let name = key.replace("tcSvgTessellationControlAttribute", "").slice(0, -1);
				if (key.endsWith("X")) {
					TcSvgTessellation.Util.setObjectField(this._controls, [name, "x", "attr"], elem.dataset[key]);
				} else if (key.endsWith("Y")) {
					TcSvgTessellation.Util.setObjectField(this._controls, [name, "y", "attr"], elem.dataset[key]);
				}
			}
		}
		////console.debug(this._elements);
		////console.debug(this._controls);
	}
	
	update() {
		1/0;
	}
}

TcSvgTessellation.TessellationLine = class extends TcSvgTessellation.Tessellation {
	constructor(elem) {
		console.debug('TessellationLine.construct()');
		super(elem);
		console.debug(this);
		this._line = TcSvgTessellation.Util.createSvgUseElement(this._elements.Line);
		elem.appendChild(this._line);
		this.update();
	}
	
	update() {
		console.debug('TessellationTriangle.update()');
		//console.debug(this._controls.Line1Start.x.elem);
		let start = TcSvgTessellation.Util.getControlPosition(this._controls.LineStart);
		let end = TcSvgTessellation.Util.getControlPosition(this._controls.LineEnd);
		this._line.setAttribute("x", -start.x);
		this._line.setAttribute("y", -start.y);
		console.debug(this._line);
		
		console.debug('rotate');
		this._line.setAttribute("transform", "rotate(" + (TcSvgTessellation.Util.direction(start, end) * 180 / Math.PI + 90)  + ")");
	}
}



TcSvgTessellation.TessellationTriangle = class extends TcSvgTessellation.Tessellation {
	constructor(elem) {
		console.debug('TessellationTriangle.construct()');
		super(elem);
		console.debug(this);
		this._line = [];
		this._line[0] = TcSvgTessellation.Util.createSvgUseElement(this._elements.Line1);
		elem.appendChild(this._line[0]);
		this.update();
	}
	
	update() {
		console.debug('TessellationTriangle.update()');
		//console.debug(this._controls.Line1Start.x.elem);
		let start = TcSvgTessellation.Util.getControlPosition(this._controls['Line' + 1 + 'Start']);
		let end = TcSvgTessellation.Util.getControlPosition(this._controls.Line1End);
		this._line[0].setAttribute("x", -start.x);
		this._line[0].setAttribute("y", -start.y);
		console.debug(this._line[0]);

		console.debug('array');
		
		for (let i = 0; i < 3; i++) {
			//TcSvgTessellation.Util.direction(start, end);
			console.debug(i);
		};
		console.debug('rotate');
		this._line[0].setAttribute("transform", "rotate(" + (TcSvgTessellation.Util.direction(start, end) * 180 / Math.PI + 90)  + ")");
	}
}

// Register Element Names
TcSvgTessellation.TessellationObjects = {
	line:	TcSvgTessellation.TessellationLine,
	triangle:	TcSvgTessellation.TessellationTriangle,
}



// Triangle 
//cos(C) = (a^2 + b^2 - c^2) / 2ab  <= Langste lijn is c
//sin(C)/c = sin(B)/b


new TcSvgTessellation();

