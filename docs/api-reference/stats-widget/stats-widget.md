# StatsWidget

A widget that displays the state of a probe.gl [Stats](/docs/api-reference/log/stats.md) object to screen.

## Usage

Just inform your `Stats` instance when something happens. Then query it and get the FPS averages.
```js
import StatsWidget from '@probe.gl/stats-widget';

const stats = new Stats({id: 'My Stats'});
const statsWidget = new StatsWidget(stats);

for (let i = 0; i < 100; i++) {
  stats.bump('fps');
}
statsWidget.update();
```

## Methods

### constructor

`new StatsWidget(statsInstance, styles)`

* `statsInstance` (`Stats`) - a probe.gl [Stats](/docs/api-reference/log/stats.md) instance.
* `styles` (Object, optional)
  - `container` (DOMElement) - an element to use as the container of the widget. If not provided, a new `div` will be appended to the document as the container.
  - `containerStyle` (String) - css text for the container. Only applied if using the default container.
  - `width` (Number) - width of the widget, in pixels
  - `color` (String) - css color for the text
  - `background` (String) - css color for the background
  - `padding` (Array) - [horizontal, vertical] padding, in pixels
  - `fontFamily` (String) - css font family for the text
  - `headerSize` (Number) - font size of the header
  - `fontSize` (Number) - font size of the body
  - `lineSpacing` (Number) - spacing between lines, in pixels

### update

`statsWidget.update()`

Rerender the widget.
