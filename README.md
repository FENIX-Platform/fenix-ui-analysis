# FENIX Analysis

```javascript
var Analysis = require('fx-analysis/start');

var analysis = new Analysis({
        el : "#analysis-container",
        ...
    });
```

# Configuration

Check `fx-analysis/config/config.js` to have a look of the default configuration.

<table>
   <thead>
      <tr>
         <th>Parameter</th>
         <th>Type</th>
         <th>Default Value</th>
         <th>Example</th>
         <th>Description</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <td>el</td>
         <td>CSS3 Selector/JavaScript DOM element/jQuery DOM element</td>
         <td> - </td>
         <td>"#container"</td>
         <td>component container</td>
      </tr>
      <tr>
         <td>cache</td>
         <td>boolean</td>
         <td>false</td>
         <td>true</td>
         <td>whether or not to use FENIX bridge cache</td>
      </tr>
      <tr>
         <td>environment</td>
         <td>string</td>
         <td>'develop'</td>
         <td>'production'</td>
         <td>Server environment</td>
      </tr>
      <tr>
         <td>lang</td>
         <td>string</td>
         <td>'EN'</td>
         <td>'IT'</td>
         <td>Multilingual</td>
      </tr>
      <tr>
         <td>catalog</td>
         <td>Object || false </td>
         <td> - </td>
         <td> - </td>
         <td>Proxied FENIX Catalog configuration. Check FENIX Catalog. `false` to do not render catalog</td>
      </tr>
      <tr>
         <td>box</td>
         <td>Object</td>
         <td> - </td>
         <td> - </td>
         <td>Proxied FENIX Visualization Box configuration. Check FENIX Visualization Box.</td>
      </tr>
   </tbody>
</table>

# API

```javascript
//This is an example
analysis.on("catalog.show", function () {...});
```

- `analysis.on(event, callback[, context])` : pub/sub 
- `analysis.dispose()` : dispose the analysis instance

# Events

- `catalog.show` : triggered when a catalog is shown
- `ready` : triggered when a instance is ready
- `add` : triggered when a new visualization box is added
- `remove` : triggered when a visualization box is removed
- `change` : triggered when 'add' or 'remove' events are triggered