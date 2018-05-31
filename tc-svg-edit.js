console.log("script");

class TcSvgEdit {

	constructor(prefix) {
		console.log("construct");
		
		TcSvgEdit.node_circle_radius = 5;
		TcSvgEdit.node_cross_radius = 11;
		TcSvgEdit.node_fill = '#EEF';
		TcSvgEdit.node_stroke = '#00F';
		TcSvgEdit.node_stroke_width = 0.3;
		
		TcSvgEdit.prefix = "tc_svg_edit_";
		TcSvgEdit.namespace_svg = "http://www.w3.org/2000/svg";
		TcSvgEdit.namespace_xlink = "http://www.w3.org/1999/xlink";
	
		TcSvgEdit._svgs = [];
	
		if ("undefined" !== typeof prefix) { TcSvgEdit.prefix = prefix; }
		document.addEventListener("mousedown", function(event){
			TcSvgEdit.onMouseDown(event);
		});
		document.addEventListener("mousemove", function(event){
			TcSvgEdit.onMouseMove(event);
		});
		document.addEventListener("mouseup", function(event){
			TcSvgEdit.onMouseUp(event);
		});
		
		document[TcSvgEdit.prefix + "_element_type"] = "none";
		document[TcSvgEdit.prefix + "_element"] = null;
	}

	static getSvg(svg) {
		console.log('TcSvgEdit.getSvg');
		if (!svg) { return; }
		let id = TcSvgEdit.Svg.getId(svg);
		if ("undefined" === typeof TcSvgEdit._svgs[id]) {
			TcSvgEdit._svgs[id] = new TcSvgEdit.Svg(svg);
		}
		console.log(TcSvgEdit._svgs[id]);
		return TcSvgEdit._svgs[id];
	}

	
	//
	// Event Listeners
	//
	
	static onMouseDown(event) {
		console.log("TcSvgEdit.onMouseDown");
		console.log(event);
		TcSvgEdit.elementTypeSelect(event);
		let svg = TcSvgEdit.getSvg(event.target.closest("svg.tc_svg_edit"));
		if (svg) { svg.onMouseDown(event); }
	}
	
	static onMouseMove(event) {
		///console.log("TcSvgEdit.onMouseMove");
		///console.log(event);
		let svg = TcSvgEdit.getSvg(event.target.closest("svg.tc_svg_edit"));
		if (svg) { svg.onMouseMove(event); }
	}

	static onMouseUp(event) {
		//console.log("TcSvgEdit.onMouseUp");
		//console.log(event);
		let svg = TcSvgEdit.getSvg(event.target.closest("svg.tc_svg_edit"));
		if (svg) { svg.onMouseUp(event); }
	}

	//
	// document
	//
	
	static documentPositionIndicator(dimension, value) {
		document.querySelectorAll(
			"[data-tc-svg-edit-position-indicator=\"" + 
			dimension + "\"]"
		).forEach(function(elem) {
			//console.log(elem);
			elem.innerHTML = value;
		});
	}
	
	//
	// element
	//
	
	static elementTypeSelect(event) {
		console.log('elementSelect');
		let elem = event.target.closest("[data-tc-svg-edit-element-type-select]");
		if (!elem) { return }
		console.log(elem);
		let type = elem.getAttribute("data-tc-svg-edit-element-type-select")
		console.log(type);
		TcSvgEdit.elementTypeUnset();
		TcSvgEdit.elementTypeSet(type);
	}

	static elementTypeUnset() {
		document.querySelectorAll(
			"[data-tc-svg-edit-element-type-select=\"" + 
			document[TcSvgEdit.prefix + "_element_type"] + "\"]"
		).forEach(function(elem) {
			//console.log(elem);
			elem.classList.remove("selected");
		});
	}
	
	static elementTypeSet(type) {
		console.log('elementTypeSet');
		document[TcSvgEdit.prefix + "_element_type"] = type;
		document.querySelectorAll(
			"[data-tc-svg-edit-element-type-select=\"" + type + "\"]"
		).forEach(function(elem) {
			console.log(elem);
			elem.classList.add("selected");
		});
	}

