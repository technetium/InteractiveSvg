console.debug("script");

class TcSvgEdit {

	constructor(prefix) {
		console.debug("construct");
		
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
		
		TcSvgEdit._element_current = null;
		TcSvgEdit._element_type_selected = null;
		TcSvgEdit._svg_current = null;
	}

	static getSvg(svg) {
		////console.debug('TcSvgEdit.getSvg');
		if (!svg) { return; }
		let id = TcSvgEdit.Svg.getId(svg);
		if ("undefined" === typeof TcSvgEdit._svgs[id]) {
			TcSvgEdit._svgs[id] = new TcSvgEdit.Svg(svg);
		}
		////console.debug(TcSvgEdit._svgs[id]);
		return TcSvgEdit._svgs[id];
	}

	static getSvgById(id) {
		////console.debug('TcSvgEdit.getSvgById');
		if ("undefined" === typeof TcSvgEdit._svgs[id]) {
			let svg = document.getElementById(id);
			if ("undefined" === svg) { return; }
			TcSvgEdit._svgs[id] = new TcSvgEdit.Svg(svg);
		}
		////console.debug(TcSvgEdit._svgs[id]);
		return TcSvgEdit._svgs[id];
	}

	
	//
	// Event Listeners
	//
	
	static onMouseDown(event) {
		console.debug("TcSvgEdit.onMouseDown");
		console.debug(event);
		if (TcSvgEdit.elementTypeSelect(event)) { return true; }
		let svg = TcSvgEdit.getSvg(event.target.closest("svg.tc_svg_edit"));
		if (svg && svg.onMouseDown(event)) { return true; }
		TcSvgEdit.svgCurrentGet().setElementTypeSelected();
	}
	
	static onMouseMove(event) {
		///console.debug("TcSvgEdit.onMouseMove");
		///console.debug(event);
		let svg = TcSvgEdit.getSvg(event.target.closest("svg.tc_svg_edit"));
		if (svg) { svg.onMouseMove(event); }
	}

	static onMouseUp(event) {
		//console.debug("TcSvgEdit.onMouseUp");
		//console.debug(event);
		let svg = TcSvgEdit.getSvg(event.target.closest("svg.tc_svg_edit"));
		if (svg) { svg.onMouseUp(event); }
	}

	//
	// svg
	//
	static svgCurrentGet() {
		console.debug("svgCurrentGet()");
		if (!TcSvgEdit._svg_current) {
			TcSvgEdit.svgCurrentSet(TcSvgEdit.getSvg(document.querySelector("svg.tc_svg_edit")));
		}
		console.debug(TcSvgEdit._svg_current);
		return TcSvgEdit._svg_current;
	}
	
	static svgCurrentSet(svg) {
		console.debug('svgCurrentSet()');
		console.debug(svg);
		if (TcSvgEdit._svg_current) { TcSvgEdit.svgCurrentUnset() }
		TcSvgEdit._svg_current = svg;
		TcSvgEdit.elementTypeSelectedSet();
		TcSvgEdit.documentInfoField("svg_current", svg._svg.getAttribute("id"));
	}
	
	static svgCurrentUnset() {
		console.debug('svgCurrentUnset');
		TcSvgEdit.elementTypeSelectedUnset();
		TcSvgEdit.documentInfoField("svg_current", "");
		TcSvgEdit._svg_current = null;
	}
	
	//
	// document
	//
	
	static documentInfoField(name, value) {
		document.querySelectorAll(
			"[data-tc-svg-edit-info-field=\"" + 
			name + "\"]"
		).forEach(function(elem) {
			//console.debug(elem);
			elem.innerHTML = value;
		});
	}
	
	
	static documentPositionIndicator(dimension, value) {
		document.querySelectorAll(
			"[data-tc-svg-edit-position-indicator=\"" + 
			dimension + "\"]"
		).forEach(function(elem) {
			//console.debug(elem);
			elem.innerHTML = value;
		});
	}

	
	//
	// element
	//
/*	
	static elementCurrentSet(element) {
		TcSvgEdit._element_current = element;
	}
	
	static elementCurrentUnset() {
		// Cleanup unfinished mess
		TcSvgEdit._element_current = null;
	}
*/	
	static elementTypeSelect(event) {
		console.debug('elementTypeSelect');
		let elem = event.target.closest("[data-tc-svg-edit-element-type-select]");
		if (!elem) { return false }
		console.debug(elem);
		let type = elem.getAttribute("data-tc-svg-edit-element-type-select")
		console.debug(type);
		TcSvgEdit.svgCurrentGet().setElementTypeSelected(type);
		return true;
	}
	
