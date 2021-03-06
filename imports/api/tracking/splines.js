export function HSVtoRGB(h, s, v, opacity) {
	var toHex = function(decimalValue, places) {
		if (places == undefined || isNaN(places)) places = 2;
		var hex = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F");
		var next = 0;
		var hexidecimal = "";
		decimalValue = Math.floor(decimalValue);
		while (decimalValue > 0) {
			next = decimalValue % 16;
			decimalValue = Math.floor((decimalValue - next) / 16);
			hexidecimal = hex[next] + hexidecimal
		}
		while (hexidecimal.length < places) {
			hexidecimal = "0" + hexidecimal
		}
		return hexidecimal
	};
	var hi = Math.floor(h / 60) % 6;
	var f = h / 60 - Math.floor(h / 60);
	var p = v * (1 - s);
	var q = v * (1 - f * s);
	var t = v * (1 - (1 - f) * s);
	var r = v;
	var g = t;
	var b = p;
	switch (hi) {
		case 1:
			r = q;
			g = v;
			b = p;
			break;
		case 2:
			r = p;
			g = v;
			b = t;
			break;
		case 3:
			r = p;
			g = q;
			b = v;
			break;
		case 4:
			r = t;
			g = p;
			b = v;
			break;
		case 5:
			r = v;
			g = p;
			b = q;
			break
	}
	if (opacity) {
		return "rgba(" + Math.round(255 * r) + "," + Math.round(255 * g) + "," + Math.round(255 * b) + "," + opacity + ")"
	} else {
		return "#" + toHex(r * 255) + toHex(g * 255) + toHex(b * 255)
	}
}

export function hexToCanvasColor(hexColor, opacity) {
	opacity = opacity || "1.0";
	hexColor = hexColor.replace("#", "");
	var r = parseInt(hexColor.substring(0, 2), 16);
	var g = parseInt(hexColor.substring(2, 4), 16);
	var b = parseInt(hexColor.substring(4, 6), 16);
	return "rgba(" + r + "," + g + "," + b + "," + opacity + ")"
}

export function drawPoint(ctx, x, y, r, color) {
	ctx.save();
	ctx.beginPath();
	ctx.lineWidth = 1;
	ctx.fillStyle = hexToCanvasColor(color, 1);
	ctx.arc(x, y, r, 0, 2 * Math.PI, false);
	ctx.closePath();
	ctx.stroke();
	ctx.fill();
	ctx.restore()
}

export function getControlPoints(x0, y0, x1, y1, x2, y2, t) {
	var d01 = Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
	var d12 = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
	var fa = t * d01 / (d01 + d12);
	var fb = t - fa;
	var p1x = x1 + fa * (x0 - x2);
	var p1y = y1 + fa * (y0 - y2);
	var p2x = x1 - fb * (x0 - x2);
	var p2y = y1 - fb * (y0 - y2);
	return [p1x, p1y, p2x, p2y]
}

export function drawControlLine(ctx, x, y, px, py) {
	ctx.save();
	ctx.beginPath();
	ctx.lineWidth = 1;
	ctx.strokeStyle = "rgba(0,0,0,0.3)";
	ctx.moveTo(x, y);
	ctx.lineTo(px, py);
	ctx.closePath();
	ctx.stroke();
	drawPoint(ctx, px, py, 1.5, "#000000");
	ctx.restore()
}

export function drawSpline(ctx, pts, t, closed) {
	showDetails = true;
	ctx.lineWidth = 4;
	ctx.save();
	var cp = [];
	var n = pts.length;
	if (closed) {
		pts.push(pts[0], pts[1], pts[2], pts[3]);
		pts.unshift(pts[n - 1]);
		pts.unshift(pts[n - 1]);
		for (var i = 0; i < n; i += 2) {
			cp = cp.concat(getControlPoints(pts[i], pts[i + 1], pts[i + 2], pts[i + 3], pts[i + 4], pts[i + 5], t))
		}
		cp = cp.concat(cp[0], cp[1]);
		for (var i = 2; i < n + 2; i += 2) {
			var color = HSVtoRGB(Math.floor(240 * (i - 2) / (n - 2)), .8, .8);
			if (!showDetails) {
				color = "#555555"
			}
			ctx.strokeStyle = hexToCanvasColor(color, .75);
			ctx.beginPath();
			ctx.moveTo(pts[i], pts[i + 1]);
			ctx.bezierCurveTo(cp[2 * i - 2], cp[2 * i - 1], cp[2 * i], cp[2 * i + 1], pts[i + 2], pts[i + 3]);
			ctx.stroke();
			ctx.closePath()
		}
	} else {
		for (var i = 0; i < n - 4; i += 2) {
			cp = cp.concat(getControlPoints(pts[i], pts[i + 1], pts[i + 2], pts[i + 3], pts[i + 4], pts[i + 5], t))
		}
		for (var i = 2; i < pts.length - 5; i += 2) {
			var color = HSVtoRGB(Math.floor(240 * (i - 2) / (n - 2)), .8, .8);
			if (!showDetails) {
				color = "#555555"
			}
			ctx.strokeStyle = hexToCanvasColor(color, .75);
			ctx.beginPath();
			ctx.moveTo(pts[i], pts[i + 1]);
			ctx.bezierCurveTo(cp[2 * i - 2], cp[2 * i - 1], cp[2 * i], cp[2 * i + 1], pts[i + 2], pts[i + 3]);
			ctx.stroke();
			ctx.closePath()
		}
		var color = HSVtoRGB(40, .4, .4);
		if (!showDetails) {
			color = "#555555"
		}
		ctx.strokeStyle = hexToCanvasColor(color, .75);
		ctx.beginPath();
		ctx.moveTo(pts[0], pts[1]);
		ctx.quadraticCurveTo(cp[0], cp[1], pts[2], pts[3]);
		ctx.stroke();
		ctx.closePath();
		var color = HSVtoRGB(240, .8, .8);
		if (!showDetails) {
			color = "#555555"
		}
		ctx.strokeStyle = hexToCanvasColor(color, .75);
		ctx.beginPath();
		ctx.moveTo(pts[n - 2], pts[n - 1]);
		ctx.quadraticCurveTo(cp[2 * n - 10], cp[2 * n - 9], pts[n - 4], pts[n - 3]);
		ctx.stroke();
		ctx.closePath()
	}
	ctx.restore()
}
