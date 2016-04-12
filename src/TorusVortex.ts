import {BlendMode}					from "awayjs-lite/lib/image";
import {Vector3D}					from "awayjs-lite/lib/geom";
import {URLLoader}					from "awayjs-lite/lib/net";
import {URLLoaderDataFormat}		from "awayjs-lite/lib/net";
import {URLRequest}					from "awayjs-lite/lib/net";
import {URLLoaderEvent}				from "awayjs-lite/lib/events";
import {ParserUtils}				from "awayjs-lite/lib/parsers";
import {PerspectiveProjection}		from "awayjs-lite/lib/projections";
import {RequestAnimationFrame}		from "awayjs-lite/lib/utils";

import {View, DefaultRenderer}		from "awayjs-lite";
import {DisplayObject}			from "awayjs-lite/lib/display";
import {ElementsType}				from "awayjs-lite/lib/graphics";
import {BasicMaterial}				from "awayjs-lite/lib/materials";
import {PrimitiveCubePrefab}		from "awayjs-lite/lib/prefabs";
import {PrimitiveTorusPrefab}		from "awayjs-lite/lib/prefabs";
import {Single2DTexture}			from "awayjs-lite/lib/textures";

//setup the view
var _view:View = new View(new DefaultRenderer());
_view.backgroundColor = 0x000000;

//setup the camera
var _cameraAxis = new Vector3D(0, 0, 1);
_view.camera.x = 130;
_view.camera.y = 0;
_view.camera.z = 0;
_view.camera.projection = new PerspectiveProjection(120);
_view.camera.projection.near = 0.1;

//setup the scene
var _image:HTMLImageElement;
var _cubeSprite:DisplayObject;
var _torusSprite:DisplayObject;

//setup the resize handler
window.onresize  = (event:UIEvent) => onResize(event);
onResize();

//setup the tick for frame update
var _timer:RequestAnimationFrame = new RequestAnimationFrame(onEnterFrame, this);
_timer.start();

//load assets
var urlRequest:URLRequest = new URLRequest("assets/130909wall_big.png");
var urlLoader:URLLoader = new URLLoader();
urlLoader.dataFormat = URLLoaderDataFormat.BLOB;
urlLoader.addEventListener(URLLoaderEvent.LOAD_COMPLETE, (event:URLLoaderEvent) => onURLLoaderComplete(event));
urlLoader.load(urlRequest);


/**
 * Listener function for load complete event on urlloader
 */
function onURLLoaderComplete(event:URLLoaderEvent)
{
	var imageLoader:URLLoader = <URLLoader> event.target;
	_image = ParserUtils.blobToImage(imageLoader.data);
	_image.onload = (event:Event) => onImageComplete(event);
}

/**
 * Listener function for load complete event on image
 */
function onImageComplete(event:Event)
{
	var mat:BasicMaterial = new BasicMaterial(ParserUtils.imageToBitmapImage2D(_image));

	mat.blendMode = BlendMode.ADD;
	mat.bothSides = true;

	_cubeSprite = (new PrimitiveCubePrefab(mat, ElementsType.TRIANGLE, 20.0, 20.0, 20.0)).getNewObject();
	_torusSprite = (new PrimitiveTorusPrefab(mat, ElementsType.TRIANGLE, 150, 80, 32, 16, true)).getNewObject();

	_cubeSprite.x = 130;
	_cubeSprite.z = 40;

	_view.scene.addChild(_cubeSprite);
	_view.scene.addChild(_torusSprite);
}

/**
 * render loop
 */
function onEnterFrame(dt:number)
{
	_view.camera.transform.rotate(_cameraAxis, 1);
	if (_torusSprite) {
		_torusSprite.rotationY += 1;
	}
	
	if (_cubeSprite) {
		_cubeSprite.rotationX += 0.4;
		_cubeSprite.rotationY += 0.4;
	}
	
	_view.render();
}

/**
 * stage listener for resize events
 */
function onResize(event:UIEvent = null)
{
	_view.y = 0;
	_view.x = 0;

	_view.width = window.innerWidth;
	_view.height = window.innerHeight;
}