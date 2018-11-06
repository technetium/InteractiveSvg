////console.debug("script");

class TcSvgEdit {

	constructor(prefix) {
		////console.debug('construct");
		TcSvgEdit.looper = 0;
		
		TcSvgEdit.strokeColor = '#600';
		TcSvgEdit.strokeWidth = 2;
		
		TcSvgEdit.nodeCircleRadius = 5;
		TcSvgEdit.nodeCrossRadius = 11;
		TcSvgEdit.nodeFill = '#EEF';
		TcSvgEdit.nodeStroke = '#00F';
		TcSvgEdit.nodeStrokeWidth = 0.3;
		
		TcSvgEdit.relativeIndicatorEndMarkerWidth = '10';
		TcSvgEdit.relativeIndicatorEndMarkerFill = 'none';
		TcSvgEdit.relativeIndicatorEndMarkerHeight = '9';
		TcSvgEdit.relativeIndicatorEndMarkerWidth = '12';
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
		document.addEventListener("change", function(event){
			TcSvgEdit.onChange(event);
		});
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
		TcSvgEdit._element_sub_current = null;
		TcSvgEdit._element_type_selected = null;
		TcSvgEdit._element_sub_type_selected = null;
		TcSvgEdit._svg_current = null;
	}

	static getElement(elem) {
		return TcSvgEdit.getSvg(elem.closest("svg.tc_svg_edit")).getElement(elem); 
	}
	
