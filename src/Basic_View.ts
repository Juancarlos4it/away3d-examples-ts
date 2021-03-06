///<reference path="../libs/Away3D.next.d.ts" />

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

module examples
{
    export class Basic_View
    {
        //engine variables
        private _view:away.containers.View;

        //material objects
        private _planeMaterial:away.materials.TextureMaterial;

        //scene objects
        private _plane:away.entities.Mesh;

        //tick for frame update
        private _timer:away.utils.RequestAnimationFrame;

        /**
         * Constructor
         */
        constructor()
        {
            //setup the view
            this._view = new away.containers.View(new away.render.DefaultRenderer());

            //setup the camera
            this._view.camera.z = -600;
            this._view.camera.y = 500;
            this._view.camera.lookAt(new away.geom.Vector3D());

            //setup the materials
            this._planeMaterial = new away.materials.TextureMaterial();

            //setup the scene
            this._plane = new away.entities.Mesh(new away.primitives.PlaneGeometry(700, 700), this._planeMaterial);
            this._view.scene.addChild(this._plane);

            //setup the render loop
            window.onresize  = (event) => this.onResize(event);

            this.onResize();

            this._timer = new away.utils.RequestAnimationFrame(this.onEnterFrame, this);
            this._timer.start();

            away.library.AssetLibrary.addEventListener(away.events.LoaderEvent.RESOURCE_COMPLETE, (event:away.events.LoaderEvent) => this.onResourceComplete(event));

            //plane textures
            away.library.AssetLibrary.load(new away.net.URLRequest("assets/floor_diffuse.jpg"));
        }

        /**
         * render loop
         */
        private onEnterFrame(dt:number):void
        {
            this._plane.rotationY += 1;

            this._view.render();
        }

        /**
         * Listener function for resource complete event on asset library
         */
        private onResourceComplete (event:away.events.LoaderEvent)
        {
            var assets:away.library.IAsset[] = event.assets;
            var length:number = assets.length;

            for ( var c : number = 0 ; c < length ; c ++ )
            {
                var asset:away.library.IAsset = assets[c];

                console.log(asset.name, event.url);

                switch (event.url)
                {
                    //plane textures
                    case "assets/floor_diffuse.jpg" :
                        this._planeMaterial.texture = <away.textures.Texture2DBase> away.library.AssetLibrary.getAsset(asset.name);
                        break;
                }
            }
        }

        /**
         * stage listener for resize events
         */
        private onResize(event:Event = null):void
        {
            this._view.y         = 0;
            this._view.x         = 0;
            this._view.width     = window.innerWidth;
            this._view.height    = window.innerHeight;
        }
    }
}


window.onload = function ()
{
    new examples.Basic_View();
}