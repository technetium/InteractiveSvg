////console.debug("script");

class TcSvgEdit {

	constructor(prefix) {
		////console.debug('construct");
		
		TcSvgEdit.nodeCircleRadius = 5;
		TcSvgEdit.nodeCrossRadius = 11;
		TcSvgEdit.nodeFill = '#EEF';
		TcSvgEdit.nodeStroke = '#00F';
		TcSvgEdit.nodeStrokeWidth = 0.3;
		
		TcSvgEdit.relativeIndicatorEndMarkerWidth = '10';
		TcSvgEdit.relativeIndicatorEndMarkerFill = 'none';
		TcSvgEdit.relativeIndicatorEndMarkerHeight = '7';
		TcSvgEdit.relativeIndicatorEndMarkerWidth = '10';
		TcSvgEdit.relativeIndicatorStartMarkerFill = '#F90';
		TcSvgEdit.relativeIndicatorStartMarkerRadius = '1.5';
		TcSvgEdit.relativeIndicatorStroke = '#C60';
		TcSvgEdit.relativeIndicatorStrokeWidth = '1';
		TcSvgEdit.relativeIndicatorStrokeDasharray = '2,2';
		
		TcSvgEdit.prefix = "tc_svg_edit_";
		TcSvgEdit.namespace_svg = "http://www.w3.org/2000/svg";
		TcSvgEdit.namespace_xlink = "http://www.w3.org/1999/xlink";
	
		TcSvgEdit._svgs = [];
	
		if ("undefined" !== typeof prefix) { TcSvgEdit.prefix = prefix; }
		document.addEventListener("keydown", function(event){
			TcSvgEdit.onKeyDown(event);
		});
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

	static getElement(elem) {
		return TcSvgEdit.getSvg(elem.closest("svg.tc_svg_edit")).getElement(elem); 
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
	static onKeyDown(event) {
		////console.debug("TcSvgEdit.onKeyDown");
		////console.debug(event);
		let svg = TcSvgEdit.svgCurrentGet();
		if (svg && svg.onKeyDown(event)) { return true; }
	}

	static onMouseDown(event) {
		////console.debug("TcSvgEdit.onMouseDown");
		////console.debug(event);
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
		////console.debug("svgCurrentGet()");
		if (!TcSvgEdit._svg_current) {
			TcSvgEdit.svgCurrentSet(TcSvgEdit.getSvg(document.querySelector("svg.tc_svg_edit")));
		}
		////console.debug(TcSvgEdit._svg_current);
		return TcSvgEdit._svg_current;
	}
	
	static svgCurrentSet(svg) {
		////console.debug('svgCurrentSet()');
		////console.debug(svg);
		if (TcSvgEdit._svg_current) { TcSvgEdit.svgCurrentUnset() }
		TcSvgEdit._svg_current = svg;
		TcSvgEdit.elementTypeSelectedSet();
		TcSvgEdit.documentInfoField("svg_current", svg._svg.getAttribute("id"));
	}
	
	static svgCurrentUnset() {
		////console.debug('svgCurrentUnset');
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
	// elementType
	//

	static elementTypeSelect(event) {
		////console.debug('elementTypeSelect');
		let elem = event.target.closest("[data-tc-svg-edit-element-type-select]");
		if (!elem) { return false }
		////console.debug(elem);
		let type = elem.getAttribute("data-tc-svg-edit-element-type-select")
		////console.debug(type);
		TcSvgEdit.svgCurrentGet().setElementTypeSelected(type);
		return true;
	}
	
	static elementTypeSelectedSet() {
		////console.debug('elementTypeSelectedSet');
		////console.debug(TcSvgEdit.svgCurrentGet());
		////console.debug(TcSvgEdit.svgCurrentGet().getElementTypeSelected());
		document.querySelectorAll(
			"[data-tc-svg-edit-element-type-select=\"" + 
			TcSvgEdit.svgCurrentGet().getElementTypeSelected() +
			"\"]"
		).forEach(function(elem) {
			elem.classList.add("selected");
		});
	}

	static elementTypeSelectedUnset(type) {
		////console.debug('elementTypeSelectedUnset');
		////console.debug(TcSvgEdit.svgCurrentGet().getElementTypeSelected());
		document.querySelectorAll(
			"[data-tc-svg-edit-element-type-select=\"" + 
			TcSvgEdit.svgCurrentGet().getElementTypeSelected() +
			"\"]"
		).forEach(function(elem) {
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
	static arrayRemove(array, item) {
		// @see https://stackoverflow.com/a/20690490
		return array.filter(item => item !== value)
	}


	static diff(p1, p2) {
		return { 
			x: p1.x - p2.x,
			y: p1.y - p2.y,
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
		////console.debug('TcSvgEdit.Svg.constructor');
		this._svg = svg;
		this._element_current = null;
		this._element_selected = null;
		this._element_type_selected = null;
		this._elements = [];
		this._nodes = [];
		
		this._node_previous = null;
		this._node_selected = null;

		this._svg.addEventListener("mouseenter", this.onMouseEnter);
		this._svg.addEventListener("mouseleave", this.onMouseLeave);
		
		TcSvgEdit.svgCurrentSet(this);
		////console.debug(this);
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
	idDrawing()	{ return this.id() + '-drawing'; }
	idNodeSymbol()	{ return this.id() + '-symbol-node'; }
	idRelativeGradient()	{ return this.id() + '-gradient-relative'; }
	idRelativeEndMarker()	{ return this.id() + '-marker-end-relative'; }
	idRelativeStartMarker()	{ return this.id() + '-marker-start-relative'; }
	
	//
	// Event handlers
	//
	onKeyDown(event) {
		////console.debug("Svg.onKeyDown");
		////console.debug(event);
		switch (event.key) {
			case "Delete" : return this.doDelete(); break;
			default: return false;
		}
	}
	
	onMouseDown(event) {
		////console.debug("Svg.onMouseDown");
		let node = this.getNode(event.target.closest(".node"));
		if (!node) { 
			node = this.createNode(this.getCoordinates(event));
			if (event.ctrlKey) {
				node.setRelative(node.getSvg().getNodePrevious());
			}
		}
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
		////console.debug("Svg.onMouseEnter");
		let svg = TcSvgEdit.getSvg(this); // this is the target, not this object
		////console.debug(svg);
		TcSvgEdit.svgCurrentSet(svg);
	}
	
	onMouseLeave(event) {
		////console.debug("Svg.onMouseLeave");
		let svg = TcSvgEdit.getSvg(this); // this is the target, not this object
		////console.debug(svg);
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
		////console.debug(this);
		this.setNodeSelected(null);
	}
	
	doDelete() {
		////console.debug('Svg.doDelete');
		if (this.getElementSelected()) {
			this.getElementSelected().destruct();
		}		
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

	getElement(elem) {
		////console.debug('Svg.getElement()');
		return this._elements.find(function(e) {
			return e._element == elem;
		});
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
		return node;
	}

	getRelativeEndMarker() {
		let marker = document.getElementById(this.idRelativeEndMarker());
		if (!marker) {
			marker = this.initRelativeEndMarker();
		} 
		return marker;
	}

	getRelativeStartMarker() {
		let marker = document.getElementById(this.idRelativeStartMarker());
		if (!marker) {
			marker = this.initRelativeStartMarker();
		} 
		return marker;
	}

	
	//
	// Initialisers
	//

	initDefs() {
		////console.debug('initDefs');
		let defs = TcSvgEdit.createSvgElement("defs");
		this._svg.append(defs);
		return defs;
	}
		
	initDrawing() {
		////console.debug('initDrawing');
		
		let drawing = TcSvgEdit.createSvgElement("g");
		drawing.setAttribute("id", this.idDrawing());
		this._svg.append(drawing);
		/*
		let defs = this.getDefs();
		let drawing = TcSvgEdit.createSvgElement("symbol");
		drawing.setAttribute("id", this.idDrawing());
		defs.append(drawing);
		this._svg.append(
			TcSvgEdit.createSvgUseElement(
				"#" + this.idDrawing()
			)
		);
		*/
		return drawing;
	}
	
	initNodeSymbol() {
		////console.debug('initNode');
		let defs = this.getDefs();
		let node = TcSvgEdit.createSvgElement("symbol");
		let circle_radius = this.getDefaultData('nodeCircleRadius');
		let cross_radius = this.getDefaultData('nodeCrossRadius');
		let s = Math.max(circle_radius, cross_radius); // The size of the node
		
		node.setAttribute("id", this.idNodeSymbol());
		node.classList.add("node");
		node.setAttribute("fill", this.getDefaultData("nodeFill"));
		node.setAttribute("stroke", this.getDefaultData("nodeStroke"));
		node.setAttribute("stroke-width", this.getDefaultData("nodeStrokeWidth"));
		

		// inatialise element
		let e = null; 

		// Circle
		e = TcSvgEdit.createSvgElement("circle");
		e.setAttribute("cx", s);
		e.setAttribute("cy", s);
		e.setAttribute("r", circle_radius);
		node.append(e);
		
		// Horizontal cross hair
		e = TcSvgEdit.createSvgElement("line");
		e.setAttribute("x1", s - cross_radius);
		e.setAttribute("y1", s);
		e.setAttribute("x2", s + cross_radius);
		e.setAttribute("y2", s);
		node.append(e);

		// Vertical cross hair
		e = TcSvgEdit.createSvgElement("line");
		e.setAttribute("x1", s);
		e.setAttribute("y1", s - cross_radius);
		e.setAttribute("x2", s);
		e.setAttribute("y2", s + cross_radius);
		node.append(e);

		node.setAttribute("transform", "translate(-"+s+", -"+s+")");
		defs.append(node);
		return node;
	}
	
	initRelativeEndMarker() {
		let defs = this.getDefs();
		let marker = TcSvgEdit.createSvgElement("marker");
		let height = this.getDefaultData("relativeIndicatorEndMarkerHeight");
		let width = this.getDefaultData("relativeIndicatorEndMarkerWidth");

		marker.style.stroke = this.getDefaultData("relativeIndicatorStroke");
		marker.style.strokeDasharray = this.getDefaultData("relativeIndicatorStrokeDasharray");
		marker.style.strokeWidth = this.getDefaultData("relativeIndicatorStrokeWidth");
		marker.style.fill = this.getDefaultData("relativeIndicatorEndMarkerFill");
		marker.setAttribute("id", this.idRelativeEndMarker());

		marker.setAttribute("markerWidth", width);
		marker.setAttribute("markerHeight", height);
		marker.setAttribute("refX", width);
		marker.setAttribute("refY", height/2);
		marker.setAttribute("orient", "auto");
		
		let shape = TcSvgEdit.createSvgElement("polyline");
		shape.setAttribute("points", "0 0, "+width+" "+height/2+", 0 "+height);
		
		marker.append(shape);
		defs.append(marker);
		return marker;
	}
	
	initRelativeStartMarker() { 
		let defs = this.getDefs();
		let marker = TcSvgEdit.createSvgElement("marker");
		let radius = this.getDefaultData("relativeIndicatorStartMarkerRadius");

		marker.style.stroke = this.getDefaultData("relativeIndicatorStroke");
		marker.style.strokeDasharray = this.getDefaultData("relativeIndicatorStrokeDasharray");
		marker.style.strokeWidth = this.getDefaultData("relativeIndicatorStrokeWidth");
		marker.style.fill = this.getDefaultData("relativeIndicatorStartMarkerFill");
		marker.setAttribute("id", this.idRelativeStartMarker());

		marker.setAttribute("markerWidth", radius*2);
		marker.setAttribute("markerHeight", radius*2);
		marker.setAttribute("refX", radius);
		marker.setAttribute("refY", radius);
		marker.setAttribute("orient", "auto");
		
		let shape = TcSvgEdit.createSvgElement("circle");
		shape.setAttribute("cx", radius);
		shape.setAttribute("cy", radius);
		shape.setAttribute("r", radius);
		
		marker.append(shape);
		defs.append(marker);
		return marker;
	} 
	
	createNode(pos) {
		////console.debug("Svg.createNode("+pos.x+", "+pos.y+")");
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

	addElement(elem) {
		////console.debug('Svg.addElement');
		this._elements.push(elem);
		return this;
	}
	
	removeElement(element) {
		////console.debug('Svg.removeElement');
		this._elements = this._elements.filter(item => item !== element);
		this.getDrawing().removeChild(element.getElement());
	}
	
	getElementCurrent() {
		////console.debug("Svg.getElementCurrent()");
		return this._element_current;
	}
	
	setElementCurrent(elem=null) {
		////console.debug("Svg.setElementCurrent()");
		////console.debug(elem);
		this._element_current = elem;
		TcSvgEdit.documentInfoField("element_current", this._element_current);
		return this;
	}

	getElementSelected() {
		return this._element_selected;
	}
	
	getElementTypeSelected() {
		////console.debug("Svg.getElementTypeSelected()");
		return this._element_type_selected;
	}
	
	setElementTypeSelected(type=null) {
		////onsole.debug('Svg.setElementTypeSelected');
		////console.debug(type);
		TcSvgEdit.elementTypeSelectedUnset(); 
		this._element_type_selected = type;
		if (type) { TcSvgEdit.elementTypeSelectedSet(type); }
		return this;
	}
	
	getNodePrevious() {
		return this._node_previous;
	}
	
	setNodePrevious(node) {
		if (this._node_previous) {
			this._node_previous._node.classList.remove("previous");
		}
		this._node_previous = node;
		if (node) {
			this._node_previous._node.classList.add("previous");
		}
		return this;
	}
	
	getNodeSelected() {
		////console.debug("getNodeSelected");
		////console.debug(this._svg._node_selected);
		return this._node_selected;
	}
	
	setNodeSelected(node=null) { 
		////console.debug("Svg.setNodeSelected");
		if (this._node_selected && node !== this._node_selected) {
			this.setNodePrevious(this._node_selected);
		}
		this._node_selected = node;
		////console.debug(this._node_selected)
		return this;
	}
	
	append(elem) {
		////console.debug("Svg.append()");
		this.getDrawing().append(elem._element);
		////console.debug(this._svg);
		return this;
	}
	
	getCoordinates(event) {
		///console.debug("getCoordinates()");
		// @see https://stackoverflow.com/questions/12752519/svg-capturing-mouse-coordinates
		let pt = this._svg.createSVGPoint();
		pt.x = event.clientX;
		pt.y = event.clientY;

		// The cursor point, translated into svg coordinates
		let cursor_pt =  pt.matrixTransform(this._svg.getScreenCTM().inverse());
		///console.debug("(" + cursor_pt.x + ", " + cursor_pt.y + ")");
		return cursor_pt;
	}
	
	getSvg() {
		return this._svg;
	}
	
	getDefaultData(id) {
		////console.debug('Svg.getDefaultData(' + id + ')');
		return 'undefined' === typeof this._svg.dataset[id] ? TcSvgEdit[id] : this._svg.dataset[id];
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
		this._relative = null;
		this._relatives = [];
	}
	
	onMouseDrag(pos) {
		///console.debug("Node.onMouseDrag");
		///console.debug(typeof node);
		///console.debug(pos);
		this.setPosition(pos);
	}
	
	addElement(element) {
		this._elements.push(element);
		return this;
	}
	
	removeElement(element) {
		////console.debug('Node.removeElement');
		this._elements = this._elements.filter(item => item !== element);
		return this;
	}
	
	getPosition() {
		return {
			x: this._node.getAttribute("x"),
			y: this._node.getAttribute("y")
		}
	}
	
	setPosition(position) {
		////console.debug('Node.setPosition');
		let diff = TcSvgEdit.Util.diff(this.getPosition(), position);
	
		this._node.setAttribute("x", position.x); 
		this._node.setAttribute("y", position.y); 

		this._relatives.forEach(function(node) {
			//console.debug(node);
			node.movePosition(diff);
		});
		
		this._elements.forEach(function(elem) {
			//console.debug(elem);
			elem.update();
		});

		return this.updateRelativeIndicator();
	}
	
	movePosition(diff) {
		return this.setPosition(TcSvgEdit.Util.diff(this.getPosition(), diff));
	}
	
	setRelative(node) {
		// TODO: Remove relative node if node == null and this._relative is set

		if (node) {
			let svg = this.getSvg();
			// make sure we have the markers
			svg.getRelativeEndMarker();
			svg.getRelativeStartMarker();
			let indicator = TcSvgEdit.createSvgElement("line");
			indicator.style.stroke = svg.getDefaultData('relativeIndicatorStroke');
			indicator.style.strokeDasharray = svg.getDefaultData('relativeIndicatorStrokeDasharray');
			indicator.style.strokeWidth = svg.getDefaultData('relativeIndicatorStrokeWidth');
			indicator.setAttribute("marker-end", "url(#"+svg.idRelativeEndMarker() +")");
			indicator.setAttribute("marker-start", "url(#"+svg.idRelativeStartMarker() +")");
			indicator.classList.add("relative");
			this._relative = {
				indicator: indicator,
				node: node,
			}
			this.updateRelativeIndicator();
			svg.getSvg().append(indicator);
			node.addRelative(this);
		}
		return this;
	}

	updateRelativeIndicator() {
		if (null !== this._relative) {
			let p1 = this._relative.node.getPosition();
			let p2 = this.getPosition();
			this._relative.indicator.setAttribute("x1", p1.x);
			this._relative.indicator.setAttribute("y1", p1.y);
			this._relative.indicator.setAttribute("x2", p2.x);
			this._relative.indicator.setAttribute("y2", p2.y);
		}
		return this;
	}

	addRelative(node) {
		this._relatives.push(node);
		return this;
	}

	getSvg() {
		return this._svg;
	}
	
}


//
// ELEMENT WRAPPER CLASS
//
TcSvgEdit.Element = class {
	constructor(element, svg) {
		////console.debug("TcSvgEdit.Element.constructor");

		element.classList.add('element');
		element.addEventListener("mouseenter", this.onMouseEnter);
		element.addEventListener("mouseleave", this.onMouseLeave);
		
		this._element = element;
		this._nodes = [];
		this._svg = svg;
		svg.addElement(this);
	
		this.setStrokeWidth(2);
		this.setStrokeColour("#CC0000");
	}

	destruct() {
		////console.debug('Element.destruct');
		this.deselect();
		this._nodes.forEach(function(node) {
			console.debug
			node.removeElement(this);
		}, this);

		this.getSvg().removeElement(this);
		this._element = null;
		this._svg = null;
	}
	
	onMouseEnter(event) {
		////console.debug('Element.onMouseEnter');
		return TcSvgEdit.getElement(event.target).select(); 
	}
	
	onMouseLeave(event) {
		////console.debug('Element.onMouseLeave');
		return TcSvgEdit.getElement(event.target).deselect(); 
	}
	
	addNode(node) {
		////console.debug('Element.addNode')
		this._nodes.push(node);
		node.addElement(this);
		if (this.minNodes() === this._nodes.length) { this._svg.append(this); }
		if (this.minNodes() <= this._nodes.length) { this.update(); }
		if (this.maxNodes() <= this._nodes.length) { this._svg.setElementCurrent(); }
		return this;
	}

	select() {
		this._element.classList.add("selected");
		this._svg._element_selected=this;
	}
	
	deselect() {
		if (this._svg._element_selected === this) {
			this._svg._element_selected = null;
		}
		this._element.classList.remove("selected");
	}
	
	getSvg() {
		return this._svg;
	}
	
	getElement() {
		return this._element;
	}
	setStrokeWidth(width) {
		this._element.style.strokeWidth = width;
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
		////console.debug('new ElementCircle')
		super(TcSvgEdit.createSvgElement('circle'), svg);
		this._element.style.fill = "none";
	}
	
	maxNodes() { return 2; }
	minNodes() { return 2; }
	
	update() {
		////console.debug('ElementCircle.update');
		let p1 = this._nodes[0].getPosition();
		let p2 = this._nodes[1].getPosition();
		
		this._element.setAttribute("cx", p1.x);
		this._element.setAttribute("cy", p1.y);
		this._element.setAttribute("r", TcSvgEdit.Util.distance(p1, p2));
		
		return this;
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
		
		return this;
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

