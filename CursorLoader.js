var CursorLoader;

(function() {

CursorLoader = new new Class({

  Implements : [Options,Events],

  options : {
    className : 'cursor-loader',
    innerClassName : 'cursor-loader-inner',
    minDisplayTime : 0,
    offsets : {
      y : 10,
      x : 10
    },
    fxOptions : {
      link : 'cancel'
    }
  },

  x : 0,
  y : 0,

  init : function() {
    this.buildElements();
    this.fx = new Fx.Morph(this.getElement(),this.options.fxOptions);
    this.fx.addEvents({
      'start':this.onAnimationStart.bind(this),
      'complete':this.onAnimationComplete.bind(this)
    });

    document.addEvent('mousemove',this.onMouseMove.bind(this));

    this.setX(-9999);
    this.setY(-9999);

    this.initialized = true;
    this.hide();
  },

  buildElements : function() {
    this.element = new Element('div',{
      'class' : this.options.className,
      'styles' : {
        'position' : 'absolute'
      }
    }).inject(document.body);

    this.inner = new Element('div',{
      'class' : this.options.innerClassName
    }).inject(this.getElement());
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

  isVisible : function() {
    return this.getElement().getStyle('display') == 'block';
  },

  show : function() {
    if(!this.isInitialized()) {
      this.init();
    }
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
    this.getElement().setStyles({
      'display':'none'
    });
    this.visible = true;
    this.onHide();
  },

  reveal : function() {
    if(!this.isInitialized()) {
      this.init();
    }
    if(this.isHidden() && !this.isRevealing()) {
      this.animationDirection = 'reveal';
      this.show();
      this.getFx().start({
        'opacity':[0,1]
      });
    }
  },

  dissolve : function() {
    if(!this.isInitialized()) {
      this.init();
    }
    if(this.isVisible() && !this.isDissolving()) {
      this.animationDirection = 'dissolve';
      this.getFx().start({
        'opacity':[1,0]
      }).chain(this.hide.bind(this));
    }
  },

  setX : function(x) {
    x += this.options.offsets.x;
    this.x = x;
    if(this.isVisible()) {
      this.getElement().style.left = x +'px';
    }
  },

  setY : function(y) {
    y += this.options.offsets.y;
    this.y = y;
    if(this.isVisible()) {
      this.getElement().style.top = y+'px';
    }
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
    if(this.timer) {
      this.clearTimer();
    }
    else {
      var $empty = function() { };
      this._hide = this.hide;
      this._dissolve = this.dissolve;
      this.dissolve = this.hide = $empty;
    }
    this.timer = this.endTimer.delay(this.options.minDisplayTime,this);
  },

  clearTimer : function() {
    if(this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  },

  endTimer : function() {
    this.clearTimer();
    this.hide = this._hide;
    this.dissolve = this._dissolve;
    delete this._hide;
    delete this._dissolve;
  },

  onMouseMove : function(event) {
    this.setX(event.page.x);
    this.setY(event.page.y);
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
  }

});

})(document.id,$$);