	static elementTypeSelectedSet() {
		console.debug('elementTypeSelectedSet');
		console.debug(TcSvgEdit.svgCurrentGet());
		console.debug(TcSvgEdit.svgCurrentGet().getElementTypeSelected());
		document.querySelectorAll(
			"[data-tc-svg-edit-element-type-select=\"" + 
			TcSvgEdit.svgCurrentGet().getElementTypeSelected() +
			"\"]"
		).forEach(function(elem) {
			console.debug(elem);
			elem.classList.add("selected");
		});
	}

	static elementTypeSelectedUnset(type) {
		console.debug('elementTypeSelectedUnset');
		console.debug(TcSvgEdit.svgCurrentGet().getElementTypeSelected());
		document.querySelectorAll(
			"[data-tc-svg-edit-element-type-select=\"" + 
			TcSvgEdit.svgCurrentGet().getElementTypeSelected() +
			"\"]"
		).forEach(function(elem) {
			console.debug(elem);
			elem.classList.remove("selected");
		});
	}
	
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
//	Utilities Class
//
TcSvgEdit.Util = class {
	static diff(p1, p2) {
		return { 
			x: p2.x - p1.x,
			y: p2.y - p1.y,
		}
	}
	static distance(p1, p2) {
		let d = TcSvgEdit.Util.diff(p1, p2);
		return Math.sqrt(d.x * d.x + d.y * d.y);
	}
	static direction(p1, p2) {
		let d = TcSvgEdit.Util.diff(p1, p2);
		return Math.atan2(d.x, d.y);
	}
}


//
// SVG WRAPPER CLASS
//
TcSvgEdit.Svg = class {
	constructor(svg) {
		console.debug('TcSvgEdit.Svg.constructor');
		this._svg = svg;
		this._element_current = null;
		this._element_type_selected = null;
		this._nodes = [];
		this._node_selected = null;
		
		this._svg.addEventListener("mouseenter", this.onMouseEnter);
		this._svg.addEventListener("mouseleave", this.onMouseLeave);
		
		TcSvgEdit.svgCurrentSet(this);
		console.debug(this);
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
		////console.debug("Svg.onMouseDown");
		let node = this.getNode(event.target.closest(".node"));
		if (!node) { node = this.addNode(this.getCoordinates(event)); }
		////console.debug(node);
		this.setNodeSelected(node);
		if (this.getElementTypeSelected()) {
			if (!this.getElementCurrent() && 
				TcSvgEdit.ElementObjects[this.getElementTypeSelected()]) {
				this.setElementCurrent(
					new TcSvgEdit.ElementObjects[this.getElementTypeSelected()](this)
				);
			}
			this.getElementCurrent().addNode(node);
		}
		return true;
	}

	onMouseEnter(event) {
		console.debug("Svg.onMouseEnter");
		let svg = TcSvgEdit.getSvg(this); // this is the target, not this oject
		console.debug(svg);
		TcSvgEdit.svgCurrentSet(svg);
	}
	
	onMouseLeave(event) {
		console.debug("Svg.onMouseLeave");
		let svg = TcSvgEdit.getSvg(this); // this is the target, not this oject
		console.debug(svg);
	}
	
	onMouseMove(event) {
		////console.debug("Svg.onMouseMove");
		let pos = this.getCoordinates(event);

		//TcSvgEdit.documentPositionIndicator("x", pos.x);
		//TcSvgEdit.documentPositionIndicator("y", pos.y);
		TcSvgEdit.documentInfoField("pos_x", pos.x);
		TcSvgEdit.documentInfoField("pos_y", pos.y);
		
		let node = this.getNodeSelected();
		if (node) { node.onMouseDrag(pos); }
	}

	onMouseUp(event) {
		////console.debug("Svg.onMouseUp");
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
		////console.debug(node);
		return node;
	}


	//
	// Initialisers
	//

	initDefs() {
		console.debug('initDefs');
		let defs = TcSvgEdit.createSvgElement("defs");
		this._svg.append(defs);
		return defs;
	}
		
	initDrawing() {
		console.debug('initDrawing');
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
		console.debug('initNode');
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
		console.debug("Svg.addNode("+pos.x+", "+pos.y+")");
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

	getElementCurrent() {
		console.debug("Svg.getElementCurrent()");
		console.debug(this._element_current);
		return this._element_current;
	}
	
	setElementCurrent(elem=null) {
		console.debug("Svg.setElementCurrent()");
		console.debug(elem);
		this._element_current = elem;
		TcSvgEdit.documentInfoField("element_current", this._element_current);
		return this;
	}

	getElementTypeSelected() {
		console.debug("Svg.getElementSelected()");
		return this._element_type_selected;
	}
	
	setElementTypeSelected(type=null) {
		console.debug('Svg.setElementTypeSelected');
		console.debug(type);
		TcSvgEdit.elementTypeSelectedUnset(); 
		this._element_type_selected = type;
		if (type) { TcSvgEdit.elementTypeSelectedSet(type); }
		return this;
	}
	
	getNodeSelected() {
		////console.debug("getNodeSelected");
		////console.debug(this._svg._node_selected);
		return this._node_selected;
	}
	
	setNodeSelected(node=null) { 
		////console.debug("setNodeSelected");
		this._node_selected = node;
		////console.debug(this._node_selected)
		return this;
	}
	
	append(elem) {
		console.debug("Svg.append()");
		this.getDrawing().append(elem._element);
		console.debug(this._svg);
	}
	
	getCoordinates(event) {
		///console.debug("getCoordinates()");
		// @see https://stackoverflow.com/questions/12752519/svg-capturing-mouse-coordinates
		let pt = this._svg.createSVGPoint();
		pt.x = event.clientX;
		pt.y = event.clientY;

		// The cursor point, translated into svg coordinates
		let cursorpt =  pt.matrixTransform(this._svg.getScreenCTM().inverse());
		///console.debug("(" + cursorpt.x + ", " + cursorpt.y + ")");
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
		this._elements = [];
	}
	
	onMouseDrag(pos) {
		///console.debug("Node.onMouseDrag");
		///console.debug(typeof node);
		///console.debug(pos);
		this.setPosition(pos);
		
		this._elements.forEach(function(elem) {
			//console.debug(elem);
			elem.update();
		});

	}
	
	addElement(element) {
		this._elements.push(element);
	}
	
	getPosition() {
		return {
			x: this._node.getAttribute("x"),
			y: this._node.getAttribute("y")
		}
	}
	setPosition(position) {
		this._node.setAttribute("x", position.x); 
		this._node.setAttribute("y", position.y); 
	}
}


//
// ELEMENT WRAPPER CLASS
//
TcSvgEdit.Element = class {
	constructor(element, svg) {
		console.debug("TcSvgEdit.Element.constructor");
		console.debug(element);
		console.debug(svg);
		this._element = element;
		this._nodes = [];
		this._svg = svg;
		
		this.setStrokeWidth(2);
		this.setStrokeColour("#CC0000");

	}
	
	addNode(node) {
		console.debug('Element.addNode')
		this._nodes.push(node);
		console.debug(this._nodes.length);
		console.debug(this);
		node.addElement(this);
		if (this.minNodes() === this._nodes.length) { this._svg.append(this); }
		if (this.minNodes() <= this._nodes.length) { this.update(); }
		if (this.maxNodes() <= this._nodes.length) { this._svg.setElementCurrent(); }
		return this;
	}
	
	setStrokeWidth(width) {
		this._element.style.strokeWith = width;
		return this;
	}
	
	setStrokeColour(colour) {
		this._element.style.stroke = colour;
		return this;
	}
	
	update() { 1/0; } // Needs to be defined in sub class
}

//
// ELEMENT CIRCLE WRAPPER CLASS
//
TcSvgEdit.ElementCircle = class extends TcSvgEdit.Element {
	constructor(svg) {
		console.debug('new ElementCircle')
		super(TcSvgEdit.createSvgElement('circle'), svg);

		this._element.style.fill = "none";

	}
	
	maxNodes() { return 2; }
	minNodes() { return 2; }
	
	update() {
		console.debug('ElementCircle.update');
		let p1 = this._nodes[0].getPosition();
		let p2 = this._nodes[1].getPosition();
		
		this._element.setAttribute("cx", p1.x);
		this._element.setAttribute("cy", p1.y);
		this._element.setAttribute("r", TcSvgEdit.Util.distance(p1, p2));
	}
}

//
// ELEMENT LINE WRAPPER CLASS
//
TcSvgEdit.ElementLine = class extends TcSvgEdit.Element {
	constructor(svg) {
		console.debug('new ElementLine')
		super(TcSvgEdit.createSvgElement('line'), svg);
	}

	maxNodes() { return 2; }
	minNodes() { return 2; }
	
	update() {
		console.debug('ElementLine.update');
		let p1 = this._nodes[0].getPosition();
		let p2 = this._nodes[1].getPosition();
		
		this._element.setAttribute("x1", p1.x);
		this._element.setAttribute("y1", p1.y);
		this._element.setAttribute("x2", p2.x);
		this._element.setAttribute("y2", p2.y);
	}
}



// Register Element Names
TcSvgEdit.ElementObjects = {
	circle:	TcSvgEdit.ElementCircle,
	line:	TcSvgEdit.ElementLine,
};

// http://exploringjs.com/es6/ch_classes.html
/*
const MyClass = class Me {
    getClassName() {
        return Me.name;
    }
};
const inst = new MyClass();

console.debug(inst.getClassName()); // Me
console.debug(Me.name); // ReferenceError: Me is not defined
*/



new TcSvgEdit("someprefix");

