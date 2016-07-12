(function (console, $hx_exports) { "use strict";
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var AudioManager = function() {
	this.bufferList = new haxe_ds_StringMap();
	this.types = new haxe_ds_StringMap();
	this.types.set("mp3","audio/mpeg");
	this.types.set("ogg","audio/ogg");
	this.types.set("wav","audio/wav");
	this.types.set("aac","audio/aac");
	this.types.set("m4a","audio/x-m4a");
};
AudioManager.__name__ = true;
AudioManager.prototype = {
	checkWebAudioAPISupport: function() {
		if(Reflect.field(window,"AudioContext") != null) {
			AudioManager.AudioContextClass = Reflect.field(window,"AudioContext");
			return true;
		} else if(Reflect.field(window,"webkitAudioContext") != null) {
			AudioManager.AudioContextClass = Reflect.field(window,"webkitAudioContext");
			return true;
		}
		return false;
	}
	,unlockAudio: function() {
		if(this.audioContext != null) {
			var bfr = this.audioContext.createBuffer(1,1,Waud.preferredSampleRate);
			var src = this.audioContext.createBufferSource();
			src.buffer = bfr;
			src.connect(this.audioContext.destination);
			if(Reflect.field(src,"start") != null) src.start(0); else src.noteOn(0);
			if(src.onended != null) src.onended = $bind(this,this._unlockCallback); else haxe_Timer.delay($bind(this,this._unlockCallback),1);
		} else {
			var audio;
			var _this = window.document;
			audio = _this.createElement("audio");
			var source;
			var _this1 = window.document;
			source = _this1.createElement("source");
			source.src = "data:audio/wave;base64,UklGRjIAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAAABmYWN0BAAAAAAAAABkYXRhAAAAAA==";
			audio.appendChild(source);
			window.document.appendChild(audio);
			audio.play();
			if(Waud.__touchUnlockCallback != null) Waud.__touchUnlockCallback();
			Waud.dom.ontouchend = null;
		}
	}
	,_unlockCallback: function() {
		if(Waud.__touchUnlockCallback != null) Waud.__touchUnlockCallback();
		Waud.dom.ontouchend = null;
	}
	,createAudioContext: function() {
		if(this.audioContext == null) try {
			if(AudioManager.AudioContextClass != null) this.audioContext = Type.createInstance(AudioManager.AudioContextClass,[]);
		} catch( e ) {
			if (e instanceof js__$Boot_HaxeError) e = e.val;
			this.audioContext = null;
		}
		return this.audioContext;
	}
	,destroy: function() {
		if(this.audioContext != null && (this.audioContext.close != null && this.audioContext.close != "")) this.audioContext.close();
		this.audioContext = null;
		this.bufferList = null;
		this.types = null;
	}
};
var BaseSound = function(sndUrl,options) {
	if(sndUrl == null || sndUrl == "") {
		console.log("invalid sound url");
		return;
	}
	if(Waud.audioManager == null) {
		console.log("initialise Waud using Waud.init() before loading sounds");
		return;
	}
	this.duration = 0;
	this.isSpriteSound = false;
	this.url = sndUrl;
	this._isLoaded = false;
	this._isPlaying = false;
	this._muted = false;
	if(options == null) options = { };
	if(options.autoplay != null) options.autoplay = options.autoplay; else options.autoplay = Waud.defaults.autoplay;
	if(options.webaudio != null) options.webaudio = options.webaudio; else options.webaudio = Waud.defaults.webaudio;
	if(options.preload != null) options.preload = options.preload; else options.preload = Waud.defaults.preload;
	if(options.loop != null) options.loop = options.loop; else options.loop = Waud.defaults.loop;
	if(options.volume != null && options.volume >= 0 && options.volume <= 1) options.volume = options.volume; else options.volume = Waud.defaults.volume;
	if(options.onload != null) options.onload = options.onload; else options.onload = Waud.defaults.onload;
	if(options.onend != null) options.onend = options.onend; else options.onend = Waud.defaults.onend;
	if(options.onerror != null) options.onerror = options.onerror; else options.onerror = Waud.defaults.onerror;
	this._options = options;
};
BaseSound.__name__ = true;
BaseSound.prototype = {
	get_duration: function() {
		return 0;
	}
};
var Button = function(label,width,height,data,fontSize) {
	PIXI.Container.call(this);
	this.action = new msignal_Signal1(Dynamic);
	this._data = data;
	this._setupBackground(width,height);
	this._setupLabel(width,height,fontSize);
	this._label.text = label;
};
Button.__name__ = true;
Button.__super__ = PIXI.Container;
Button.prototype = $extend(PIXI.Container.prototype,{
	_setupBackground: function(width,height) {
		this._rect = new PIXI.Rectangle(0,0,width,height);
		this._background = new PIXI.Graphics();
		this._background.interactive = true;
		this._redraw(3040510);
		this.addChild(this._background);
		this._background.interactive = true;
		this._background.on("mouseover",$bind(this,this._onMouseOver));
		this._background.on("mouseout",$bind(this,this._onMouseOut));
		this._background.on("mousedown",$bind(this,this._onMouseDown));
		this._background.on("mouseup",$bind(this,this._onMouseUp));
		this._background.on("mouseupoutside",$bind(this,this._onMouseUpOutside));
		this._background.on("touchstart",$bind(this,this._onTouchStart));
		this._background.on("touchend",$bind(this,this._onTouchEnd));
		this._background.on("touchendoutside",$bind(this,this._onTouchEndOutside));
	}
	,_setupLabel: function(width,height,fontSize) {
		var size;
		if(fontSize != null) size = fontSize; else size = 12;
		var style = { };
		style.font = size + "px Arial";
		style.fill = "#FFFFFF";
		this._label = new PIXI.Text("",style);
		this._label.anchor.set(0.5);
		this._label.x = width / 2;
		this._label.y = height / 2;
		this.addChild(this._label);
	}
	,_redraw: function(colour) {
		var border = 1;
		this._background.clear();
		this._background.beginFill(13158);
		this._background.drawRect(this._rect.x,this._rect.y,this._rect.width,this._rect.height);
		this._background.endFill();
		this._background.beginFill(colour);
		this._background.drawRect(this._rect.x + border / 2,this._rect.y + border / 2,this._rect.width - border,this._rect.height - border);
		this._background.endFill();
	}
	,_onMouseDown: function(target) {
		if(this._enabled) this._redraw(14644225);
	}
	,_onMouseUp: function(target) {
		if(this._enabled) {
			this.action.dispatch(this._data);
			this._redraw(3040510);
		}
	}
	,_onMouseUpOutside: function(target) {
		if(this._enabled) this._redraw(3040510);
	}
	,_onMouseOver: function(target) {
		if(this._enabled) this._redraw(14644225);
	}
	,_onMouseOut: function(target) {
		if(this._enabled) this._redraw(3040510);
	}
	,_onTouchEndOutside: function(target) {
		if(this._enabled) this._redraw(3040510);
	}
	,_onTouchEnd: function(target) {
		if(this._enabled) {
			this._redraw(3040510);
			this.action.dispatch(this._data);
		}
	}
	,_onTouchStart: function(target) {
		if(this._enabled) this._redraw(14644225);
	}
});
var EReg = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
EReg.__name__ = true;
EReg.prototype = {
	match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,matched: function(n) {
		if(this.r.m != null && n >= 0 && n < this.r.m.length) return this.r.m[n]; else throw new js__$Boot_HaxeError("EReg::matched");
	}
};
var IWaudSound = function() { };
IWaudSound.__name__ = true;
var HTML5Sound = function(url,options,src) {
	BaseSound.call(this,url,options);
	this._snd = Waud.dom.createElement("audio");
	if(src == null) this._addSource(url); else this._snd.appendChild(src);
	if(this._options.preload) this.load();
};
HTML5Sound.__name__ = true;
HTML5Sound.__interfaces__ = [IWaudSound];
HTML5Sound.__super__ = BaseSound;
HTML5Sound.prototype = $extend(BaseSound.prototype,{
	load: function(callback) {
		var _g = this;
		if(!this._isLoaded) {
			this._snd.autoplay = this._options.autoplay;
			this._snd.loop = this._options.loop;
			this._snd.volume = this._options.volume;
			if(callback != null) this._options.onload = callback;
			if(this._options.preload) this._snd.preload = "auto"; else this._snd.preload = "metadata";
			if(this._options.onload != null) {
				this._isLoaded = true;
				this._snd.onloadeddata = function() {
					_g._options.onload(_g);
				};
			}
			this._snd.onplaying = function() {
				_g._isPlaying = true;
			};
			this._snd.onended = function() {
				_g._isPlaying = false;
				if(_g._options.onend != null) _g._options.onend(_g);
			};
			if(this._options.onerror != null) this._snd.onerror = function() {
				_g._options.onerror(_g);
			};
			this._snd.load();
		}
		return this;
	}
	,get_duration: function() {
		if(!this._isLoaded) return 0;
		return this.duration = this._snd.duration;
	}
	,_addSource: function(url) {
		this._src = Waud.dom.createElement("source");
		this._src.src = url;
		if((function($this) {
			var $r;
			var key = $this._getExt(url);
			$r = Waud.audioManager.types.get(key);
			return $r;
		}(this)) != null) {
			var key1 = this._getExt(url);
			this._src.type = Waud.audioManager.types.get(key1);
		}
		this._snd.appendChild(this._src);
		return this._src;
	}
	,_getExt: function(filename) {
		return filename.split(".").pop();
	}
	,setVolume: function(val,spriteName) {
		if(val >= 0 && val <= 1) this._options.volume = val;
		if(!this._isLoaded) return;
		this._snd.volume = this._options.volume;
	}
	,getVolume: function(spriteName) {
		return this._options.volume;
	}
	,mute: function(val,spriteName) {
		if(!this._isLoaded) return;
		this._snd.muted = val;
		if(WaudUtils.isiOS()) {
			if(val && this.isPlaying()) {
				this._muted = true;
				this._snd.pause();
			} else if(this._muted) {
				this._muted = false;
				this._snd.play();
			}
		}
	}
	,toggleMute: function(spriteName) {
		this.mute(!this._muted);
	}
	,play: function(spriteName,soundProps) {
		var _g = this;
		if(!this._isLoaded || this._snd == null) {
			console.log("sound not loaded");
			return -1;
		}
		if(this._isPlaying) this.stop(spriteName);
		if(this._muted) return -1;
		if(this.isSpriteSound && soundProps != null) {
			if(this._pauseTime == null) this._snd.currentTime = soundProps.start; else this._snd.currentTime = this._pauseTime;
			if(this._tmr != null) this._tmr.stop();
			this._tmr = haxe_Timer.delay(function() {
				if(soundProps.loop != null && soundProps.loop) _g.play(spriteName,soundProps); else _g.stop(spriteName);
			},Math.ceil(soundProps.duration * 1000));
		}
		haxe_Timer.delay(($_=this._snd,$bind($_,$_.play)),100);
		this._pauseTime = null;
		return 0;
	}
	,togglePlay: function(spriteName) {
		if(this._isPlaying) this.pause(); else this.play();
	}
	,isPlaying: function(spriteName) {
		return this._isPlaying;
	}
	,loop: function(val) {
		if(!this._isLoaded || this._snd == null) return;
		this._snd.loop = val;
	}
	,stop: function(spriteName) {
		if(!this._isLoaded || this._snd == null) return;
		this._snd.currentTime = 0;
		this._snd.pause();
		this._isPlaying = false;
		if(this._tmr != null) this._tmr.stop();
	}
	,pause: function(spriteName) {
		if(!this._isLoaded || this._snd == null) return;
		this._snd.pause();
		this._pauseTime = this._snd.currentTime;
		this._isPlaying = false;
		if(this._tmr != null) this._tmr.stop();
	}
	,setTime: function(time) {
		if(!this._isLoaded || this._snd == null || time > this._snd.duration) return;
		this._snd.currentTime = time;
	}
	,getTime: function() {
		if(this._snd == null || !this._isLoaded || !this._isPlaying) return 0;
		return this._snd.currentTime;
	}
	,onEnd: function(callback,spriteName) {
		this._options.onend = callback;
		return this;
	}
	,onLoad: function(callback) {
		this._options.onload = callback;
		return this;
	}
	,onError: function(callback) {
		this._options.onerror = callback;
		return this;
	}
	,destroy: function() {
		if(this._snd != null) {
			this._snd.pause();
			this._snd.removeChild(this._src);
			this._src = null;
			this._snd = null;
		}
		this._isPlaying = false;
	}
});
var HxOverrides = function() { };
HxOverrides.__name__ = true;
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
};
HxOverrides.indexOf = function(a,obj,i) {
	var len = a.length;
	if(i < 0) {
		i += len;
		if(i < 0) i = 0;
	}
	while(i < len) {
		if(a[i] === obj) return i;
		i++;
	}
	return -1;
};
Math.__name__ = true;
var Reflect = function() { };
Reflect.__name__ = true;
Reflect.field = function(o,field) {
	try {
		return o[field];
	} catch( e ) {
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		return null;
	}
};
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
};
Reflect.compareMethods = function(f1,f2) {
	if(f1 == f2) return true;
	if(!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) return false;
	return f1.scope == f2.scope && f1.method == f2.method && f1.method != null;
};
var pixi_plugins_app_Application = function() {
	this._animationFrameId = null;
	this.pixelRatio = 1;
	this.set_skipFrame(false);
	this.autoResize = true;
	this.transparent = false;
	this.antialias = false;
	this.forceFXAA = false;
	this.roundPixels = false;
	this.clearBeforeRender = true;
	this.preserveDrawingBuffer = false;
	this.backgroundColor = 16777215;
	this.width = window.innerWidth;
	this.height = window.innerHeight;
	this.set_fps(60);
};
pixi_plugins_app_Application.__name__ = true;
pixi_plugins_app_Application.prototype = {
	set_fps: function(val) {
		this._frameCount = 0;
		return val >= 1 && val < 60?this.fps = val | 0:this.fps = 60;
	}
	,set_skipFrame: function(val) {
		if(val) {
			console.log("pixi.plugins.app.Application > Deprecated: skipFrame - use fps property and set it to 30 instead");
			this.set_fps(30);
		}
		return this.skipFrame = val;
	}
	,start: function(rendererType,parentDom,canvasElement) {
		if(rendererType == null) rendererType = "auto";
		if(canvasElement == null) {
			var _this = window.document;
			this.canvas = _this.createElement("canvas");
			this.canvas.style.width = this.width + "px";
			this.canvas.style.height = this.height + "px";
			this.canvas.style.position = "absolute";
		} else this.canvas = canvasElement;
		if(parentDom == null) window.document.body.appendChild(this.canvas); else parentDom.appendChild(this.canvas);
		this.stage = new PIXI.Container();
		var renderingOptions = { };
		renderingOptions.view = this.canvas;
		renderingOptions.backgroundColor = this.backgroundColor;
		renderingOptions.resolution = this.pixelRatio;
		renderingOptions.antialias = this.antialias;
		renderingOptions.forceFXAA = this.forceFXAA;
		renderingOptions.autoResize = this.autoResize;
		renderingOptions.transparent = this.transparent;
		renderingOptions.clearBeforeRender = this.clearBeforeRender;
		renderingOptions.preserveDrawingBuffer = this.preserveDrawingBuffer;
		if(rendererType == "auto") this.renderer = PIXI.autoDetectRenderer(this.width,this.height,renderingOptions); else if(rendererType == "canvas") this.renderer = new PIXI.CanvasRenderer(this.width,this.height,renderingOptions); else this.renderer = new PIXI.WebGLRenderer(this.width,this.height,renderingOptions);
		if(this.roundPixels) this.renderer.roundPixels = true;
		if(parentDom == null) window.document.body.appendChild(this.renderer.view); else parentDom.appendChild(this.renderer.view);
		this.resumeRendering();
	}
	,resumeRendering: function() {
		if(this.autoResize) window.onresize = $bind(this,this._onWindowResize);
		if(this._animationFrameId == null) this._animationFrameId = window.requestAnimationFrame($bind(this,this._onRequestAnimationFrame));
	}
	,_onWindowResize: function(event) {
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		this.renderer.resize(this.width,this.height);
		this.canvas.style.width = this.width + "px";
		this.canvas.style.height = this.height + "px";
		if(this.onResize != null) this.onResize();
	}
	,_onRequestAnimationFrame: function(elapsedTime) {
		this._frameCount++;
		if(this._frameCount == (60 / this.fps | 0)) {
			this._frameCount = 0;
			if(this.onUpdate != null) this.onUpdate(elapsedTime);
			this.renderer.render(this.stage);
		}
		this._animationFrameId = window.requestAnimationFrame($bind(this,this._onRequestAnimationFrame));
	}
};
var Sample2 = function() {
	var _g = this;
	pixi_plugins_app_Application.call(this);
	PIXI.RESOLUTION = this.pixelRatio = window.devicePixelRatio;
	this.autoResize = true;
	this.backgroundColor = 6227124;
	this.roundPixels = true;
	this.onResize = $bind(this,this._resize);
	pixi_plugins_app_Application.prototype.start.call(this);
	this._btnContainer = new PIXI.Container();
	this.stage.addChild(this._btnContainer);
	this._duration = new PIXI.Text("Duration: ",{ font : "20px Tahoma", fill : "#FFFFFF"});
	this._btnContainer.addChild(this._duration);
	this._time = new PIXI.Text("Time: ",{ font : "20px Tahoma", fill : "#FFFFFF"});
	this._time.y = 50;
	this._btnContainer.addChild(this._time);
	this._addButton("Play",0,100,80,30,function() {
		_g._snd.play();
	});
	this._addButton("getTime()",80,100,80,30,function() {
		_g._time.text = "Time: " + _g._snd.getTime();
	});
	this._addButton("setTime(2)",160,100,80,30,function() {
		_g._snd.setTime(2);
	});
	this._addButton("setTime(5)",240,100,80,30,function() {
		_g._snd.setTime(5);
	});
	this._addButton("setTime(7)",320,100,80,30,function() {
		_g._snd.setTime(7);
	});
	this._addButton("setTime(10)",400,100,80,30,function() {
		_g._snd.setTime(10);
	});
	Waud.init();
	Waud.autoMute();
	Waud.enableTouchUnlock($bind(this,this.touchUnlock));
	Waud.defaults.onload = $bind(this,this._onLoad);
	this._snd = new WaudSound("assets/countdown.mp3",{ loop : false, autoplay : false, volume : 1, onload : $bind(this,this._onLoad)});
	this._resize();
};
Sample2.__name__ = true;
Sample2.main = function() {
	new Sample2();
};
Sample2.__super__ = pixi_plugins_app_Application;
Sample2.prototype = $extend(pixi_plugins_app_Application.prototype,{
	_onLoad: function(snd) {
		this._duration.text = "Duration: " + snd.get_duration();
	}
	,touchUnlock: function() {
	}
	,_addButton: function(label,x,y,width,height,callback) {
		var btn = new Button(label,width,height);
		btn.position.set(x,y);
		btn.action.add(callback);
		btn._enabled = true;
		this._btnContainer.addChild(btn);
	}
	,_resize: function() {
		this._btnContainer.position.set((window.innerWidth - this._btnContainer.width) / 2,(window.innerHeight - this._btnContainer.height) / 2);
	}
});
var Std = function() { };
Std.__name__ = true;
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
};
var Type = function() { };
Type.__name__ = true;
Type.createInstance = function(cl,args) {
	var _g = args.length;
	switch(_g) {
	case 0:
		return new cl();
	case 1:
		return new cl(args[0]);
	case 2:
		return new cl(args[0],args[1]);
	case 3:
		return new cl(args[0],args[1],args[2]);
	case 4:
		return new cl(args[0],args[1],args[2],args[3]);
	case 5:
		return new cl(args[0],args[1],args[2],args[3],args[4]);
	case 6:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5]);
	case 7:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6]);
	case 8:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7]);
	default:
		throw new js__$Boot_HaxeError("Too many arguments");
	}
	return null;
};
var Waud = $hx_exports.Waud = function() { };
Waud.__name__ = true;
Waud.init = function(d) {
	if(Waud.__audioElement == null) {
		if(d == null) d = window.document;
		Waud.dom = d;
		Waud.__audioElement = Waud.dom.createElement("audio");
		if(Waud.audioManager == null) Waud.audioManager = new AudioManager();
		Waud.isWebAudioSupported = Waud.audioManager.checkWebAudioAPISupport();
		Waud.isHTML5AudioSupported = Reflect.field(window,"Audio") != null;
		if(Waud.isWebAudioSupported) Waud.audioContext = Waud.audioManager.createAudioContext();
		Waud.sounds = new haxe_ds_StringMap();
	}
};
Waud.autoMute = function() {
	var blur = function() {
		if(Waud.sounds != null) {
			var $it0 = Waud.sounds.iterator();
			while( $it0.hasNext() ) {
				var sound = $it0.next();
				sound.mute(true);
			}
		}
	};
	var focus = function() {
		if(!Waud.isMuted && Waud.sounds != null) {
			var $it1 = Waud.sounds.iterator();
			while( $it1.hasNext() ) {
				var sound1 = $it1.next();
				sound1.mute(false);
			}
		}
	};
	Waud._focusManager = new WaudFocusManager();
	Waud._focusManager.focus = focus;
	Waud._focusManager.blur = blur;
};
Waud.enableTouchUnlock = function(callback) {
	Waud.__touchUnlockCallback = callback;
	Waud.dom.ontouchend = ($_=Waud.audioManager,$bind($_,$_.unlockAudio));
};
Waud.mute = function(val) {
	if(val == null) val = true;
	Waud.isMuted = val;
	if(Waud.sounds != null) {
		var $it0 = Waud.sounds.iterator();
		while( $it0.hasNext() ) {
			var sound = $it0.next();
			sound.mute(val);
		}
	}
};
Waud.stop = function() {
	if(Waud.sounds != null) {
		var $it0 = Waud.sounds.iterator();
		while( $it0.hasNext() ) {
			var sound = $it0.next();
			sound.stop();
		}
	}
};
Waud.pause = function() {
	if(Waud.sounds != null) {
		var $it0 = Waud.sounds.iterator();
		while( $it0.hasNext() ) {
			var sound = $it0.next();
			sound.pause();
		}
	}
};
Waud.getFormatSupportString = function() {
	var support = "OGG: " + Waud.__audioElement.canPlayType("audio/ogg; codecs=\"vorbis\"");
	support += ", WAV: " + Waud.__audioElement.canPlayType("audio/wav; codecs=\"1\"");
	support += ", MP3: " + Waud.__audioElement.canPlayType("audio/mpeg;");
	support += ", AAC: " + Waud.__audioElement.canPlayType("audio/aac;");
	support += ", M4A: " + Waud.__audioElement.canPlayType("audio/x-m4a;");
	return support;
};
Waud.isSupported = function() {
	if(Waud.isWebAudioSupported == null || Waud.isHTML5AudioSupported == null) {
		Waud.isWebAudioSupported = Waud.audioManager.checkWebAudioAPISupport();
		Waud.isHTML5AudioSupported = Reflect.field(window,"Audio") != null;
	}
	return Waud.isWebAudioSupported || Waud.isHTML5AudioSupported;
};
Waud.isOGGSupported = function() {
	var canPlay = Waud.__audioElement.canPlayType("audio/ogg; codecs=\"vorbis\"");
	return Waud.isHTML5AudioSupported && canPlay != null && (canPlay == "probably" || canPlay == "maybe");
};
Waud.isWAVSupported = function() {
	var canPlay = Waud.__audioElement.canPlayType("audio/wav; codecs=\"1\"");
	return Waud.isHTML5AudioSupported && canPlay != null && (canPlay == "probably" || canPlay == "maybe");
};
Waud.isMP3Supported = function() {
	var canPlay = Waud.__audioElement.canPlayType("audio/mpeg;");
	return Waud.isHTML5AudioSupported && canPlay != null && (canPlay == "probably" || canPlay == "maybe");
};
Waud.isAACSupported = function() {
	var canPlay = Waud.__audioElement.canPlayType("audio/aac;");
	return Waud.isHTML5AudioSupported && canPlay != null && (canPlay == "probably" || canPlay == "maybe");
};
Waud.isM4ASupported = function() {
	var canPlay = Waud.__audioElement.canPlayType("audio/x-m4a;");
	return Waud.isHTML5AudioSupported && canPlay != null && (canPlay == "probably" || canPlay == "maybe");
};
Waud.destroy = function() {
	if(Waud.sounds != null) {
		var $it0 = Waud.sounds.iterator();
		while( $it0.hasNext() ) {
			var sound = $it0.next();
			sound.destroy();
		}
	}
	Waud.sounds = null;
	if(Waud.audioManager != null) Waud.audioManager.destroy();
	Waud.audioManager = null;
	Waud.audioContext = null;
	Waud.__audioElement = null;
	if(Waud._focusManager != null) {
		Waud._focusManager.clearEvents();
		Waud._focusManager.blur = null;
		Waud._focusManager.focus = null;
	}
};
var WaudFocusManager = $hx_exports.WaudFocusManager = function() {
	var _g = this;
	this._hidden = "";
	this._visibilityChange = "";
	this._currentState = "";
	if(Reflect.field(window.document,"hidden") != null) {
		this._hidden = "hidden";
		this._visibilityChange = "visibilitychange";
	} else if(Reflect.field(window.document,"mozHidden") != null) {
		this._hidden = "mozHidden";
		this._visibilityChange = "mozvisibilitychange";
	} else if(Reflect.field(window.document,"msHidden") != null) {
		this._hidden = "msHidden";
		this._visibilityChange = "msvisibilitychange";
	} else if(Reflect.field(window.document,"webkitHidden") != null) {
		this._hidden = "webkitHidden";
		this._visibilityChange = "webkitvisibilitychange";
	}
	if(Reflect.field(window,"addEventListener") != null) {
		window.addEventListener("focus",$bind(this,this._focus));
		window.addEventListener("blur",$bind(this,this._blur));
		window.addEventListener("pageshow",$bind(this,this._focus));
		window.addEventListener("pagehide",$bind(this,this._blur));
		document.addEventListener(this._visibilityChange,$bind(this,this._handleVisibilityChange));
	} else if(Reflect.field(window,"attachEvent") != null) {
		window.attachEvent("onfocus",$bind(this,this._focus));
		window.attachEvent("onblur",$bind(this,this._blur));
		window.attachEvent("pageshow",$bind(this,this._focus));
		window.attachEvent("pagehide",$bind(this,this._blur));
		document.attachEvent(this._visibilityChange,$bind(this,this._handleVisibilityChange));
	} else window.onload = function() {
		window.onfocus = $bind(_g,_g._focus);
		window.onblur = $bind(_g,_g._blur);
		window.onpageshow = $bind(_g,_g._focus);
		window.onpagehide = $bind(_g,_g._blur);
	};
};
WaudFocusManager.__name__ = true;
WaudFocusManager.prototype = {
	_handleVisibilityChange: function() {
		if(Reflect.field(window.document,this._hidden) != null && Reflect.field(window.document,this._hidden) && this.blur != null) this.blur(); else if(this.focus != null) this.focus();
	}
	,_focus: function() {
		if(this._currentState != "focus" && this.focus != null) this.focus();
		this._currentState = "focus";
	}
	,_blur: function() {
		if(this._currentState != "blur" && this.blur != null) this.blur();
		this._currentState = "blur";
	}
	,clearEvents: function() {
		if(Reflect.field(window,"removeEventListener") != null) {
			window.removeEventListener("focus",$bind(this,this._focus));
			window.removeEventListener("blur",$bind(this,this._blur));
			window.removeEventListener("pageshow",$bind(this,this._focus));
			window.removeEventListener("pagehide",$bind(this,this._blur));
			window.removeEventListener(this._visibilityChange,$bind(this,this._handleVisibilityChange));
		} else if(Reflect.field(window,"removeEvent") != null) {
			window.removeEvent("onfocus",$bind(this,this._focus));
			window.removeEvent("onblur",$bind(this,this._blur));
			window.removeEvent("pageshow",$bind(this,this._focus));
			window.removeEvent("pagehide",$bind(this,this._blur));
			window.removeEvent(this._visibilityChange,$bind(this,this._handleVisibilityChange));
		} else {
			window.onfocus = null;
			window.onblur = null;
			window.onpageshow = null;
			window.onpagehide = null;
		}
	}
};
var WaudSound = $hx_exports.WaudSound = function(url,options) {
	if(Waud.audioManager == null) {
		console.log("initialise Waud using Waud.init() before loading sounds");
		return;
	}
	this._options = options;
	if(url.indexOf(".json") > 0) {
		this.isSpriteSound = true;
		this._spriteDuration = 0;
		this._spriteSounds = new haxe_ds_StringMap();
		this._loadSpriteJson(url);
	} else {
		this.isSpriteSound = false;
		this._init(url);
	}
	Waud.sounds.set(url,this);
};
WaudSound.__name__ = true;
WaudSound.__interfaces__ = [IWaudSound];
WaudSound.prototype = {
	_loadSpriteJson: function(jsonUrl) {
		var _g = this;
		var xobj = new XMLHttpRequest();
		xobj.overrideMimeType("application/json");
		xobj.open("GET",jsonUrl,true);
		xobj.onreadystatechange = function() {
			if(xobj.readyState == 4 && xobj.status == 200) {
				_g._spriteData = JSON.parse(xobj.response);
				var url = _g._spriteData.src;
				if(jsonUrl.indexOf("/") > -1) url = jsonUrl.substring(0,jsonUrl.lastIndexOf("/") + 1) + url;
				_g._init(url);
			}
		};
		xobj.send(null);
	}
	,_init: function(soundUrl) {
		this.url = soundUrl;
		if(Waud.isWebAudioSupported && Waud.useWebAudio && (this._options == null || this._options.webaudio == null || this._options.webaudio)) {
			if(this.isSpriteSound) this._loadSpriteSound(this.url); else this._snd = new WebAudioAPISound(this.url,this._options);
		} else if(Waud.isHTML5AudioSupported) {
			var sound = new HTML5Sound(this.url,this._options);
			if(this._spriteData != null && this._spriteData.sprite != null) {
				var _g = 0;
				var _g1 = this._spriteData.sprite;
				while(_g < _g1.length) {
					var snd = _g1[_g];
					++_g;
					sound.isSpriteSound = true;
					this._spriteSounds.set(snd.name,sound);
				}
			}
		} else {
			console.log("no audio support in this browser");
			return;
		}
	}
	,get_duration: function() {
		if(this.isSpriteSound) return this._spriteDuration;
		if(this._snd == null) return 0;
		return this._snd.get_duration();
	}
	,setVolume: function(val,spriteName) {
		if(this.isSpriteSound) {
			if(spriteName != null && this._spriteSounds.get(spriteName) != null) this._spriteSounds.get(spriteName).setVolume(val);
			return;
		}
		if(this._snd == null) return;
		this._snd.setVolume(val);
	}
	,getVolume: function(spriteName) {
		if(this.isSpriteSound) {
			if(spriteName != null && this._spriteSounds.get(spriteName) != null) return this._spriteSounds.get(spriteName).getVolume();
			return 0;
		}
		if(this._snd == null) return 0;
		return this._snd.getVolume();
	}
	,mute: function(val,spriteName) {
		if(this.isSpriteSound) {
			if(spriteName != null && this._spriteSounds.get(spriteName) != null) this._spriteSounds.get(spriteName).mute(val); else {
				var $it0 = this._spriteSounds.iterator();
				while( $it0.hasNext() ) {
					var snd = $it0.next();
					snd.mute(val);
				}
			}
			return;
		}
		if(this._snd == null) return;
		this._snd.mute(val);
	}
	,toggleMute: function(spriteName) {
		if(this.isSpriteSound) {
			if(spriteName != null && this._spriteSounds.get(spriteName) != null) this._spriteSounds.get(spriteName).toggleMute(); else {
				var $it0 = this._spriteSounds.iterator();
				while( $it0.hasNext() ) {
					var snd = $it0.next();
					snd.toggleMute();
				}
			}
			return;
		}
		if(this._snd == null) return;
		this._snd.toggleMute();
	}
	,load: function(callback) {
		if(this._snd == null || this.isSpriteSound) return null;
		this._snd.load(callback);
		return this;
	}
	,play: function(spriteName,soundProps) {
		if(this.isSpriteSound) {
			if(spriteName != null) {
				var _g = 0;
				var _g1 = this._spriteData.sprite;
				while(_g < _g1.length) {
					var snd = _g1[_g];
					++_g;
					if(snd.name == spriteName) {
						soundProps = snd;
						break;
					}
				}
				if(soundProps == null) return null;
				if(this._spriteSounds.get(spriteName) != null) {
					this._spriteSounds.get(spriteName).stop();
					return this._spriteSounds.get(spriteName).play(spriteName,soundProps);
				}
			} else return null;
		}
		if(this._snd == null) return null;
		return this._snd.play(spriteName,soundProps);
	}
	,togglePlay: function(spriteName) {
		if(this.isSpriteSound) {
			if(spriteName != null && this._spriteSounds.get(spriteName) != null) this._spriteSounds.get(spriteName).togglePlay();
			return;
		}
		if(this._snd == null) return;
		this._snd.togglePlay();
	}
	,isPlaying: function(spriteName) {
		if(this.isSpriteSound) {
			if(spriteName != null && this._spriteSounds.get(spriteName) != null) return this._spriteSounds.get(spriteName).isPlaying();
			return false;
		}
		if(this._snd == null) return false;
		return this._snd.isPlaying();
	}
	,loop: function(val) {
		if(this._snd == null || this.isSpriteSound) return;
		this._snd.loop(val);
	}
	,stop: function(spriteName) {
		if(this.isSpriteSound) {
			if(spriteName != null && this._spriteSounds.get(spriteName) != null) this._spriteSounds.get(spriteName).stop(); else {
				var $it0 = this._spriteSounds.iterator();
				while( $it0.hasNext() ) {
					var snd = $it0.next();
					snd.stop();
				}
			}
			return;
		}
		if(this._snd == null) return;
		this._snd.stop();
	}
	,pause: function(spriteName) {
		if(this.isSpriteSound) {
			if(spriteName != null && this._spriteSounds.get(spriteName) != null) this._spriteSounds.get(spriteName).pause(); else {
				var $it0 = this._spriteSounds.iterator();
				while( $it0.hasNext() ) {
					var snd = $it0.next();
					snd.pause();
				}
			}
			return;
		}
		if(this._snd == null) return;
		this._snd.pause();
	}
	,setTime: function(time) {
		if(this._snd == null || this.isSpriteSound) return;
		this._snd.setTime(time);
	}
	,getTime: function() {
		if(this._snd == null || this.isSpriteSound) return 0;
		return this._snd.getTime();
	}
	,onEnd: function(callback,spriteName) {
		if(this.isSpriteSound) {
			if(spriteName != null && this._spriteSounds.get(spriteName) != null) this._spriteSounds.get(spriteName).onEnd(callback);
			return this;
		}
		if(this._snd == null) return null;
		this._snd.onEnd(callback);
		return this;
	}
	,onLoad: function(callback) {
		if(this._snd == null || this.isSpriteSound) return null;
		this._snd.onLoad(callback);
		return this;
	}
	,onError: function(callback) {
		if(this._snd == null || this.isSpriteSound) return null;
		this._snd.onError(callback);
		return this;
	}
	,destroy: function() {
		if(this.isSpriteSound) {
			var $it0 = this._spriteSounds.iterator();
			while( $it0.hasNext() ) {
				var snd = $it0.next();
				snd.destroy();
			}
			return;
		}
		if(this._snd == null) return;
		this._snd.destroy();
		this._snd = null;
	}
	,_loadSpriteSound: function(url) {
		var request = new XMLHttpRequest();
		request.open("GET",url,true);
		request.responseType = "arraybuffer";
		request.onload = $bind(this,this._onSpriteSoundLoaded);
		request.onerror = $bind(this,this._onSpriteSoundError);
		request.send();
	}
	,_onSpriteSoundLoaded: function(evt) {
		Waud.audioManager.audioContext.decodeAudioData(evt.target.response,$bind(this,this._decodeSuccess),$bind(this,this._onSpriteSoundError));
	}
	,_onSpriteSoundError: function() {
		if(this._options != null && this._options.onerror != null) this._options.onerror(this);
	}
	,_decodeSuccess: function(buffer) {
		if(buffer == null) {
			console.log("empty buffer: " + this.url);
			this._onSpriteSoundError();
			return;
		}
		Waud.audioManager.bufferList.set(this.url,buffer);
		this._spriteDuration = buffer.duration;
		if(this._options != null && this._options.onload != null) this._options.onload(this);
		var _g = 0;
		var _g1 = this._spriteData.sprite;
		while(_g < _g1.length) {
			var snd = _g1[_g];
			++_g;
			var sound = new WebAudioAPISound(this.url,this._options,true,buffer.duration);
			sound.isSpriteSound = true;
			this._spriteSounds.set(snd.name,sound);
		}
	}
};
var WaudUtils = $hx_exports.WaudUtils = function() { };
WaudUtils.__name__ = true;
WaudUtils.isAndroid = function(ua) {
	if(ua == null) ua = window.navigator.userAgent;
	return new EReg("Android","i").match(ua);
};
WaudUtils.isiOS = function(ua) {
	if(ua == null) ua = window.navigator.userAgent;
	return new EReg("(iPad|iPhone|iPod)","i").match(ua);
};
WaudUtils.isWindowsPhone = function(ua) {
	if(ua == null) ua = window.navigator.userAgent;
	return new EReg("(IEMobile|Windows Phone)","i").match(ua);
};
WaudUtils.isFirefox = function(ua) {
	if(ua == null) ua = window.navigator.userAgent;
	return new EReg("Firefox","i").match(ua);
};
WaudUtils.isOpera = function(ua) {
	if(ua == null) ua = window.navigator.userAgent;
	return new EReg("Opera","i").match(ua) || Reflect.field(window,"opera") != null;
};
WaudUtils.isChrome = function(ua) {
	if(ua == null) ua = window.navigator.userAgent;
	return new EReg("Chrome","i").match(ua);
};
WaudUtils.isSafari = function(ua) {
	if(ua == null) ua = window.navigator.userAgent;
	return new EReg("Safari","i").match(ua);
};
WaudUtils.isMobile = function(ua) {
	if(ua == null) ua = window.navigator.userAgent;
	return new EReg("(iPad|iPhone|iPod|Android|webOS|BlackBerry|Windows Phone|IEMobile)","i").match(ua);
};
WaudUtils.getiOSVersion = function(ua) {
	if(ua == null) ua = window.navigator.userAgent;
	var v = new EReg("[0-9_]+?[0-9_]+?[0-9_]+","i");
	var matched = [];
	if(v.match(ua)) {
		var match = v.matched(0).split("_");
		var _g = [];
		var _g1 = 0;
		while(_g1 < match.length) {
			var i = match[_g1];
			++_g1;
			_g.push(Std.parseInt(i));
		}
		matched = _g;
	}
	return matched;
};
var WebAudioAPISound = function(url,options,loaded,d) {
	if(d == null) d = 0;
	if(loaded == null) loaded = false;
	BaseSound.call(this,url,options);
	this._playStartTime = 0;
	this._pauseTime = 0;
	this._srcNodes = [];
	this._gainNodes = [];
	this._currentSoundProps = null;
	this._isLoaded = loaded;
	this.duration = d;
	this._manager = Waud.audioManager;
	if(this._options.preload && !loaded) this.load();
};
WebAudioAPISound.__name__ = true;
WebAudioAPISound.__interfaces__ = [IWaudSound];
WebAudioAPISound.__super__ = BaseSound;
WebAudioAPISound.prototype = $extend(BaseSound.prototype,{
	load: function(callback) {
		if(!this._isLoaded) {
			var request = new XMLHttpRequest();
			request.open("GET",this.url,true);
			request.responseType = "arraybuffer";
			request.onload = $bind(this,this._onSoundLoaded);
			request.onerror = $bind(this,this._error);
			request.send();
			if(callback != null) this._options.onload = callback;
		}
		return this;
	}
	,_onSoundLoaded: function(evt) {
		this._manager.audioContext.decodeAudioData(evt.target.response,$bind(this,this._decodeSuccess),$bind(this,this._error));
	}
	,_error: function() {
		if(this._options.onerror != null) this._options.onerror(this);
	}
	,_decodeSuccess: function(buffer) {
		if(buffer == null) {
			console.log("empty buffer: " + this.url);
			this._error();
			return;
		}
		this._manager.bufferList.set(this.url,buffer);
		this._isLoaded = true;
		this.duration = buffer.duration;
		if(this._options.onload != null) this._options.onload(this);
		if(this._options.autoplay) this.play();
	}
	,_makeSource: function(buffer) {
		var source = this._manager.audioContext.createBufferSource();
		source.buffer = buffer;
		if(this._manager.audioContext.createGain != null) this._gainNode = this._manager.audioContext.createGain(); else this._gainNode = this._manager.audioContext.createGainNode();
		source.connect(this._gainNode);
		this._gainNode.connect(this._manager.audioContext.destination);
		this._srcNodes.push(source);
		this._gainNodes.push(this._gainNode);
		if(this._muted) this._gainNode.gain.value = 0; else this._gainNode.gain.value = this._options.volume;
		return source;
	}
	,get_duration: function() {
		if(!this._isLoaded) return 0;
		return this.duration;
	}
	,play: function(spriteName,soundProps) {
		var _g = this;
		if(this._isPlaying) this.stop(spriteName);
		if(!this._isLoaded) {
			console.log("sound not loaded");
			return -1;
		}
		var start = 0;
		var end = -1;
		if(this.isSpriteSound && soundProps != null) {
			this._currentSoundProps = soundProps;
			start = soundProps.start + this._pauseTime;
			end = soundProps.duration;
		}
		var buffer = this._manager.bufferList.get(this.url);
		if(buffer != null) {
			this._snd = this._makeSource(buffer);
			if(start >= 0 && end > -1) {
				if(Reflect.field(this._snd,"start") != null) this._snd.start(0,start,end); else this._snd.noteGrainOn(0,start,end);
			} else if(Reflect.field(this._snd,"start") != null) this._snd.start(0,this._pauseTime,this._snd.buffer.duration); else this._snd.noteGrainOn(0,this._pauseTime,this._snd.buffer.duration);
			this._playStartTime = this._manager.audioContext.currentTime;
			this._isPlaying = true;
			this._snd.onended = function() {
				_g._pauseTime = 0;
				_g._isPlaying = false;
				if(_g.isSpriteSound && soundProps != null && soundProps.loop != null && soundProps.loop && start >= 0 && end > -1) {
					_g.destroy();
					_g.play(spriteName,soundProps);
				} else if(_g._options.loop) {
					_g.destroy();
					_g.play();
				}
				if(_g._options.onend != null) _g._options.onend(_g);
			};
		}
		return HxOverrides.indexOf(this._srcNodes,this._snd,0);
	}
	,togglePlay: function(spriteName) {
		if(this._isPlaying) this.pause(); else this.play();
	}
	,isPlaying: function(spriteName) {
		return this._isPlaying;
	}
	,loop: function(val) {
		if(this._snd == null || !this._isLoaded) return;
		this._snd.loop = val;
	}
	,setVolume: function(val,spriteName) {
		this._options.volume = val;
		if(this._gainNode == null || !this._isLoaded) return;
		this._gainNode.gain.value = this._options.volume;
	}
	,getVolume: function(spriteName) {
		return this._options.volume;
	}
	,mute: function(val,spriteName) {
		this._muted = val;
		if(this._gainNode == null || !this._isLoaded) return;
		if(val) this._gainNode.gain.value = 0; else this._gainNode.gain.value = this._options.volume;
	}
	,toggleMute: function(spriteName) {
		this.mute(!this._muted);
	}
	,stop: function(spriteName) {
		this._pauseTime = 0;
		if(this._snd == null || !this._isLoaded || !this._isPlaying) return;
		this.destroy();
	}
	,pause: function(spriteName) {
		if(this._snd == null || !this._isLoaded || !this._isPlaying) return;
		this.destroy();
		this._pauseTime += this._manager.audioContext.currentTime - this._playStartTime;
	}
	,setTime: function(time) {
		if(!this._isLoaded || time > this.get_duration()) return;
		if(this._isPlaying) {
			this.stop();
			this._pauseTime = time;
			this.play();
		} else this._pauseTime = time;
	}
	,getTime: function() {
		if(this._snd == null || !this._isLoaded || !this._isPlaying) return 0;
		return this._manager.audioContext.currentTime - this._playStartTime + this._pauseTime;
	}
	,onEnd: function(callback,spriteName) {
		this._options.onend = callback;
		return this;
	}
	,onLoad: function(callback) {
		this._options.onload = callback;
		return this;
	}
	,onError: function(callback) {
		this._options.onerror = callback;
		return this;
	}
	,destroy: function() {
		var _g = 0;
		var _g1 = this._srcNodes;
		while(_g < _g1.length) {
			var src = _g1[_g];
			++_g;
			if(Reflect.field(src,"stop") != null) src.stop(0); else if(Reflect.field(src,"noteOff") != null) try {
				this.src.noteOff(0);
			} catch( e ) {
				if (e instanceof js__$Boot_HaxeError) e = e.val;
			}
			src.disconnect();
			src = null;
		}
		var _g2 = 0;
		var _g11 = this._gainNodes;
		while(_g2 < _g11.length) {
			var gain = _g11[_g2];
			++_g2;
			gain.disconnect();
			gain = null;
		}
		this._srcNodes = [];
		this._gainNodes = [];
		this._isPlaying = false;
	}
});
var haxe_IMap = function() { };
haxe_IMap.__name__ = true;
var haxe_Timer = function(time_ms) {
	var me = this;
	this.id = setInterval(function() {
		me.run();
	},time_ms);
};
haxe_Timer.__name__ = true;
haxe_Timer.delay = function(f,time_ms) {
	var t = new haxe_Timer(time_ms);
	t.run = function() {
		t.stop();
		f();
	};
	return t;
};
haxe_Timer.prototype = {
	stop: function() {
		if(this.id == null) return;
		clearInterval(this.id);
		this.id = null;
	}
	,run: function() {
	}
};
var haxe_ds__$StringMap_StringMapIterator = function(map,keys) {
	this.map = map;
	this.keys = keys;
	this.index = 0;
	this.count = keys.length;
};
haxe_ds__$StringMap_StringMapIterator.__name__ = true;
haxe_ds__$StringMap_StringMapIterator.prototype = {
	hasNext: function() {
		return this.index < this.count;
	}
	,next: function() {
		return this.map.get(this.keys[this.index++]);
	}
};
var haxe_ds_StringMap = function() {
	this.h = { };
};
haxe_ds_StringMap.__name__ = true;
haxe_ds_StringMap.__interfaces__ = [haxe_IMap];
haxe_ds_StringMap.prototype = {
	set: function(key,value) {
		if(__map_reserved[key] != null) this.setReserved(key,value); else this.h[key] = value;
	}
	,get: function(key) {
		if(__map_reserved[key] != null) return this.getReserved(key);
		return this.h[key];
	}
	,setReserved: function(key,value) {
		if(this.rh == null) this.rh = { };
		this.rh["$" + key] = value;
	}
	,getReserved: function(key) {
		if(this.rh == null) return null; else return this.rh["$" + key];
	}
	,arrayKeys: function() {
		var out = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) out.push(key);
		}
		if(this.rh != null) {
			for( var key in this.rh ) {
			if(key.charCodeAt(0) == 36) out.push(key.substr(1));
			}
		}
		return out;
	}
	,iterator: function() {
		return new haxe_ds__$StringMap_StringMapIterator(this,this.arrayKeys());
	}
};
var js__$Boot_HaxeError = function(val) {
	Error.call(this);
	this.val = val;
	this.message = String(val);
	if(Error.captureStackTrace) Error.captureStackTrace(this,js__$Boot_HaxeError);
};
js__$Boot_HaxeError.__name__ = true;
js__$Boot_HaxeError.__super__ = Error;
js__$Boot_HaxeError.prototype = $extend(Error.prototype,{
});
var msignal_Signal = function(valueClasses) {
	if(valueClasses == null) valueClasses = [];
	this.valueClasses = valueClasses;
	this.slots = msignal_SlotList.NIL;
	this.priorityBased = false;
};
msignal_Signal.__name__ = true;
msignal_Signal.prototype = {
	add: function(listener) {
		return this.registerListener(listener);
	}
	,addOnce: function(listener) {
		return this.registerListener(listener,true);
	}
	,addWithPriority: function(listener,priority) {
		if(priority == null) priority = 0;
		return this.registerListener(listener,false,priority);
	}
	,addOnceWithPriority: function(listener,priority) {
		if(priority == null) priority = 0;
		return this.registerListener(listener,true,priority);
	}
	,remove: function(listener) {
		var slot = this.slots.find(listener);
		if(slot == null) return null;
		this.slots = this.slots.filterNot(listener);
		return slot;
	}
	,removeAll: function() {
		this.slots = msignal_SlotList.NIL;
	}
	,registerListener: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		if(this.registrationPossible(listener,once)) {
			var newSlot = this.createSlot(listener,once,priority);
			if(!this.priorityBased && priority != 0) this.priorityBased = true;
			if(!this.priorityBased && priority == 0) this.slots = this.slots.prepend(newSlot); else this.slots = this.slots.insertWithPriority(newSlot);
			return newSlot;
		}
		return this.slots.find(listener);
	}
	,registrationPossible: function(listener,once) {
		if(!this.slots.nonEmpty) return true;
		var existingSlot = this.slots.find(listener);
		if(existingSlot == null) return true;
		if(existingSlot.once != once) throw new js__$Boot_HaxeError("You cannot addOnce() then add() the same listener without removing the relationship first.");
		return false;
	}
	,createSlot: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		return null;
	}
	,get_numListeners: function() {
		return this.slots.get_length();
	}
};
var msignal_Signal0 = function() {
	msignal_Signal.call(this);
};
msignal_Signal0.__name__ = true;
msignal_Signal0.__super__ = msignal_Signal;
msignal_Signal0.prototype = $extend(msignal_Signal.prototype,{
	dispatch: function() {
		var slotsToProcess = this.slots;
		while(slotsToProcess.nonEmpty) {
			slotsToProcess.head.execute();
			slotsToProcess = slotsToProcess.tail;
		}
	}
	,createSlot: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		return new msignal_Slot0(this,listener,once,priority);
	}
});
var msignal_Signal1 = function(type) {
	msignal_Signal.call(this,[type]);
};
msignal_Signal1.__name__ = true;
msignal_Signal1.__super__ = msignal_Signal;
msignal_Signal1.prototype = $extend(msignal_Signal.prototype,{
	dispatch: function(value) {
		var slotsToProcess = this.slots;
		while(slotsToProcess.nonEmpty) {
			slotsToProcess.head.execute(value);
			slotsToProcess = slotsToProcess.tail;
		}
	}
	,createSlot: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		return new msignal_Slot1(this,listener,once,priority);
	}
});
var msignal_Signal2 = function(type1,type2) {
	msignal_Signal.call(this,[type1,type2]);
};
msignal_Signal2.__name__ = true;
msignal_Signal2.__super__ = msignal_Signal;
msignal_Signal2.prototype = $extend(msignal_Signal.prototype,{
	dispatch: function(value1,value2) {
		var slotsToProcess = this.slots;
		while(slotsToProcess.nonEmpty) {
			slotsToProcess.head.execute(value1,value2);
			slotsToProcess = slotsToProcess.tail;
		}
	}
	,createSlot: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		return new msignal_Slot2(this,listener,once,priority);
	}
});
var msignal_Slot = function(signal,listener,once,priority) {
	if(priority == null) priority = 0;
	if(once == null) once = false;
	this.signal = signal;
	this.set_listener(listener);
	this.once = once;
	this.priority = priority;
	this.enabled = true;
};
msignal_Slot.__name__ = true;
msignal_Slot.prototype = {
	remove: function() {
		this.signal.remove(this.listener);
	}
	,set_listener: function(value) {
		if(value == null) throw new js__$Boot_HaxeError("listener cannot be null");
		return this.listener = value;
	}
};
var msignal_Slot0 = function(signal,listener,once,priority) {
	if(priority == null) priority = 0;
	if(once == null) once = false;
	msignal_Slot.call(this,signal,listener,once,priority);
};
msignal_Slot0.__name__ = true;
msignal_Slot0.__super__ = msignal_Slot;
msignal_Slot0.prototype = $extend(msignal_Slot.prototype,{
	execute: function() {
		if(!this.enabled) return;
		if(this.once) this.remove();
		this.listener();
	}
});
var msignal_Slot1 = function(signal,listener,once,priority) {
	if(priority == null) priority = 0;
	if(once == null) once = false;
	msignal_Slot.call(this,signal,listener,once,priority);
};
msignal_Slot1.__name__ = true;
msignal_Slot1.__super__ = msignal_Slot;
msignal_Slot1.prototype = $extend(msignal_Slot.prototype,{
	execute: function(value1) {
		if(!this.enabled) return;
		if(this.once) this.remove();
		if(this.param != null) value1 = this.param;
		this.listener(value1);
	}
});
var msignal_Slot2 = function(signal,listener,once,priority) {
	if(priority == null) priority = 0;
	if(once == null) once = false;
	msignal_Slot.call(this,signal,listener,once,priority);
};
msignal_Slot2.__name__ = true;
msignal_Slot2.__super__ = msignal_Slot;
msignal_Slot2.prototype = $extend(msignal_Slot.prototype,{
	execute: function(value1,value2) {
		if(!this.enabled) return;
		if(this.once) this.remove();
		if(this.param1 != null) value1 = this.param1;
		if(this.param2 != null) value2 = this.param2;
		this.listener(value1,value2);
	}
});
var msignal_SlotList = function(head,tail) {
	this.nonEmpty = false;
	if(head == null && tail == null) {
		if(msignal_SlotList.NIL != null) throw new js__$Boot_HaxeError("Parameters head and tail are null. Use the NIL element instead.");
		this.nonEmpty = false;
	} else if(head == null) throw new js__$Boot_HaxeError("Parameter head cannot be null."); else {
		this.head = head;
		if(tail == null) this.tail = msignal_SlotList.NIL; else this.tail = tail;
		this.nonEmpty = true;
	}
};
msignal_SlotList.__name__ = true;
msignal_SlotList.prototype = {
	get_length: function() {
		if(!this.nonEmpty) return 0;
		if(this.tail == msignal_SlotList.NIL) return 1;
		var result = 0;
		var p = this;
		while(p.nonEmpty) {
			++result;
			p = p.tail;
		}
		return result;
	}
	,prepend: function(slot) {
		return new msignal_SlotList(slot,this);
	}
	,insertWithPriority: function(slot) {
		if(!this.nonEmpty) return new msignal_SlotList(slot);
		var priority = slot.priority;
		if(priority >= this.head.priority) return this.prepend(slot);
		var wholeClone = new msignal_SlotList(this.head);
		var subClone = wholeClone;
		var current = this.tail;
		while(current.nonEmpty) {
			if(priority > current.head.priority) {
				subClone.tail = current.prepend(slot);
				return wholeClone;
			}
			subClone = subClone.tail = new msignal_SlotList(current.head);
			current = current.tail;
		}
		subClone.tail = new msignal_SlotList(slot);
		return wholeClone;
	}
	,filterNot: function(listener) {
		if(!this.nonEmpty || listener == null) return this;
		if(Reflect.compareMethods(this.head.listener,listener)) return this.tail;
		var wholeClone = new msignal_SlotList(this.head);
		var subClone = wholeClone;
		var current = this.tail;
		while(current.nonEmpty) {
			if(Reflect.compareMethods(current.head.listener,listener)) {
				subClone.tail = current.tail;
				return wholeClone;
			}
			subClone = subClone.tail = new msignal_SlotList(current.head);
			current = current.tail;
		}
		return this;
	}
	,find: function(listener) {
		if(!this.nonEmpty) return null;
		var p = this;
		while(p.nonEmpty) {
			if(Reflect.compareMethods(p.head.listener,listener)) return p.head;
			p = p.tail;
		}
		return null;
	}
};
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
if(Array.prototype.indexOf) HxOverrides.indexOf = function(a,o,i) {
	return Array.prototype.indexOf.call(a,o,i);
};
String.__name__ = true;
Array.__name__ = true;
var Dynamic = { __name__ : ["Dynamic"]};
var __map_reserved = {}
msignal_SlotList.NIL = new msignal_SlotList(null,null);
Waud.PROBABLY = "probably";
Waud.MAYBE = "maybe";
Waud.version = "0.5.4";
Waud.useWebAudio = true;
Waud.defaults = { autoplay : false, loop : false, preload : true, webaudio : true, volume : 1};
Waud.preferredSampleRate = 44100;
Waud.isMuted = false;
WaudFocusManager.FOCUS_STATE = "focus";
WaudFocusManager.BLUR_STATE = "blur";
WaudFocusManager.ON_FOCUS = "onfocus";
WaudFocusManager.ON_BLUR = "onblur";
WaudFocusManager.PAGE_SHOW = "pageshow";
WaudFocusManager.PAGE_HIDE = "pagehide";
WaudFocusManager.WINDOW = "window";
WaudFocusManager.DOCUMENT = "document";
Sample2.main();
})(typeof console != "undefined" ? console : {log:function(){}}, typeof window != "undefined" ? window : exports);

//# sourceMappingURL=sample2.js.map