	static getNodeRelative(relative) {
		////console.debug('TcSvgEdit.getNodeRelative');
		return TcSvgEdit.getSvg(relative.closest("svg.tc_svg_edit")).getNodeRelative(relative); 
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
	
	static onChange(event) {
		console.debug("TcSvgEdit.onChange");
		console.debug(event);
		TcSvgEdit.elementStrokeColor(event);
		TcSvgEdit.elementStrokeWidth(event);
	}
	
	static onKeyDown(event) {
		////console.debug("TcSvgEdit.onKeyDown");
		////console.debug(event);
		let svg = TcSvgEdit.svgCurrentGet();
		if (svg && svg.onKeyDown(event)) { return true; }
	}

	static onMouseDown(event) {
		////console.debug("TcSvgEdit.onMouseDown");
		////console.debug(event);
		if (TcSvgEdit.elementSubTypeSelect(event)) { return true; }
		if (TcSvgEdit.elementTypeSelect(event)) { return true; }
		let svg = TcSvgEdit.getSvg(event.target.closest("svg.tc_svg_edit"));
		if (svg && svg.onMouseDown(event)) { return true; }
		if (TcSvgEdit.svgCurrentGet()) {
		TcSvgEdit.svgCurrentGet().setElementSubTypeSelected();
			TcSvgEdit.svgCurrentGet().setElementTypeSelected();
		}
	}
	
	static onMouseMove(event) {
		////console.debug("TcSvgEdit.onMouseMove");
		////console.debug(event);
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
		////console.debug('TcSvgEdit.svgCurrentSet()');
		////console.debug(svg);
		
		if (TcSvgEdit._svg_current) { TcSvgEdit.svgCurrentUnset() }
		if (svg) {
		TcSvgEdit._svg_current = svg;
		TcSvgEdit.elementStrokeColorSet();
		TcSvgEdit.elementStrokeWidthSet();
		TcSvgEdit.elementSubTypeSelectedSet();
		TcSvgEdit.elementTypeSelectedSet();
		TcSvgEdit.documentInfoField("svg_current", svg._svg.getAttribute("id"));
		}
	}
	
	static svgCurrentUnset() {
		////console.debug('svgCurrentUnset');
		TcSvgEdit.elementSubTypeSelectedUnset();
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
	// elementStrokeColor
	//

	static elementStrokeColor(event) {
		console.debug('TcSvgEdit.elementStrokeColor'); 
		let elem = event.target.closest("[data-tc-svg-edit-element-stroke-color]");
		if (!elem) { return false }
		////console.debug(elem);
		let color = elem.value;
		////console.debug(type);
		TcSvgEdit.svgCurrentGet().setElementStrokeColor(color);
		return true;
	}
	
	static elementStrokeColorSet() {
		////console.debug('elementStrokeColorSet');
		////console.debug(TcSvgEdit.svgCurrentGet());
		////console.debug(TcSvgEdit.svgCurrentGet().getElementTypeSelected());
		document.querySelectorAll(
			"[data-tc-svg-edit-element-stroke-color]"
		).forEach(function(elem) {
			elem.value = TcSvgEdit.svgCurrentGet().getElementStrokeColor();
		});
	}

	
	//
	// elementStrokeWidth
	//

	static elementStrokeWidth(event) {
		console.debug('TcSvgEdit.elementStrokeWidth'); 
		let elem = event.target.closest("[data-tc-svg-edit-element-stroke-width]");
		if (!elem) { return false }
		////console.debug(elem);
		let width = elem.value;
		////console.debug(type);
		TcSvgEdit.svgCurrentGet().setElementStrokeWidth(width);
		return true;
	}
	
	static elementStrokeWidthSet() {
		////console.debug('elementStrokeWidthSet');
		////console.debug(TcSvgEdit.svgCurrentGet());
		////console.debug(TcSvgEdit.svgCurrentGet().getElementTypeSelected());
		document.querySelectorAll(
			"[data-tc-svg-edit-element-stroke-width]"
		).forEach(function(elem) {
			elem.value = TcSvgEdit.svgCurrentGet().getElementStrokeWidth();
		});
	}

	
	//
	// elementSubTypeSelect
	//

	static elementSubTypeSelect(event) {
		////console.debug('elementTypeSelect');
		let elem = event.target.closest("[data-tc-svg-edit-element-sub-type-select]");
		if (!elem) { return false }
		////console.debug(elem);
		let type = elem.getAttribute("data-tc-svg-edit-element-sub-type-select")
		////console.debug(type);
		TcSvgEdit.svgCurrentGet().setElementSubTypeSelected(type);
		return true;
	}
	
	static elementSubTypeSelectedSet() {
		////console.debug('elementSubTypeSelectedSet');
		////console.debug(TcSvgEdit.svgCurrentGet());
		////console.debug(TcSvgEdit.svgCurrentGet().getElementSubTypeSelected());
		document.querySelectorAll(
			"[data-tc-svg-edit-element-sub-type-select=\"" + 
			TcSvgEdit.svgCurrentGet().getElementSubTypeSelected() +
			"\"]"
		).forEach(function(elem) {
			elem.classList.add("selected");
		});
	}

	static elementSubTypeSelectedUnset(type) {
		////console.debug('elementSubTypeSelectedUnset');
		////console.debug(TcSvgEdit.svgCurrentGet().getElementSubTypeSelected());
		document.querySelectorAll(
			"[data-tc-svg-edit-element-sub-type-select=\"" + 
			TcSvgEdit.svgCurrentGet().getElementSubTypeSelected() +
			"\"]"
		).forEach(function(elem) {
			elem.classList.remove("selected");
		});
	}
	
	//
	// elementTypeSelect
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
			let group = elem.closest('[data-tc-svg-edit-element="select-group"]');
			if (group) { group.classList.add("selected"); }
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
			let group = elem.closest('[data-tc-svg-edit-element="select-group"]');
			if (group) { group.classList.remove("selected"); }
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

	static assert(expr) {
		if (expr) return true;
		0/1;
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
		this._element_sub_current = null;
		this._element_selected = null;
		this._element_stroke_color = this.getDefaultData("strokeColor");
		this._element_stroke_width = this.getDefaultData("strokeWidth");
		this._element_sub_type_selected = null;
		this._element_type_selected = null;
		this._elements = [];
		this._nodes = [];
		
		this._node_previous = null;
		this._node_relative_selected = null
		this._node_selected = null;

		this._stroke_color = 
		
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
	idRelativeEndMarker()	{ return this.id() + '-marker-end-relative'; }
	idRelativeStartMarker()	{ return this.id() + '-marker-start-relative'; }
	
	//
	// Event handlers
	//
	onKeyDown(event) {
		////console.debug("Svg.onKeyDown");
		////console.debug(event);
		switch (event.key) {
			case "c" : return this.setElementTypeSelected("circle");
			case "i" : return this.setElementTypeSelected("path") && this.setElementSubTypeSelected("path_line");
			case "l" : return this.setElementTypeSelected("line");
			case "m" : // Fall trough to p 
			case "p" : return this.setElementTypeSelected("path") && this.setElementSubTypeSelected("path_move");
			case "y" : return this.setElementTypeSelected("polyline");
			case "Delete" : return this.doDelete();
			case "Escape" : return this.setElementTypeSelected(null);
			default: 
				////console.debug(event.key);
			return false;
		}
	}
	
	onMouseDown(event) {
		////console.debug("Svg.onMouseDown");
		//console.debug(event);
		let node = this.getNode(event.target.closest(".node"));
		////console.debug(node);11
		if (!node) { 
			node = this.createNode(this.getCoordinates(event));
		}
		if (event.ctrlKey) {
			node.setRelative(node.getSvg().getNodePrevious());
		}
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
		if (this.getNodeRelativeSelected()) {
			this.setNodeRelativeSelected(this.getNodeRelativeSelected().destruct());
			return true;
		}
		if (this.getElementSelected()) {
			this.setElementSelected(this.getElementSelected().destruct());
			return true;
		}
		if (this.getNodeSelected()) {
			this.setNodeSelected(this.getNodeSelected().destruct());
			////console.log('Selected');
			////console.log(this._node_selected);
			////console.log('Previous');
			////console.log(this._node_previous);
			return true;
		}
		return false;
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
	
	getNodeRelative(relative) {
		////console.debug('Svg.getNodeRelative()');
		
		return this._nodes.find(function(n) {
			////console.debug('Node: '  + n);
			return n.getRelative() && (n.getRelative().getIndicator() === relative);
		}).getRelative();
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
	
	initNodeRelativeIndicator(indicator) {
		// make sure we have the markers
		this.getRelativeEndMarker();
		this.getRelativeStartMarker();
		let elem = TcSvgEdit.createSvgElement("path");
		elem.style.fill = "none";
		elem.style.stroke = this.getDefaultData('relativeIndicatorStroke');
		elem.style.strokeDasharray = this.getDefaultData('relativeIndicatorStrokeDasharray');
		elem.style.strokeWidth = this.getDefaultData('relativeIndicatorStrokeWidth');
		elem.setAttribute("marker-end", "url(#"+this.idRelativeEndMarker() +")");
		elem.setAttribute("marker-start", "url(#"+this.idRelativeStartMarker() +")");
		elem.classList.add("relative");
		elem.addEventListener("mouseenter", indicator.onMouseEnter);
		elem.addEventListener("mouseleave", indicator.onMouseLeave);
		this.getSvg().append(elem);
		return elem;
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
		this.getNodeSymbol(); // Make sure we have a node
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
		this.getDrawing().append(elem._element);
		return this;
	}
	
	removeElement(element) {
		////console.debug('Svg.removeElement');
		this._elements = this._elements.filter(item => item !== element);
		element.getElement().parentNode.removeChild(element.getElement());
		return this;
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

	getElementSubCurrent() {
		////console.debug("Svg.getElementSubCurrent()");
		return this._element_sub_current;
	}
	
	setElementSubCurrent(elem=null) {
		////console.debug("Svg.setElementSubCurrent()");
		////console.debug(elem);
		this._element_sub_current = elem;
		TcSvgEdit.documentInfoField("element_sub_current", this._element_sub_current);
		return this;
	}

	getElementSelected() {
		return this._element_selected;
	}

	getElementStrokeColor() {
		return this._element_stroke_color;
	}
	
	setElementStrokeColor(color) {
		this._element_stroke_color = color;
		TcSvgEdit.elementStrokeColorSet(color);
		return this;
	}

	getElementStrokeWidth() {
		return this._element_stroke_width;
	}
	
	setElementStrokeWidth(width) {
		this._element_stroke_width = width;
		TcSvgEdit.elementStrokeWidthSet(width);
		return this;
	}

	getElementSubTypeSelected() {
		////console.debug("Svg.getElementSubTypeSelected()");
		return this._element_sub_type_selected;
	}
	
	setElementSubTypeSelected(type=null) {
		////onsole.debug('Svg.setElementSubTypeSelected');
		////console.debug(type);
		TcSvgEdit.elementSubTypeSelectedUnset();
		this.setElementSubCurrent(); // Unset the current Element, so a new one is create with this for the new type
		this._element_sub_type_selected = type;
		if (type) { TcSvgEdit.elementSubTypeSelectedSet(type); }
		return this;
	}

	getElementTypeSelected() {
		////console.debug("Svg.getElementTypeSelected()");
		return this._element_type_selected;
	}
	
	setElementTypeSelected(type=null) {
		////onsole.debug('Svg.setElementTypeSelected');
		////console.debug(type);
		TcSvgEdit.elementTypeSelectedUnset();
		this.setElementCurrent(); // Unset the current Element, so a new one is create with this for the new type
		this._element_type_selected = type;
		if (type) { TcSvgEdit.elementTypeSelectedSet(type); }
		return this;
	}
	
	removeNode(node) {
		////console.debug('Svg.removeNode');
		this._nodes = this._nodes.filter(item => item !== node);
		node.getNode().parentNode.removeChild(node.getNode());
		return this;
	}
	
	getNodePrevious() {
		return this._node_previous;
	}
	
	setNodePrevious(node) {
		////console.debug('Svg.setNodePrevious()');
		////console.debug(node);
		if (this._node_previous) {
			this._node_previous._node.classList.remove("previous");
		}
		this._node_previous = node;
		if (node) {
			TcSvgEdit.Util.assert(node._node);
			this._node_previous._node.classList.add("previous");
		}
		return this;
	}
	
	getNodeRelativeSelected() {
		////console.debug('Svg.getNodeRelativeSelected()');
		////console.debug(this._node_relative_selected);
		return this._node_relative_selected;
	}
	
	setNodeRelativeSelected(relative) {
		////console.debug('Svg.setNodeRelativeSelected()');
		this._node_relative_selected = relative;
		////console.debug(this._node_relative_selected);
		return this;
	}
	
	getNodeSelected() {
		////console.debug("getNodeSelected");
		////console.debug(this._svg._node_selected);
		return this._node_selected;
	}
	
	setNodeSelected(node=null) { 
		////console.debug("Svg.setNodeSelected");
		////console.debug(node);
		////if (node && !node._node) {console.error('UNFINISHED NODE');}
		if (this._node_selected && node !== this._node_selected) {
			this.setNodePrevious(this._node_selected);
		}
		this._node_selected = node;
		////console.debug(this._node_selected)
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
		///console.debug("Node.constructor");
		this._node = node;
		this._svg = svg;
		this._elements = [];
		this._relative = null;
		this._relatives = [];
	}
	
	destruct() {
		console.debug("Node.destruct()");
		console.debug(this);
		if (this.getSvg().getNodeSelected() === this) { this._svg.setNodeSelected(null); }
		if (this.getSvg().getNodePrevious() === this) { this._svg.setNodePrevious(null); }
		
		let that = null;
		if (this._relative) {
			that = this._relative.getThatNode();
			this._relative = this._relative.destruct();
		}
		this._relatives.forEach(function(relative) {
			//console.debug(relative);
			if (that) {
				relative.setThatNode(that);
			} else {
				relative.destruct();
			}
		});
		
		this._elements.forEach(function(elem) {
			console.debug(elem);
			// TODO: just remove the node from the element
			elem.destruct();
		});
		
		this._svg.removeNode(this);
		this._node = null;
		this._svg = null;
		return null;
	}
	
	
	onMouseDrag(pos) {
		////console.debug("Node.onMouseDrag");
		////console.debug(typeof node);
		////console.debug(pos);
		this.setPosition(pos);
	}
	
	addElement(element) {
		console.debug('Node.addElement()')
		console.debug(this);
		console.debug(element)
		this._elements.push(element);
		return this;
	}
	
	removeElement(element) {
		////console.debug('Node.removeElement');
		this._elements = this._elements.filter(item => item !== element);
		return this;
	}
	
	getNode() {
		return this._node;
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

		this._relatives.forEach(function(relative) {
			////console.debug(relative);
			relative.getThisNode().movePosition(diff);
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
	
	checkRelative(node) {
		////console.debug('Node.checkRelative()');
		////console.debug(this);
		////console.debug('node: (' + node.getPosition().x + ', ' + node.getPosition().y + ')');
		////console.debug('this: (' + this.getPosition().x + ', ' + this.getPosition().y + ')');
		
		if (this === node) { 
			return true;
		}
		if (this.getRelative()) {
			return this.getRelative().getThatNode().checkRelative(node);
		}
		return false;
	}

	getRelative() {
		return this._relative;
	}
	
	setRelative(node) {
		////console.debug('Node.setRelative()');
		if (!node || node.checkRelative(this)) {
			return this;
		}
		if (this._relative) {
			this._relative = this._relative.destruct();
		}
		if (node) {
			this._relative = new TcSvgEdit._NodeRelative(this, node);
		}
		return this;
	}

	updateRelativeIndicator() {
		////console.debug('updateRelativeIndicator');
		if (null !== this._relative) {
			this._relative.update();
		}
		return this;
	}

	addRelative(relative) {
		this._relatives.push(relative);
		return this;
	}
	
	removeRelative(relative) {
		this._relatives = this._relatives.filter(item => item !== relative);
		return this;
	}
		
	getSvg() {
		return this._svg;
	}
	
	toString() { return this.getPosition().x + ', ' + this.getPosition().y ; }
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
	
		this.setStrokeColor(svg.getElementStrokeColor());
		this.setStrokeWidth(svg.getElementStrokeWidth());
	}

	destruct() {
		console.debug('Element.destruct');
		console.debug(this);
		this.deselect();
		this._nodes.forEach(function(node) {
			node.removeElement(this);
		}, this);

		this.getSvg().removeElement(this);
		this._element = null;
		this._svg = null;
		
		return null;
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
		console.debug('Element.addNode');
		console.debug(this);
		console.debug(node);
		this._nodes.push(node);
		node.addElement(this);
		////if (this.minNodes() === this._nodes.length) { this._svg.append(this); }
		this.update();
		if (this.maxNodes() <= this._nodes.length) { this._svg.setElementCurrent(); }
		return this;
	}

	select() {
		this._element.classList.add("selected");
		this.getSvg()._element_selected=this;
	}
	
	deselect() {
		if (this.getSvg()._element_selected === this) {
			this.getSvg()._element_selected = null;
		}
		this._element.classList.remove("selected");
	}
	
	getSvg() {
		return this._svg;
	}
	
	getElement() {
		return this._element;
	}
	setStrokeColor(color) {
		this._element.style.stroke = color;
		return this;
	}
	
	setStrokeWidth(width) {
		this._element.style.strokeWidth = width;
		return this;
	}
	
	update() {
		if (this.minNodes() <= this._nodes.length) { this.updateChild(); }
	}	
	
	updateChild() { TcSvgEdit.Utill.assert(false); } // Needs to be defined in child class
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
	
	updateChild() {
		////console.debug('ElementCircle.update');
		let p1 = this._nodes[0].getPosition();
		let p2 = this._nodes[1].getPosition();
		
		this._element.setAttribute("cx", p1.x);
		this._element.setAttribute("cy", p1.y);
		this._element.setAttribute("r", TcSvgEdit.Util.distance(p1, p2));
		
		return this;
	}
	
	toString() {
		let str = 'circle';
		if (this._nodes.)
		let p1 = this._nodes[0].getPosition();
		let p2 = this._nodes[1].getPosition();
		
		this._element.setAttribute("cx", p1.x);
		this._element.setAttribute("cy", p1.y);
		this._element.setAttribute("r", TcSvgEdit.Util.distance(p1, p2));
		return 'circle cx="'+p1.x+'" cy="'+p1.y+'" r="'+TcSvgEdit.Util.distance(p1, p2)+'"';
	}
}

//
// ELEMENT LINE WRAPPER CLASS
//
TcSvgEdit.ElementLine = class extends TcSvgEdit.Element {
	constructor(svg) {
		////console.debug('new ElementLine')
		super(TcSvgEdit.createSvgElement('line'), svg);
	}

	maxNodes() { return 2; }
	minNodes() { return 2; }
	
	updateChild() {
		////console.debug('ElementLine.update');
		let p1 = this._nodes[0].getPosition();
		let p2 = this._nodes[1].getPosition();
		
		this._element.setAttribute("x1", p1.x);
		this._element.setAttribute("y1", p1.y);
		this._element.setAttribute("x2", p2.x);
		this._element.setAttribute("y2", p2.y);
		
		return this;
	}
}

//
// ELEMENT POLYLINE WRAPPER CLASS
//
TcSvgEdit.ElementPolyLine = class extends TcSvgEdit.Element {
	constructor(svg) {
		////console.debug('new ElementLine')
		super(TcSvgEdit.createSvgElement("polyline"), svg);
		this._element.style.fill = "none";
	}

	maxNodes() { return Math.maxInt; }
	minNodes() { return 2; }
	
	updateChild() {
		this._element.setAttribute(
			"points",
			this._nodes.reduce((acc, node) => { 
				//return acc + node.getPosition().x + " "node.getPosition().x + " ";
				return acc + node.getPosition().x + "," + node.getPosition().y + " ";
			}, "")
		);
		console.log(this._element.getAttribute("points"));
		return this;
	}
}

TcSvgEdit.ElementPath = class extends TcSvgEdit.Element {
	constructor(svg) {
		////console.debug('new ElementLine')
		super(TcSvgEdit.createSvgElement("path"), svg);
		this._element.style.fill = "none";
		
		this._sub_element = 'path_move'
	}

	maxNodes() { return Math.maxInt; }
	minNodes() { return 2; }
	
	updateChild() {
		this._element.setAttribute(
			"points",
			this._nodes.reduce((acc, node) => { 
				//return acc + node.getPosition().x + " "node.getPosition().x + " ";
				return acc + node.getPosition().x + "," + node.getPosition().y + " ";
			}, "")
		);
		console.log(this._element.getAttribute("points"));
		return this;
	}
}

TcSvgEdit.ElementSub = class {
}

TcSvgEdit.ElementPathMove = class extends TcSvgEdit.ElementSub {
}

// Register Element Names
TcSvgEdit.ElementObjects = {
	circle:	TcSvgEdit.ElementCircle,
	line:	TcSvgEdit.ElementLine,
	path:	TcSvgEdit.ElementPath,
	path_love:	TcSvgEdit.ElementPathLine,
	path_move:	TcSvgEdit.ElementPathMove,
	polyline:	TcSvgEdit.ElementPolyLine,
}

/**
Move	M10 10
Line	L 20 20   (H and L will be ignored)
cloZe	Z
Cubic	C 10 10, 20 20, 30 10
Cubic S	S 20 20, 30 10
Quad	Q 10 10, 20 20
Quad	T 10 10
Arc		A rx ry x-axis rotation larg-arc-flag sweep-flag x y



*/


TcSvgEdit._NodeRelative = class {
	constructor(this_node, that_node) {
		
		////console.debug('_NodeRelative.construct()');
		if (!this_node || !that_node) { 1/0; }
		this._this_node = this_node;
		this._that_node = null;
		this._indicator = null;

		let svg = this_node.getSvg();
		this._indicator = svg.initNodeRelativeIndicator(this);
		this.setThatNode(that_node);
	}
	
	destruct() {
		////console.debug('_NodeRelative.destruct');
		////console.debug(this);
		if (this.getSvg().getNodeRelativeSelected() === this) { this.getSvg().setNodeRelativeSelected(null); }
		this.getThatNode().removeRelative(this);
		this._this_node = null;
		this._that_node = null;
		this._indicator.parentNode.removeChild(this._indicator);
		this._indicator = null;
		return null;
	}
	
	onMouseEnter(event) {
		////console.debug('_NodeRelative.onMouseEnter');
		////console.debug(event.target);
		return TcSvgEdit.getNodeRelative(event.target).select(); 
	}
	
	onMouseLeave(event) {
		////console.debug('_NodeRelative.onMouseLeave');
		return TcSvgEdit.getNodeRelative(event.target).deselect(); 
	}
	
	getIndicator() {
		return this._indicator;
	}

	getThatNode() {
		return this._that_node;
	}
	
	setThatNode(node) {
		////console.debug('_NodeRelative.setThatNode()');
		////console.debug(node);
		TcSvgEdit.Util.assert(!node);
		if (this.getThatNode()) {
			////console.debug('thatNode');
			this.getThatNode().removeRelative(this);
			////console.debug(this.getThatNode());
		}
		this._that_node = node;
		node.addRelative(this); // This goes terrible wrong when the node is null. Handling a null that node is quite complex so let just crash it.
		this.update();
		////console.debug(this);
		return this;
	}	

	getThisNode() {
		return this._this_node;
	}

	getSvg() {
		return this.getThisNode().getSvg();
	}
	
	select() {
		////console.debug("_NodeRelative.select()");
		this._indicator.classList.add("selected");
		this.getSvg().setNodeRelativeSelected(this);
		return this;
	}
	
	deselect() {
		////console.debug("_NodeRelative.deselect()");
		////console.debug(this);
		if (this.getSvg().getNodeRelativeSelected() === this) {
			this.getSvg().setNodeRelativeSelected(null);
		}
		this._indicator.classList.remove("selected");
		////console.debug(this);
		return this;
	}

	update() {
		////console.debug('_NodeRelative.update()');
		////console.debug(this);
		if (null !== this._indicator) {
			let p1 = this._that_node.getPosition();
			let p2 = this._this_node.getPosition();
			let d = TcSvgEdit.Util.diff(p2, p1);
			d = TcSvgEdit.Util.diff(TcSvgEdit.Util.diff(p2, {x: -d.y/4, y: d.x/4}), { x: d.x/2, y: d.y/2 });
			
			this._indicator.setAttribute("d", 
				"M"+p1.x+","+p1.y+" Q"+d.x+","+d.y+" "+p2.x+","+p2.y
			);
		}
		return this;
	}
	
	////toString() { return 'This: (' + this.getThisNode().getPosition().x + ', ' + this.getThisNode().getPosition().y + ')' + 'That: (' + this.getThatNode().getPosition().x + ', ' + this.getThatNode().getPosition().y + ')' ; }
	////toString() { return 'This: (' + this.getThisNode() + ')' + 'That: (' + this.getThatNode() + ')' ; }
}



// http://exploringjs.com/es6/ch_classes.html


class TcSvgTessellation {
	constructor() {
		window.addEventListener("load", function(event){
			TcSvgTessellation.onLoad(event);
		});
		
		this._tessellations = null;
	}
	
	static onLoad(event) {
		document.querySelectorAll("data-tc-svg-tessellation-class]").forEach(function(elem) {
			elem.innerHTML = value;
		});
;
		data-tc-svg-tessellation-class
	}
	
	
	static triangle(group) {
	}
	
	
}

TcSvgTessellation.Tessellation = class {
	this_elements = {};
}

TcSvgTessellation.TessellationTriangle = class extends TcSvgTessellation.Tessellation {
}

// Register Element Names
TcSvgTessellation.TessellationObjects = {
	triangle:	TcSvgTessellation.TessellationTriangle,
}


// Triangle 
//cos(C) = (a^2 + b^2 - c^2) / 2ab  <= Langste lijn is c
//sin(C)/c = sin(B)/b



new TcSvgEdit("someprefix");
new TcSvgTessellation();

