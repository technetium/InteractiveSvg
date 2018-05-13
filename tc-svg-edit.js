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

	//
	// Getters
	//
	
	static getDefs(svg) {
		let defs = svg.querySelector("defs");
		if (!defs)	{
			defs = TcSvgEdit.initDefs(svg);
		}
		return defs;
	}

	static getDrawing(svg) {
		let drawing = document.getElementById(TcSvgEdit.idDrawing(svg));
		if (!drawing)	{
			drawing = TcSvgEdit.initDrawing(svg);
		}
		return drawing;
	}

	static getId(svg) {
		if (!svg.hasAttribute("id")) {
			TcSvgEdit.initSvgId(svg);
		}
		return svg.getAttribute("id");
	}
	
	static getNode(svg) {
		let node = document.getElementById(TcSvgEdit.idNode(svg));
		if (!node)	{
			node = TcSvgEdit.initNode(svg);
		}
		console.log(node);
		return node;
	}

	//
	// Id's
	//
	static idDrawing(svg) { return	TcSvgEdit.getId(svg) + '-symbol-drawing'; }
	static idNode(svg) { return	TcSvgEdit.getId(svg) + '-symbol-node'; }

	//
	// Initialisers
	//

	static initDefs(svg) {
		console.log('initDefs');
		let defs = TcSvgEdit.createSvgElement("defs");
		svg.append(defs);
		return defs;
	}
		
	static initDrawing(svg) {
		console.log('initDrawing');
		let defs = TcSvgEdit.getDefs(svg);
		let drawing = TcSvgEdit.createSvgElement("symbol");
		drawing.setAttribute("id", TcSvgEdit.idDrawing(svg));
		defs.append(drawing);
		svg.append(
			TcSvgEdit.createSvgUseElement(
				"#" + TcSvgEdit.idDrawing(svg)
			)
		);
		return drawing;
	}
	
	static initNode(svg) {
		console.log('initNode');
		let defs = TcSvgEdit.getDefs(svg);
		let node = TcSvgEdit.createSvgElement("symbol");
		node.setAttribute("id", TcSvgEdit.idNode(svg));
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
	
	static initSvgId(svg) {
		svg.setAttribute(
			"id",
			TcSvgEdit.prefix + '_id_' +
			//@see https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
			Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)
		);
	}
	
	//
	// Event Listeners
	//
	
	static onMouseDown(event) {
		console.log("TcSvgEdit.onMouseDown");
		console.log(event);
		TcSvgEdit.elementTypeSelect(event);
		TcSvgEdit.svgOnMouseDown(event);
	}
	
	static onMouseMove(event) {
		///console.log("TcSvgEdit.onMouseMove");
		///console.log(event);
		TcSvgEdit.svgOnMouseMove(event);
	}

	static onMouseUp(event) {
		//console.log("TcSvgEdit.onMouseUp");
		//console.log(event);
		TcSvgEdit.svgOnMouseUp(event);
	}

	//
	// document
	//
	
	static documentPositionIndicator(dimension, value) {
		document.querySelectorAll(
			"[data-tc-svg-edit-position-indicator=\"" + 
			dimension + "\"]"
		).forEach(function(elem) {
			console.log(elem);
			elem.innerHTML = value;
		});
	}
	
	//
	// element
	//
	
	static elementTypeSelect(event) {
		console.log('elementSelect');
		let elem = event.target.closest("[data-tc-svg-edit-element-type-select]");
		if (null === elem) { return }
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
			console.log(elem);
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
	// node
	//
	
	static nodeOnMouseDrag(node, pos) {
		///console.log("nodeOnMouseDrag");
		///console.log(typeof node);
		///console.log(pos);
		node.setAttribute("x", pos.x); 
		node.setAttribute("y", pos.y); 
	}
	
	//
	// svg
	//
	
	static svgOnMouseDown(event) {
		let svg = event.target.closest("svg.tc_svg_edit");
		if (null === svg) { return; }
		
		let node = event.target.closest(".node");
		if (null !== node) {
			console.log(node);
			svg[TcSvgEdit.prefix + "_selected"] = node;
			console.log("selected");
			console.log(svg[TcSvgEdit.prefix + "_selected"]);
			return;
		}
		console.log(svg);
		let pos = TcSvgEdit.utilGetSvgCoordinates(svg, event);
		console.log(pos);
		TcSvgEdit.svgAddNode(svg, pos.x, pos.y);
	}

	static svgOnMouseMove(event) {
		let svg = event.target.closest("svg.tc_svg_edit");
		if (null === svg) { return; }
		let pos = TcSvgEdit.utilGetSvgCoordinates(svg, event);
		console.log(pos);

		TcSvgEdit.documentPositionIndicator("x", pos.x);
		TcSvgEdit.documentPositionIndicator("y", pos.y);
		
		if (!svg[TcSvgEdit.prefix + "_selected"]) {	return; }

		TcSvgEdit.nodeOnMouseDrag(svg[TcSvgEdit.prefix + "_selected"], pos);
	}

	static svgOnMouseUp(event) {
		let svg = event.target.closest("svg.tc_svg_edit");
		if (null === svg) { return; }
		svg[TcSvgEdit.prefix + "_selected"] = null;
	}
	
	static svgAddNode(svg, x, y) {
		console.log("svgAddNode("+x+", "+y+")");
		let node = TcSvgEdit.getNode(svg);
		let u = TcSvgEdit.createSvgUseElement(
			"#" + TcSvgEdit.idNode(svg), x, y
		);
		u.classList.add("node");
		svg.append(u);
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
	
	static utilGetSvgCoordinates(svg, event) {
		///console.log("utilGetSvgCoordinates()");
		// @see https://stackoverflow.com/questions/12752519/svg-capturing-mouse-coordinates
		let pt = svg.createSVGPoint();
		pt.x = event.clientX;
		pt.y = event.clientY;

		// The cursor point, translated into svg coordinates
		let cursorpt =  pt.matrixTransform(svg.getScreenCTM().inverse());
		///console.log("(" + cursorpt.x + ", " + cursorpt.y + ")");
		return cursorpt;
	}		
}

new TcSvgEdit("someprefix");
