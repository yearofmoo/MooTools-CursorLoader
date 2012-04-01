# MooTools - CursorLoader

CursorLoader is a quick addon tool that can be used to display a  loading icon whenever an action is performed.

The loading icon will follow the mouse and when moved and when the page is scrolled.

## Requirements

- MooTools Core 1.3+ (Also works in 1.2+)

## Browser Support

- Works in all Browsers
- IE6, IE7 and IE8 may have issues with PNG images in regards to fadein and fadeout animations

## Usage 

Include the js and css files into your website.

The loading icon follows the mouse and can be used as follows:

```javascript
//initialize the loader with some custom options
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
