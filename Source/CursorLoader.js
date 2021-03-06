/**
 * Copyright (C) 2012 by Matias Niemela
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var CursorLoader;

(function() {

CursorLoader = new new Class({

  Implements : [Options,Events],

  options : {
    className : 'cursor-loader',
    innerClassName : 'cursor-loader-inner',
    registerFirstClick : true,
    zIndex : 1000,
    minDisplayTime : 500,
    offsets : {
      y : 10,
      x : 10
    },
    fxOptions : {
      link : 'cancel'
    }
  },

  x : -9999,
  y : -9999,

  init : function(options) {
    if(options) {
      this.setOptions(options);
    }
    this.buildElements();
    this.fx = new Fx.Morph(this.getElement(),this.options.fxOptions);
    this.fx.addEvents({
      'start':this.onAnimationStart.bind(this),
      'complete':this.onAnimationComplete.bind(this)
    });

    this.onMouseMove = this.onMouseMove.bind(this);
    document.addEvent('mousemove',this.onMouseMove);

    if(this.options.registerFirstClick) {
      this.onFirstClick = this.onFirstClick.bind(this);
      document.id(document.body).addEvent('click', this.onFirstClick);
    }

    this.initialized = true;
    this.setOpacity(1);
    this.hide();
  },

  setOptions : function(options) {
    this.options = Object.append(this.options,options);
  },

  onFirstClick : function(event) {
    this.onMouseMove(event);
    document.removeEvent('click',this.onFirstClick);
  },

  setMinDisplayTime : function(time) {
    this.setOptions({
      minDisplayTime : time
    });
  },

  getMinDisplayTime : function() {
    return this.options.minDisplayTime;
  },

  buildElements : function() {
    this.element = new Element('div',{
      'class' : this.options.className,
      'styles' : {
        'position' : 'fixed'
      }
    }).inject(document.body);

    this.inner = new Element('div',{
      'class' : this.options.innerClassName
    }).inject(this.getElement());

    var z = parseInt(this.element.getStyle('z-index')) || this.options.zIndex;
    this.setZIndex(z);
  },

  isInitialized : function() {
    return this.initialized;
  },

  isHidden : function() {
    return !this.isVisible();
  },

  isVisible : function() {
    return this.visible == true;
  },

  isAnimating : function() {
    return this.getAnimationDirection() != null;
  },

  isRevealing : function() {
    return this.getAnimationDirection() == 'reveal';
  },

  isDissolving : function() {
    return this.getAnimationDirection() == 'dissolve';
  },

  getAnimationDirection : function() {
    return this.animationDirection;
  },

  getElement : function() {
    return this.element;
  },

  getInnerElement : function() {
    return this.inner;
  },

  isVisible : function() {
    return this.getElement().getStyle('display') == 'block';
  },

  show : function() {
    if(!this.isInitialized()) {
      this.init();
    }
    this.setOpacity(1);
    this.getElement().setStyles({
      'display':'block'
    });
    this.position();
    this.visible = false;
    this.onShow();
  },

  hide : function() {
    if(!this.isInitialized()) {
      this.init();
    }
    if(this.isTiming()) {
      this.onEndTimer = this.hide;
    }
    else {
      this.setOpacity(0);
      this.getElement().setStyles({
        'display':'none'
      });
      this.visible = true;
      this.onHide();
    }
  },

  reveal : function() {
    if(!this.isInitialized()) {
      this.init();
    }
    if(this.isRevealing()) {
      this.startTimer();
    }
    else if(this.isHidden() || this.isDissolving()) {
      this.animationDirection = 'reveal';
      var o = this.getOpacity();
      this.getFx().set({
        'opacity':(o || 0),
        'display':'block'
      }).start({
        'opacity':1
      });
      this.onShow();
    }
  },

  dissolve : function() {
    if(!this.isInitialized()) {
      this.init();
    }
    if(this.isTiming()) {
      this.onEndTimer = this.dissolve;
    }
    else if(!this.isDissolving() && (this.isVisible() || this.isRevealing())) {
      this.animationDirection = 'dissolve';
      this.getFx().start({
        'opacity':0
      }).chain(this.hide.bind(this));
    }
  },

  setX : function(x) {
    this.x = x + this.options.offsets.x;
    this.getElement().style.left = this.x +'px';
  },

  setY : function(y) {
    this.y = y + this.options.offsets.y;
    this.getElement().style.top = this.y+'px';
  },

  getX : function() {
    return this.x;
  },
  
  getY : function() {
    return this.y;
  },

  getOpacity : function() {
    var o = this.getElement().getStyle('opacity');
    return (o == null || o == 1) ? 1 : o;
  },

  setOpacity : function(o) {
    this.getElement().setStyle('opacity',o);
  },

  getZIndex : function() {
    return this.getElement().getStyle('z-index');
  },

  setZIndex : function(z) {
    this.options.zIndex = z;
    this.getElement().setStyle('z-index',z);
  },

  getFx : function() {
    return this.fx;
  },

  position : function(x,y) {
    if(!this.isInitialized()) {
      this.init();
    }
    if(x == null && y == null) {
      x = this.getX() - this.options.offsets.x;
      y = this.getY() - this.options.offsets.y;
    }
    this.setX(x);
    this.setY(y);
  },
  
  startTimer : function() {
    if(this.isTiming()) {
      this.clearTimer();
    }
    else {
      this.timer = this.endTimer.delay(this.getMinDisplayTime(),this);
    }
  },

  clearTimer : function() {
    if(this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  },

  isTiming : function() {
    return !! this.timer;
  },

  endTimer : function() {
    this.clearTimer();
    if(this.onEndTimer) {
      this.onEndTimer.apply(this);
    }
  },

  onMouseMove : function(event) {
    if(event && event.client) {
      this.setX(event.client.x);
      this.setY(event.client.y);
    }
  },

  onAnimationStart : function() {
    this.fireEvent('animationStart');
  },

  onAnimationComplete : function() {
    var direction = this.getAnimationDirection();
    this.animationDirection = null;
    this.fireEvent('animationComplete');

    if(direction == 'reveal') {
      this.onReveal();
    }
    else {
      this.onDissolve();
    }
  },

  onShow : function() {
    this.fireEvent('show');
    if(this.options.minDisplayTime > 0) {
      this.startTimer();
    }
  },

  onHide : function() {
    this.fireEvent('hide');
  },

  onReveal : function() {
    this.fireEvent('reveal');
  },

  onDissolve : function() {
    this.fireEvent('dissolve');
  },

  destroy : function() {
    document.removeEvent('mousemove',this.onMouseMove);
    this.getElement().destroy();
    delete this.element;
    delete this.inner;
    this.initialized = false;
    this.x = -9999;
    this.y = -9999;
    this.options = Object.clone(this.defaultOptions);
  }

});

CursorLoader.defaultOptions = Object.clone(CursorLoader.options);

})(document.id,$$);
