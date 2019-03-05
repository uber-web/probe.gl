# StatsWidget

A widget that displays the state of a probe.gl [Stats](/docs/api-reference/log/stats.md) object to screen.

## Usage

Create a `StatsWidget` HTML element to display tracked `Stats`. Each `Stat` can
be associated with a `formatter` that indicates how it should be displayed.

```js
import StatsWidget from '@probe.gl/stats-widget';

const stats = new Stats({id: 'My Stats'});
const counter = stats.get('Counter');
const statsWidget = new StatsWidget(stats);
statsWidget.setFormatter('Counter', 'stat' => `Count: ${stat.count}`);

for (let i = 0; i < 100; i++) {
  stats.addCount(i);
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

### setFormatter

Set the formatter associated with a given stat.

`statsWidget.setFormatter(name, formatter)`

* `name` (`String`, required) - the name of the stat to associate with a formatter.
* `formatter` (`Function`, required) - function that takes a `Stat` object and returns a string.


### update

`statsWidget.update()`

Rerender the widget.
