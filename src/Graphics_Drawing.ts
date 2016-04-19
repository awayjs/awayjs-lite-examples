/*

 AWD3 file loading example in AwayJS

 Demonstrates:

 How to use the Loader object to load an embedded internal awd model.

 Code by Rob Bateman
 rob@infiniteturtles.co.uk
 http://www.infiniteturtles.co.uk

 This code is distributed under the MIT License

 Copyright (c) The Away Foundation http://www.theawayfoundation.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the “Software”), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.

 */
import {RequestAnimationFrame}		from "awayjs-lite/lib/utils";
import {Graphics}					from "awayjs-lite/lib/graphics";
import {View}						from "awayjs-lite";
import {Sprite}						from "awayjs-lite/lib/display";
import {HoverController}			from "awayjs-lite/lib/controllers";

import {DefaultRenderer}			from "awayjs-lite";

import {CoordinateSystem}			from "awayjs-lite/lib/projections";
import {PerspectiveProjection}		from "awayjs-lite/lib/projections";
import {MouseEvent}					from "awayjs-lite/lib/events";
import {ColorTransform} 			from "awayjs-lite/lib/geom";

import {GraphicsFactoryHelper}		from "awayjs-lite/lib/draw";
import {CapsStyle}  				from "awayjs-lite/lib/draw";
import {JointStyle}  				from "awayjs-lite/lib/draw";

var _timer:RequestAnimationFrame;
var _time:number = 0;

//navigation
var _lastPanAngle:number;
var _lastTiltAngle:number;
var _lastMouseX:number;
var _lastMouseY:number;
var _move:boolean;

/**
 * Initialise the engine
 */
var _renderer:DefaultRenderer = new DefaultRenderer();
_renderer.renderableSorter = null;//new RenderableSort2D();

var _view:View = new View(_renderer);
_view.backgroundColor = 0x777777;

var _stage_width:number = 550;
var _stage_height:number = 400;

var _isperspective:boolean = true;

var _projection:PerspectiveProjection = new PerspectiveProjection();
_projection.coordinateSystem = CoordinateSystem.RIGHT_HANDED;
_projection.fieldOfView = 30;
_projection.originX = 0;
_projection.originY = 0;
//_projection.far = 500000;
_view.camera.projection = _projection;

var _hoverControl:HoverController = new HoverController(_view.camera, null, 180, 0, 1000);

/**
 * Initialise the scene objects
 */
// Graphics is not wired into any Displayobjects yet.
// to have it produce geometry, for now we have to pass it a sprite when constructing it
var drawingMC:Sprite = new Sprite();

var _activePoint:Sprite = null;
// for now i did not find a way to activate this other than doing it in js (not in ts)
// so for this example to work, after packaging the example, one have to go into the js file and activate follwing line:

GraphicsFactoryHelper._tess_obj= null;//new TESS();
_view.scene.addChild(drawingMC );

var _points:Array<Sprite> = new Array<Sprite>();

if (GraphicsFactoryHelper._tess_obj) GraphicsFactoryHelper._tess_obj.newTess();
var thisCircleGraphic:Graphics=new Graphics();
thisCircleGraphic.beginFill(0xFF0000, 1);
thisCircleGraphic.drawCircle(0,0,30);
thisCircleGraphic.endFill();

if (GraphicsFactoryHelper._tess_obj) GraphicsFactoryHelper._tess_obj.deleteTess();

if (GraphicsFactoryHelper._tess_obj) GraphicsFactoryHelper._tess_obj.newTess();

var thisCircleGraphicsmall:Graphics = new Graphics();
thisCircleGraphicsmall.beginFill(0xFF0000, 1);
thisCircleGraphicsmall.drawCircle(0, 0, 10);
thisCircleGraphicsmall.endFill();

if (GraphicsFactoryHelper._tess_obj) GraphicsFactoryHelper._tess_obj.deleteTess();

