MooTools - CursorLoader
-----------------------

CursorLoader is a quick addon tool that can be used to display a  loading icon whenever an action is performed.

The loading icon will follow the mouse and when moved and when the page is scrolled.

## Requirements

- MooTools Core 1.3+ (Also works in 1.2+)

## Browser Support

- Works in all Browsers
- IE6, IE7 and IE8 may have issues with PNG images in regards to fadein and fadeout animations

## Usage 

Include the js and css files into your website.

```html
<!-- CSS -->
<link rel="stylesheet" type="text/css" href="/path/to/CursorLoader.css" />

<!-- JS -->
<script type="text/javascript" src="/path/to/MooTools-core.js"></script>
<script type="text/javascript" src="/path/to/CursorLoader.js"></script>
```

The loading icon follows the mouse and can be used as follows:

```javascript
//initialize the loader with some custom options (this is optional)
CursorLoader.init({ ... });

//fade in
CursorLoader.reveal();

//fade out
CursorLoader.dissolve();

//show quickly
CursorLoader.show();

//hide quickly
CursorLoader.hide();

//destroy for good
CursorLoader.destroy();
```

## Customization

### CSS

The Loading graphics can be changed by adding the following CSS styles

```css
/* This is the outer image which is the frame */
.cursor-loader {
  background-image:url("/path/to/loader-frame.png");
}

/* This is the inner image which is the loading animation */
.cursor-loader-inner {
  background-image:url("/path/to/loader-animation.png");
}
```

### JavaScript

The following options are set by default in the init method and can be overridden by passing in an options object:

```javascript
//the init method must be called first before any of the other methods are called and can only be called once
CursorLoader.init({
  className : 'cursor-loader', //outer element className
  innerClassName : 'cursor-loader-inner', //inner element className
  registerFirstClick : true, //whether or not to pay attention to the first click to register the (X/Y) coords
  zIndex : 1000, //the Z-index of the cursor-loader div element
  minDisplayTime : 500, //the minimum amount of the time that the reveal method will show the element for if a dissolve method is called right after
  offsets : {
    x : 10, //x offset
    y : 10  //y offset
  },
  fxOptions : { //fx options for the reveal and dissolve animations
    link : 'cancel'
  }
});
```

## More Info + Demo

More information can be found at:

http://yearofmoo.com/CursorLoader
