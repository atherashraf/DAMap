# Digital Arz Map

A react component for visualizing and analysis data from DigitalArzNode  Developed on top of Openlayers.

To add a Map panel on any page use following component
```angular2html
import MapView from "damap/lib/ol-map/containers/MapView"
<MapView uuid={uuid} isMap={true} isDesigner={false} />
```
where 
    uuid is unique identifier for getting Map from DigitalArzNode

for Managing Layer in DigitalArz Node use following component
```angular2html
import LayerInfo from "damap/lib/admin/containers/LayerInfo"
<LayerInfo />
```

for Managing Map in DigitalArzNode
```angular2html
import LayerInfo from "damap/lib/admin/containers/MapInfo"
<MapInfo />
```

author : Ather Ashraf
