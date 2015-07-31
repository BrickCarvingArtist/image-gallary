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
	this.className = setting.className;
	this._init();
}
Button.prototype = {
	constructor : Button,
	_init : function(){
		this.dom = document.createElement("div");
		this.dom.className = this.className;
	},
	_highLight : function(type){
		this.dom.className = this.userObj.getStatus(type) ? this.className : this.className + " disable";
	}
};
/*上一页按钮*/
function Prev(userObj, setting){
	Prev.superclass.constructor.call(this, userObj, setting);
	this._addEvent();
}
extend(Prev, Button);
Prev.prototype._addEvent = function(){
	var _this = this;
	this.dom.onclick = function(){
		_this.userObj.setCurrentIndex(_this.userObj.getCurrentIndex() - 1);
		_this.userObj.changeContainerX();
		_this._highLight(0);
		_this.userObj.btnNext._highLight(1);
	};
};
/*下一页按钮*/
function Next(userObj, setting){
	Prev.superclass.constructor.call(this, userObj, setting);
	this._addEvent();
}
extend(Next, Button);
Next.prototype._addEvent = function(){
	var _this = this;
	this.dom.onclick = function(){
		_this.userObj.setCurrentIndex(_this.userObj.getCurrentIndex() + 1);
		_this.userObj.changeContainerX();
		_this._highLight(1);
		_this.userObj.btnPrev._highLight(0);
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
			_this.userObj.showBox.display();
		};
	}
};
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
		}
	}
};
/*实际图片*/
function ShowImage(userObj){
	this.userObj = userObj;
	this._init();
}
ShowImage.prototype = {
	constructor : ShowImage,
	_init : function(){
		this.dom = document.createElement("img");
		this.dom.className = "showImage";
		this.dom.setAttribute("src", this.userObj.userObj.receiveObj.data[this.userObj.userObj.getCurrentIndex()].imageSrc);
		this._setPosition();
	},
	_setPosition : function(){
		this.dom.onload = function(){
			this.style.marginTop = - this.height / 2 + "px";
			this.style.marginLeft = - this.width / 2 + "px";
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
		this.dom.appendChild(this.oShowImage.dom);
	},
	display : function(){
		this.dom.style.display = "block";
	},
	close : function(){
		this.dom.style.display = "none";
	}
};
/*图片展览馆*/
function ImageGallery(obj){
	this.receiveObj = obj;
	this.imageSum = this.receiveObj.data.length;
	this.maxDisplay = this.receiveObj.maxDisplay;
	this.position = document.getElementById(this.receiveObj.position);
	this.className = "imageGallery";
	this.currentIndex = 0;
	this._init();
}
ImageGallery.prototype = {
	constructor : ImageGallery,
	_init : function(){
		this._buildAll();
	},
	setCurrentIndex : function(index){
		this.currentIndex = index < 0 ? 0 : index > this.imageSum - this.maxDisplay ? this.imageSum - this.maxDisplay : index;
		this.btnPrevStatus = index < 1 ? false : true;
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
		if(this.imageSum > this.maxDisplay){
			this._buildButton();
		}
		this._buildImage();
		this._buildShowBox();
		this.position.appendChild(this.dom);
	},
	_buildButton : function(){
		this.btnPrev = new Prev(this, {
			className : "btn btnPrev"
		});
		this.btnNext = new Next(this, {
			className : "btn btnNext"
		});
		this.dom.appendChild(this.btnPrev.dom);
		this.dom.appendChild(this.btnNext.dom);
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
		this.container.style.marginLeft = - 160 * this.currentIndex + "px";
	},
	_buildShowBox : function(){
		this.showBox = new ShowBox(this);
		body.appendChild(this.showBox.dom);
	}
};