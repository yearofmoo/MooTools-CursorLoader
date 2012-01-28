describe("this should test the functionality of the CursorLoader",function() {

  it("should exist",function() {
    expect(CursorLoader).toBeTruthy();
  });

  describe("testing the functionality of the class",function() {

    beforeEach(function() {
      if(CursorLoader.isInitialized()) {
        CursorLoader.destroy();
      }
      CursorLoader.init();
    });

    it("it should create the element properly",function() {
      var elm = CursorLoader.getElement();
      expect(elm).toBeTruthy();
    });

    it("should place the element container in the dom",function() {
      var id = 'tester';
      var elm = CursorLoader.getElement();
      elm.id = id;
      expect($(id)).toEqual(elm);
    });

    it("should hide the element when started",function() {
      expect(CursorLoader.isHidden()).toBe(true);
    });

    it("it should be visible when show is called",function() {
      CursorLoader.show();
      expect(CursorLoader.isVisible()).toBe(true);
    });

    it("it should be hidden when hide is called",function() {
      CursorLoader.show();
      CursorLoader.hide();
      expect(CursorLoader.isVisible()).toBe(false);
    });

    it("should contain an inner element",function() {
      expect(CursorLoader.getInnerElement()).toBeTruthy();
    });

    it("the inner element should be within the outer",function() {
      var id = 'testing-elm-id';
      var outer = CursorLoader.getElement();
      outer.id = id;
      var inner = CursorLoader.getInnerElement();
      expect(inner.getParent().id).toBe(id);
    });

    it("it should set the x/y coordinates properly",function() {
      var x = 200;
      var y = 400;
      var offsets = CursorLoader.options.offsets;
      CursorLoader.position(x,y);
      expect(CursorLoader.getX()).toEqual(x + offsets.x);
      expect(CursorLoader.getY()).toEqual(y + offsets.y);
    });

    it("should destroy itself properly",function() {
      CursorLoader.destroy();
      expect(CursorLoader.getElement()).toBeUndefined();
    });

    it("should destroy itself properly",function() {
      CursorLoader.destroy();
      expect(CursorLoader.getElement()).toBeUndefined();
      expect(CursorLoader.getInnerElement()).toBeUndefined();
    });

    it("should reset the x/y coordinates",function() {
      CursorLoader.destroy();
      var x = CursorLoader.getX();
      var y = CursorLoader.getY();
      CursorLoader.init();
      CursorLoader.setX(0);
      CursorLoader.setY(0);
      CursorLoader.destroy();
      expect(CursorLoader.getX()).toBe(x);
      expect(CursorLoader.getY()).toBe(y);
    });

    it("should be transparent when hidden",function() {
      CursorLoader.hide();
      expect(CursorLoader.getOpacity()).toBe(0);
    });

    it("should be fully visible when displayed",function() {
      CursorLoader.show();
      expect(CursorLoader.getOpacity()).toBe(1);
    });

    it("should follow the mouse",function() {
      var X = 20, Y = 20;
      CursorLoader.options.offsets = { x : 0, y : 0 };
      var eventMock = {
        stop : function() { },
        page : {
          x : X,
          y : Y
        }
      };
      document.fireEvent('mousemove',eventMock);
      expect(CursorLoader.getX()).toBe(X);
      expect(CursorLoader.getY()).toBe(Y);
    });

    it("should erase all the events and options when destroyed",function() {
      CursorLoader.destroy();
      expect(CursorLoader.options).toEqual(CursorLoader.defaultOptions);
    });

    it("should not contain any older options",function() {
      CursorLoader.options.tester = true;
      CursorLoader.destroy();
      CursorLoader.init();
      expect(CursorLoader.options.tester).toBeUndefined();
    });

  });

});