var batman_logo:Array<Array<any> >=[];
var cnt=0;
batman_logo[cnt++]=["l", 50, 50];
batman_logo[cnt++]=["l", 290, 50];
batman_logo[cnt++]=["c1", 290, 150];
batman_logo[cnt++]=["c2", 450, 150];
batman_logo[cnt++]=["l", 460, 60];
batman_logo[cnt++]=["l", 470, 100];
batman_logo[cnt++]=["l", 530, 100];
batman_logo[cnt++]=["l", 540, 60];
batman_logo[cnt++]=["l", 550, 150];
batman_logo[cnt++]=["c1", 710, 150];
batman_logo[cnt++]=["c2", 710, 50];
batman_logo[cnt++]=["l", 950, 50];
batman_logo[cnt++]=["c1", 800, 120];
batman_logo[cnt++]=["c2", 825, 250];
batman_logo[cnt++]=["c1", 630, 280];
batman_logo[cnt++]=["c2", 500, 450];
batman_logo[cnt++]=["c1", 370, 280];
batman_logo[cnt++]=["c2", 175, 250];
batman_logo[cnt++]=["c1", 200, 120];
var i = 0;
for (i = 0; i < batman_logo.length; i++) {
	_points[i] = new Sprite();
	_points[i].name=batman_logo[i][0];
	_points[i].x = batman_logo[i][1];
	_points[i].y = batman_logo[i][2];

}
draw_shape();
for (i = 0; i <  batman_logo.length; i++) {
	var thisshape=thisCircleGraphic;
	if(_points[i].name=="c1"){
		thisshape=thisCircleGraphicsmall;
	}
	_points[i].graphics.copyFrom(thisshape);
	_points[i].visible=false;
	_view.scene.addChild(_points[i]);
	_points[i].addEventListener(MouseEvent.MOUSE_DOWN, (event:MouseEvent) => onPointDown(event));
}

_view.scene.addEventListener(MouseEvent.MOUSE_MOVE, (event:MouseEvent) => onMouseMove(event));
document.onmouseup = (event) => onMouseUp(event);


/**
 * Initialise the listeners
 */
window.onresize  = (event) => onResize(event);
onResize();

_timer = new RequestAnimationFrame(onEnterFrame, this);
_timer.start();

draw_shape();

function onPointDown(event:MouseEvent):void{
	_activePoint = (<Sprite> event.target);
	_activePoint.x=event.scenePosition.x;
	_activePoint.y=event.scenePosition.y;
}
function onMouseUp(event):void{
	_activePoint = null;
	//draw_shape();
}
function onMouseMove(event:MouseEvent):void{
	if (_activePoint){
		_activePoint.x=event.scenePosition.x;
		_activePoint.y=event.scenePosition.y;
	}
}

function draw_shape():void{

	drawingMC.graphics.clear();

	if (GraphicsFactoryHelper._tess_obj) GraphicsFactoryHelper._tess_obj.newTess();

	drawingMC.graphics.beginFill(0xFF0000, 1);
	drawingMC.graphics.lineStyle(5, 0xFF0000, 1, false, null, CapsStyle.ROUND, JointStyle.MITER, 1.8);
	drawingMC.graphics.moveTo(_points[0].x, _points[0].y);
	var i = 1;
	var tmpspite:Sprite=null;
	for (i = 1; i < _points.length; i++) {
		if(_points[i].name=="c1"){
			tmpspite=_points[i];
		}
		else if (_points[i].name=="c2"){
			drawingMC.graphics.curveTo(tmpspite.x, tmpspite.y, _points[i].x, _points[i].y);
			tmpspite=null;
		}
		else if (_points[i].name=="l") {
			drawingMC.graphics.lineTo(_points[i].x, _points[i].y);
			tmpspite=null;
		}
	}
	if(tmpspite){
		drawingMC.graphics.curveTo(tmpspite.x, tmpspite.y, _points[0].x, _points[0].y);
	} else {
		drawingMC.graphics.lineTo(_points[0].x, _points[0].y);
	}
	drawingMC.graphics.endFill();
	if (GraphicsFactoryHelper._tess_obj) GraphicsFactoryHelper._tess_obj.deleteTess();

	var new_ct:ColorTransform = drawingMC.transform.colorTransform || (drawingMC.transform.colorTransform = new ColorTransform());
	new_ct.redMultiplier = 1;
	new_ct.greenMultiplier = 1;
	new_ct.blueMultiplier = 0;
	new_ct.alphaMultiplier = 1;

	drawingMC.transform.invalidateColorTransform();
}

/**
 * Render loop
 */
function onEnterFrame(dt:number)
{
	_time += dt;

	//update camera controler
	// _cameraController.update();

	//console.log("RENDER = ");
	//update view
	_view.render();
}


function onResize(event = null)
{
	_view.y         = 0;
	_view.x         = 0;
	_view.width     = window.innerWidth;
	_view.height    = window.innerHeight;
}