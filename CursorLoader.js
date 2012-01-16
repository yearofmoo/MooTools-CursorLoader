var CursorLoader;

(function() {

CursorLoader = new new Class({

  Implements : [Options,Events],

  options : {
    className : 'cursor-loader',
    innerClassName : 'cursor-loader-inner',
    minDisplayTime : 1000,
    offsets : {
      y : 10,
      x : 10
    },
    fxOptions : {
      link : 'cancel'
    }
  },

  init : function() {

    this.element = new Element('div',{
      'class' : this.options.className,
      'styles' : {
        'position' : 'absolute'
      }
    }).inject(document.body);

    this.inner = new Element('div',{
      'class' : this.options.innerClassName
    }).inject(this.getElement());

    this.fx = new Fx.Morph(this.getElement(),this.options.fxOptions);
    this.fx.addEvent('complete',function() {
      if(this.isVisible()) {
        this.onReveal();
      }
      else {
        this.onDissolve();
      }
    }.bind(this));

    document.addEvent('mousemove',function(event) {
      var x = event.page.x;
      var y = event.page.y;
      this.setX(x);
      this.setY(y);
    }.bind(this));

    this.hide();
  },

  getElement : function() {
    return this.element;
  },

  isVisible : function() {
    return this.getElement().getStyle('display') == 'block';
  },

  show : function() {
    this.getElement().setStyles({
      'display':'block'
    });
  },

  hide : function() {
    this.getElement().setStyles({
      'display':'none'
    });
  },

  reveal : function() {
    var fx = this.getFx();
    this.show();
    fx.start({
      'opacity':[0,1]
    });
  },

  dissolve : function() {
    if(this.dissolveCapabilitiesEnabled()) {
      this.getFx().start({

        'opacity':[1,0]

      }).chain(this.hide.bind(this));
    }
    else {
      this.addEvent('dissolveEnabled:once',function() {
        this.dissolve();
      }.bind(this));
    }
  },

  setX : function(x) {
    this.x = x;
    var offset = this.options.offsets.x;
    this.getElement().style.left = (offset + x)+'px';
  },

  setY : function(y) {
    this.y = y;
    var offset = this.options.offsets.y;
    this.getElement().style.top = (offset + y)+'px';
  },

  getX : function() {
    return this.x;
  },
  
  getY : function() {
    return this.y;
  },

  getFx : function() {
    return this.fx;
  },

  position : function(x,y) {
    this.setX(x);
    this.setY(y);
  },

  onReveal : function() {
    var minTime = this.options.minDisplayTime;
    if(minTime > 0) {
      this.disableDissolveCapabilities();
      (function() {
        this.enableDissolveCapabilities();
        this.fireEvent('dissolveEnabled');
      }).delay(minTime,this);
    }
  },

  onDissolve : function() {
  },

  disableDissolveCapabilities : function() {
    this.dissolveDisabled = true;
  },

  enableDissolveCapabilities : function() {
    this.dissolveDisabled = false;
  },

  dissolveCapabilitiesEnabled : function() {
    return ! this.dissolveDisabled;
  }

});

})(document.id,$$);