	//
	// svg
	//
	
	
	// Because I"m to lazy to type the namespace
	static createSvgElement(name) {
		return document.createElementNS(TcSvgEdit.namespace_svg, name);
	}
	static createSvgUseElement(href, x = 0, y = 0) {
		let u = TcSvgEdit.createSvgElement("use");
		u.setAttributeNS(TcSvgEdit.namespace_xlink, "href", href);
		u.setAttribute("x", x);
		u.setAttribute("y", y);
		return u;
	}
	
}

//
// SVG WRAPPER CLASS
//
TcSvgEdit.Svg = class {
	constructor(svg) {
		console.log('TcSvgEdit.Svg.constructor');
		this._svg = svg;
		this._nodes = [];
		this._node_selected = null;
		console.log(this);
	}

	static getId(svg) {
		if (!svg.hasAttribute("id")) {
			TcSvgEdit.Svg.initId(svg);
		}
		return svg.getAttribute("id");
	}

	static initId(svg) {
		svg.setAttribute(
			"id",
			TcSvgEdit.prefix + '_id_' +
			//@see https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
			Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)
		);
	}

	//
	// Id's
	//
	id()	{ return this._svg.getAttribute("id"); }
	idDrawing()	{ return	this.id() + '-symbol-drawing'; }
	idNodeSymbol()	{ return	this.id() + '-symbol-node'; }

	//
	// Event handlers
	//
	
	onMouseDown(event) {
		///console.log("Svg.onMouseDown");
		let node = this.getNode(event.target.closest(".node"));
		if (!node) { node = this.addNode(this.getCoordinates(event)); }
		////console.log(node);
		this.setNodeSelected(node);
	}

	onMouseMove(event) {
		////console.log("Svg.onMouseMove");
		let pos = this.getCoordinates(event);

		TcSvgEdit.documentPositionIndicator("x", pos.x);
		TcSvgEdit.documentPositionIndicator("y", pos.y);
		
		let node = this.getNodeSelected();
		if (node) { node.onMouseDrag(pos); }
	}

	onMouseUp(event) {
		////console.log("Svg.onMouseUp");
		this.setNodeSelected(null);
	}
	
	
	
	//
	// Getters
	//
	
	getDefs() {
		let defs = this._svg.querySelector("defs");
		if (!defs) {
			defs = this.initDefs();
		}
		return defs;
	}

	getDrawing() {
		let drawing = document.getElementById(this.idDrawing());
		if (!drawing) {
			drawing = this.initDrawing();
		}
		return drawing;
	}

	getNode(node) {
		return this._nodes.find(function(n) {
			return n._node == node;
		});
	}
	
	getNodeSymbol() {
		let node = document.getElementById(this.idNodeSymbol());
		if (!node) {
			node = this.initNodeSymbol();
		} 
		////console.log(node);
		return node;
	}


	//
	// Initialisers
	//

	initDefs() {
		console.log('initDefs');
		let defs = TcSvgEdit.createSvgElement("defs");
		this._svg.append(defs);
		return defs;
	}
		
	initDrawing() {
		console.log('initDrawing');
		let defs = this.getDefs();
		let drawing = TcSvgEdit.createSvgElement("symbol");
		drawing.setAttribute("id", this.idDrawing());
		defs.append(drawing);
		this._svg.append(
			TcSvgEdit.createSvgUseElement(
				"#" + this.idDrawing()
			)
		);
		return drawing;
	}
	
	initNodeSymbol() {
		console.log('initNode');
		let defs = this.getDefs();
		let node = TcSvgEdit.createSvgElement("symbol");
		node.setAttribute("id", this.idNodeSymbol());
		node.classList.add("node");
		node.setAttribute("fill", TcSvgEdit.node_fill);
		node.setAttribute("stroke", TcSvgEdit.node_stroke);
		node.setAttribute("stroke-width", TcSvgEdit.node_stroke_width);
		

		// The size of the node
		let s = Math.max(
			TcSvgEdit.node_cross_radius,
			TcSvgEdit.node_circle_radius
		);

		// inatialise element
		let e = null; 

		// Circle
		e = TcSvgEdit.createSvgElement("circle");
		e.setAttribute("cx", s);
		e.setAttribute("cy", s);
		e.setAttribute("r", TcSvgEdit.node_circle_radius);
		node.append(e);
		
		// Horizontal cross hair
		e = TcSvgEdit.createSvgElement("line");
		e.setAttribute("x1", s - TcSvgEdit.node_cross_radius);
		e.setAttribute("y1", s);
		e.setAttribute("x2", s + TcSvgEdit.node_cross_radius);
		e.setAttribute("y2", s);
		node.append(e);

		// Vertical cross hair
		e = TcSvgEdit.createSvgElement("line");
		e.setAttribute("x1", s);
		e.setAttribute("y1", s - TcSvgEdit.node_cross_radius);
		e.setAttribute("x2", s);
		e.setAttribute("y2", s + TcSvgEdit.node_cross_radius);
		node.append(e);

		node.setAttribute("transform", "translate(-"+s+", -"+s+")");
		defs.append(node);
		return node;
	}
	
	addNode(pos) {
		console.log("Svg.addNode("+pos.x+", "+pos.y+")");
		let nodeSymbol = this.getNodeSymbol(); // Make sure we have a node
		let u = TcSvgEdit.createSvgUseElement(
			"#" + this.idNodeSymbol(), pos.x, pos.y
		);
		u.classList.add("node");
		this._svg.append(u);
		let node = new TcSvgEdit.Node(u, this);
		this._nodes.push(node);
		return node;
	}

	getNodeSelected() {
		console.log("getNodeSelected");
		console.log(this._svg._node_selected);
		return this._node_selected;
	}
	
	setNodeSelected(node=null) { 
		console.log("setNodeSelected");
		this._node_selected = node;
		console.log(this._node_selected);
		return this;
	}
	
	getCoordinates(event) {
		///console.log("getCoordinates()");
		// @see https://stackoverflow.com/questions/12752519/svg-capturing-mouse-coordinates
		let pt = this._svg.createSVGPoint();
		pt.x = event.clientX;
		pt.y = event.clientY;

		// The cursor point, translated into svg coordinates
		let cursorpt =  pt.matrixTransform(this._svg.getScreenCTM().inverse());
		///console.log("(" + cursorpt.x + ", " + cursorpt.y + ")");
		return cursorpt;
	}
	
	
}


//
// NODE WRAPPER CLASS
//
TcSvgEdit.Node = class {
	constructor(node, svg) {
		this._node = node;
		this._svg = svg;
		this.elements = [];
	}
	
	onMouseDrag(pos) {
		///console.log("Node.onMouseDrag");
		///console.log(typeof node);
		///console.log(pos);
		this._node.setAttribute("x", pos.x); 
		this._node.setAttribute("y", pos.y); 
	}
	
	addElement(element) {
		this.elements.push(element);
	}
}


//
// ELEMENT WRAPPER CLASS
//
TcSvgEdit.Element = class {
	constructor(element, svg) {
		this._element = element;
		this._svg = svg;
	}
}


//
// ELEMENT LINE WRAPPER CLASS
//
TcSvgEdit.ElementLine = class Line extends TcSvgEdit.Element {
	constructor(element, svg) {
		super(element, svg);
	}
}


// http://exploringjs.com/es6/ch_classes.html
/*
const MyClass = class Me {
    getClassName() {
        return Me.name;
    }
};
const inst = new MyClass();

console.log(inst.getClassName()); // Me
console.log(Me.name); // ReferenceError: Me is not defined
*/



new TcSvgEdit("someprefix");
