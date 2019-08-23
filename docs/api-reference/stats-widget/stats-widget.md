# StatsWidget

A widget that displays the state of a probe.gl [Stats](/docs/api-reference/log/stats.md) object to screen.

## Usage

Create a `StatsWidget` HTML element to display tracked `Stats`. Each `Stat` can
be associated with a `formatter` that indicates how it should be displayed.

```js
import React, {Component} from 'react';
import {Stats} from 'probe.gl';
import StatsWidget from '@probe.gl/stats-widget';

class App extends Component {
  componentDidMount() {
    this._stats = new Stats({
      id: 'My Stats'
    });
    
    this._statsWidget = new StatsWidget(this._stats, {
      container: this._containerRef
    });

    this.setState({intervalId: setInterval(this._update, 300)});
  }

  componentWillUnmount() {
    // use intervalId from the state to clear the interval
    clearInterval(this.state.intervalId);
  }

  _update() {
    // create a stat with name and type
    const counter = this._stats.get('Counter', 'count');
    counter.incrementCount();
    this._statsWidget.update();  
  }

  render() {
    return (<div ref={_ => this._containerRef = _}/>);
  }
}

```

## Methods

### constructor

`new StatsWidget(stats, options)`

* `stats` (`Stats`) - a probe.gl [Stats](/docs/api-reference/log/stats.md) instance.
* `options`: (`Object`)
  - `title` (`String`) - header text for the widget. Defaults to the `id` of the `Stats` object.
  - `framesPerUpdate` (`Number`) - number of times `update` must be called before the widget is re-rendered. Allows the application
   to call `update` each frame with re-renders occurring at a slower rate.
  - `container` (DOMElement) - DOM element to use as container for the widget. Will be created internally if not provided.
  - `css` (`Object`) - css properties to apply to the container `div` of the widget. Two special keys can be used to modify the
   style of nested elements:
    + `header` (`Object`) - css properties to apply to the header `div` of the widget.
    + `item` (`Object`) - css properties to apply to the individual item `div`s for each stat displayed in the widget.
  - `formatters` (`Object`) - text formatters to use to display a stat. Keys are the stat's `id`. Value can either be
   a function that takes a single `stat` object as argument, or one of the following strings:
    + `count`: Display as a simple count.
    + `averageTime`: Display average time.
    + `totalTime`: Display total time.
    + `fps`: Display Hz as a frame rate.
    + `memory`: Display count as a memory measurement.
    `resetOnUpdate` (`Object`) - whether the a stat should be reset each time the widget is re-rendered. Keyed by the stat's `id`.

### setStats

Set Stats object rendered by the widget.

Parameters:

* `stats` () - [`Stats`](https://github.com/uber-web/probe.gl/blob/master/docs/api-reference/log/stats.md) Object.


### setFormatter

Set the formatter associated with a given stat.

`statsWidget.setFormatter(name, formatter)`

* `name` (`String`, required) - the name of the stat to associate with a formatter.
* `formatter` (`Function`, required) - function that takes a `Stat` object and returns a string.


### update

`statsWidget.update()`

Rerender the widget.
