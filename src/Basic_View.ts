/*

Basic 3D scene example in Away3D

Demonstrates:

How to setup a view and add 3D objects.
How to apply materials to a 3D object and dynamically load textures
How to create a frame tick that updates the contents of the scene

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

import {Image2D} 						from "awayjs-lite/lib/image";
import {LoaderEvent}					from "awayjs-lite/lib/events";
import {Vector3D}						from "awayjs-lite/lib/geom";
import {AssetLibrary, IAsset}			from "awayjs-lite/lib/library";
import {URLRequest}						from "awayjs-lite/lib/net";
import {RequestAnimationFrame}			from "awayjs-lite/lib/utils";

import {View, DefaultRenderer}			from "awayjs-lite";
import {Sprite}							from "awayjs-lite/lib/display";
import {PrimitivePlanePrefab}			from "awayjs-lite/lib/prefabs";
import {Single2DTexture}				from "awayjs-lite/lib/textures";

import {BasicMaterial}					from "awayjs-lite/lib/materials";
import {ElementsType}					from "awayjs-lite/lib/graphics";

//setup the view
var _view:View = new View(new DefaultRenderer());

//setup the camera
_view.camera.z = -600;
_view.camera.y = 500;
_view.camera.lookAt(new Vector3D());

//setup the materials
var _planeMaterial:BasicMaterial = new BasicMaterial();

//setup the scene
var _plane:Sprite = <Sprite> new PrimitivePlanePrefab(_planeMaterial, ElementsType.TRIANGLE, 700, 700).getNewObject();
_view.scene.addChild(_plane);

//setup the resize handler
window.onresize  = (event:UIEvent) => onResize(event);
onResize();

//setup the tick for frame update
var _timer:RequestAnimationFrame = new RequestAnimationFrame(onEnterFrame, this);
_timer.start();

//load assets
AssetLibrary.addEventListener(LoaderEvent.LOAD_COMPLETE, (event:LoaderEvent) => onResourceComplete(event));
AssetLibrary.load(new URLRequest("assets/floor_diffuse.jpg"));

/**
 * render loop
 */
function onEnterFrame(dt:number)
{
	_plane.rotationY += 2;

	_view.render();
}

/**
 * Listener function for resource complete event on asset library
 */
function onResourceComplete (event:LoaderEvent)
{
	var assets:Array<IAsset> = event.assets;
	var length:number = assets.length;

	for (var c:number = 0; c < length; c++) {
		var asset:IAsset = assets[c];

		console.log(asset.name, event.url);

		switch (event.url) {
			//plane textures
			case "assets/floor_diffuse.jpg" :
				_planeMaterial.texture = new Single2DTexture(<Image2D> asset);
				break;
		}
	}
}

/**
 * stage listener for resize events
 */
function onResize(event:UIEvent = null):void
{
	_view.y = 0;
	_view.x = 0;
	_view.width = window.innerWidth;
	_view.height = window.innerHeight;
}