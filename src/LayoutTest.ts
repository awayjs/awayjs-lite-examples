import {Image2D}					from "awayjs-lite/lib/image";
import {AssetLibrary}				from "awayjs-lite/lib/library";
import {URLRequest}					from "awayjs-lite/lib/net";
import {LoaderEvent, MouseEvent}	from "awayjs-lite/lib/events";
import {CoordinateSystem}			from "awayjs-lite/lib/projections";
import {PerspectiveProjection}		from "awayjs-lite/lib/projections";
import {RequestAnimationFrame}		from "awayjs-lite/lib/utils";

import {View, DefaultRenderer}		from "awayjs-lite";
import {HoverController}			from "awayjs-lite/lib/controllers";
import {Billboard}					from "awayjs-lite/lib/display";
import {BasicMaterial}				from "awayjs-lite/lib/materials";
import {Single2DTexture}			from "awayjs-lite/lib/textures";

var _view:View;
var _projection:PerspectiveProjection;
var _timer:RequestAnimationFrame;
var _hoverControl:HoverController;

var _move:boolean = false;
var _lastPanAngle:number;
var _lastTiltAngle:number;
var _lastMouseX:number;
var _lastMouseY:number;

var _texture:Single2DTexture;
var _bitmapMaterial:BasicMaterial;
var _billboards:Array<Billboard> = new Array<Billboard>();

//listen for a resource complete event
AssetLibrary.addEventListener(LoaderEvent.LOAD_COMPLETE , (event:LoaderEvent) => onLoadComplete(event));

//load an image
AssetLibrary.load(new URLRequest('assets/256x256.png') );

/**
 * Listener for load complete event
 *
 * @param event
 */
function onLoadComplete(event:LoaderEvent)
{
	//create the view
	_view = new View(new DefaultRenderer());

	_projection = <PerspectiveProjection> _view.camera.projection;
	_projection.coordinateSystem = CoordinateSystem.RIGHT_HANDED;
	_projection.focalLength = 1000;
	_projection.preserveFocalLength = true;
	_projection.originX = 0;
	_projection.originY = 0;

	//create a bitmap material
	_bitmapMaterial = new BasicMaterial(<Image2D> event.assets[0]);

	var billboard:Billboard;
	var numHBillboards:number = 2;
	var numVBillboards:number = 2;
	for (var i:number = 0; i < numHBillboards; i++) {
		for (var j:number = 0; j < numVBillboards; j++) {
			billboard = new Billboard(_bitmapMaterial);
			//billboard.width = 50;
			//billboard.height = 50;
			//billboard.pivot = new Vector3D(billboard.billboardWidth/2, billboard.billboardHeight/2, 0);
			billboard.x = j*300;
			billboard.y = i*300;
			billboard.z = 0;
			billboard.addEventListener(MouseEvent.MOUSE_MOVE, onMouseEvent);
			//billboard.orientationMode = away.base.OrientationMode.CAMERA_PLANE;
			//billboard.alignmentMode = away.base.AlignmentMode.PIVOT_POINT;
			_billboards.push(billboard);
			//add billboard to the scene
			_view.scene.addChild(billboard);
		}
	}

	_hoverControl = new HoverController(_view.camera, null, 180, 0, 1000);

	document.onmousedown = (event) => onMouseDownHandler(event);
	document.onmouseup = (event) => onMouseUpHandler(event);
	document.onmousemove = (event) => onMouseMove(event);

	window.onresize  = (event:UIEvent) => onResize(event);

	//trigger an initial resize for the view
	onResize(null);

	//setup the RAF for a render listener
	_timer = new RequestAnimationFrame(render, this);
	_timer.start();
}

function onMouseEvent(event:MouseEvent)
{
	console.log(event);
}

function onResize(event:UIEvent)
{
	_view.x = 0;
	_view.y = 0;
	_view.width = window.innerWidth;
	_view.height = window.innerHeight;
}

function render(dt:number)
{
	_view.render();
}

function onMouseUpHandler(event)
{
	_move = false;
}

function onMouseMove(event)
{
	if (_move) {
		_hoverControl.panAngle = 0.3*(event.clientX - _lastMouseX) + _lastPanAngle;
		_hoverControl.tiltAngle = -0.3*(event.clientY - _lastMouseY) + _lastTiltAngle;
	}
}

function onMouseDownHandler(event)
{
	_lastPanAngle = _hoverControl.panAngle;
	_lastTiltAngle = _hoverControl.tiltAngle;
	_lastMouseX = event.clientX;
	_lastMouseY = event.clientY;
	_move = true;
}