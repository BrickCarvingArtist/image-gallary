'use strict';
var body = document.body;
function extend(subClass, supClass){
	var F = function(){};
	F.prototype = supClass.prototype;
	subClass.prototype = new F();
	subClass.prototype.constructor = subClass;
	subClass.superclass = supClass.prototype;
	if(supClass.prototype.constructor === Object.prototype.constructor){
		supClass.prototype.constructor = supClass;
	}
};
/*图片展览*/
/*按钮*/
function Button(userObj, setting){
	this.userObj = userObj;
	this.type = setting.type;
	this.className = setting.className;
	this._init();
}
Button.prototype = {
	constructor : Button,
	_init : function(){
		this.container = document.createElement("div");
		this.container.className = this.className;
		this._highLight();
	},
	_highLight : function(){
		this.container.className = this.userObj.getStatus(this.type) ? this.className : this.className + " disable";
	}
};
/*上一页按钮*/
function Prev(userObj, setting){
	Prev.superclass.constructor.call(this, userObj, setting);
	this._build();
	this._addEvent();
}
extend(Prev, Button);
Prev.prototype._build = function(){
	this.fg = document.createElement("div");
	this.fg.className = "fg prev";
	this.bg = document.createElement("div");
	this.bg.className = "bg prev"
	this.container.appendChild(this.bg);
	this.container.appendChild(this.fg);
};
Prev.prototype._addEvent = function(){
	var _this = this;
	this.fg.onclick = function(){
		_this.userObj.setCurrentIndex(_this.userObj.getCurrentIndex() - 1);
		_this.userObj.changeContainerX();
		_this._highLight();
		_this.userObj.btnNext._highLight();
	};
};
/*下一页按钮*/
function Next(userObj, setting){
	Prev.superclass.constructor.call(this, userObj, setting);
	this._build();
	this._addEvent();
}
extend(Next, Button);
Next.prototype._build = function(){
	this.fg = document.createElement("div");
	this.fg.className = "fg next";
	this.bg = document.createElement("div");
	this.bg.className = "bg next"
	this.container.appendChild(this.bg);
	this.container.appendChild(this.fg);
};
Next.prototype._addEvent = function(){
	var _this = this;
	this.fg.onclick = function(){
		_this.userObj.setCurrentIndex(_this.userObj.getCurrentIndex() + 1);
		_this.userObj.changeContainerX();
		_this._highLight();
		_this.userObj.btnPrev._highLight();
	};
};
/*缩略图片*/
function AImage(userObj, index, setting){
	this.userObj = userObj;
	this.index = index;
	this.receiveObj = setting;
	this._init();
	this._addEvent();
}
AImage.prototype = {
	constructor : AImage,
	_init : function(){
		this.dom = document.createElement("img");
		this.dom.setAttribute("src", this.receiveObj.imageSrc);
		this._setTitle();
	},
	_setTitle : function(){
		if(this.receiveObj.title){
			this.dom.setAttribute("title", this.receiveObj.title);
		}
	},
	_addEvent : function(){
		var _this = this;
		this.dom.onclick = function(){
			console.log(_this.index)
			_this.userObj.showBox.display(_this.index);
		};
	}
};
/*实际图片*/
function RealImage(userObj, index, setting){
	RealImage.superclass.constructor.call(this, userObj, index, setting);
	this._setPosition();
}
extend(RealImage, AImage);
RealImage.prototype._setPosition = function(){
	if(this.dom.complete){
		this.dom.style.marginTop = - this.dom.height / 2 + "px";
		this.dom.style.marginLeft = - this.dom.width / 2 + "px";
	}else{
		this.dom.onload = function(){
			this.style.marginTop = - this.height / 2 + "px";
			this.style.marginLeft = - this.width / 2 + "px";
		};
	}
};
RealImage.prototype.display = function(){
	this.dom.style.display = "block";
};
RealImage.prototype.close = function(){
	this.dom.style.display = "none";
};
RealImage.prototype._addEvent = function(){};
/*阴影*/
function Shadow(userObj){
	this.userObj = userObj;
	this._init();
	this._addEvent();
}
Shadow.prototype = {
	constructor : Shadow,
	_init : function(){
		this._build();
	},
	_build : function(){
		this.dom = document.createElement("div");
		this.dom.className = "shadow";
	},
	_addEvent : function(){
		var _this = this;
		this.dom.onclick = function(){
			_this.userObj.close();
			_this.userObj.oShowImage.oImage[_this.userObj.getImageIndex()].close();
		}
	}
};
/*实际图片库*/
function ShowImage(userObj){
	this.userObj = userObj;
	this._init();
}
ShowImage.prototype = {
	constructor : ShowImage,
	_init : function(){
		this._build();
	},
	_build : function(){
		this.oImage = new Array(this.userObj.userObj.imageSum);
		for(var i = 0; i < this.userObj.userObj.imageSum; i++){
			this.oImage[i] = new RealImage(this, i, this.userObj.userObj.receiveObj.data[i]);
		}
	}
};
/*图片投影展览*/
function ShowBox(userObj){
	this.userObj = userObj;
	this._init();
}
ShowBox.prototype = {
	constructor : ShowBox,
	_init : function(){
		this.dom = document.createElement("div");
		this.dom.className = "showBox";
		this._buildAll();
	},
	_buildAll : function(){
		this._buildShadow();
		this._buildShowImage();
	},
	_buildShadow : function(){
		this.oShadow = new Shadow(this);
		this.dom.appendChild(this.oShadow.dom);
	},
	_buildShowImage : function(){
		this.oShowImage = new ShowImage(this);
		for(var i = 0; i < this.userObj.imageSum; i++){
			this.dom.appendChild(this.oShowImage.oImage[i].dom);
		}
	},
	display : function(index){
		this.imageIndex = index;
		this.oShowImage.oImage[this.imageIndex].display();
		this.dom.style.display = "block";
	},
	close : function(){
		this.dom.style.display = "none";
	},
	getImageIndex : function(){
		return this.imageIndex;
	}
};
/*图片展览馆*/
function ImageGallery(obj){
	this.receiveObj = obj;
	this.imageSum = this.receiveObj.data.length;
	this.maxDisplay = this.receiveObj.maxDisplay;
	this.position = document.getElementById(this.receiveObj.position);
	this.className = "imageGallery";
	this.setCurrentIndex(0);
	this._init();
}
ImageGallery.prototype = {
	constructor : ImageGallery,
	_init : function(){
		this._buildAll();
	},
	setCurrentIndex : function(index){
		this.currentIndex = index < 0 ? 0 : index > this.imageSum - this.maxDisplay ? this.imageSum - this.maxDisplay : index;
		this.btnPrevStatus = index < 1 || index === 0 ? false : true;
		this.btnNextStatus = index > this.imageSum - this.maxDisplay - 1 ? false : true;
	},
	getCurrentIndex : function(){
		return this.currentIndex;
	},
	getStatus : function(type){
		return type ? this.btnNextStatus : this.btnPrevStatus;
	},
	_buildAll : function(){
		this.dom = document.createElement("div");
		this.dom.className = this.className;
		this.container = document.createElement("div");
		this.container.className = "container";
		this._buildImage();
		if(this.imageSum > this.maxDisplay){
			this._buildButton();
		}
		this._buildShowBox();
		this.position.appendChild(this.dom);
	},
	_buildButton : function(){
		this.btnPrev = new Prev(this, {
			type : 0,
			className : "btn btnPrev"
		});
		this.btnNext = new Next(this, {
			type : 1,
			className : "btn btnNext"
		});
		this.dom.appendChild(this.btnPrev.container);
		this.dom.appendChild(this.btnNext.container);
	},
	_buildImage : function(){
		this.oImage = new Array(this.imageLen);
		var _this = this;
		for(var i = 0; i < this.imageSum; i++){
			this.oImage[i] = new AImage(this, i, this.receiveObj.data[i]);
			this.container.appendChild(this.oImage[i].dom);
		}
		this.dom.appendChild(this.container);
	},
	changeContainerX : function(){
		this.container.style.left = 25 - 160 * this.currentIndex + "px";
	},
	_buildShowBox : function(){
		this.showBox = new ShowBox(this);
		body.appendChild(this.showBox.dom);
	}
};