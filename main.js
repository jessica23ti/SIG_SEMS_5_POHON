import './style.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { Vector as VectorSource } from 'ol/source.js';
import VectorLayer from 'ol/layer/Vector';
import GeoJSON from 'ol/format/GeoJSON.js';
import { fromLonLat } from 'ol/proj.js';
import { Icon, Style } from 'ol/style.js';
import Overlay from 'ol/Overlay.js';
// Untuk menampilkan polygon Riau dengan data .json
const riau = new VectorLayer({
  source: new VectorSource({
    format: new GeoJSON(),
    url: 'data/polygon_riau.json'
  }),
  style: {
    'fill-color': [
      'interpolate',
      ['linear'],
      ['get', 'OBJECTID'],
      1,
      '#ffff33', // SESUAIKAN DENGAN YANG KALIAN PUNYA
      1283, //SESUAI DENGAN OBJECT ID 
      '#3358ff',
    ],
  },
});
// end.

const banjir = new VectorLayer({
  source: new VectorSource({
    format: new GeoJSON(),
    url: 'data/banjir.json'
  }),
  style: new Style({
    image: new Icon(({
      anchor: [0.5, 46],
      anchorXUnits: 'flaticon',
      anchorYUnits: 'pixels',
      src: 'icon/flood.png',
      width: 32,
      height: 32
    }))
  })
});
// const pohon_peneduh = new VectorLayer({
//   source: new VectorSource({
//     format: new GeoJSON(),
//     url: 'data/pohon_peneduh.json'
//   }),
//   style: new Style({
//     image: new Icon(({
//       anchor: [0.5, 46],
//       anchorXUnits: 'flaticon',
//       anchorYUnits: 'pixels',
//       src: 'icon/tree.png',
//       width: 32,
//       height: 32
//     }))
//   })
// });

const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM(),
    }), riau, banjir
  ],
  view: new View({
    center: fromLonLat([101.438309, 0.510440]),
    zoom: 8,
  }),
});

const popup = new Overlay({
  element: document.getElementById('popup'),
  positioning: 'top-center',
  stopEvent: false,
  offset: [0, -15]
});
map.addOverlay(popup);
map.on('singleclick', function (evt) {
  const feature = map.forEachFeatureAtPixel(evt.pixel, function (feat) {
    return feat;
  });
  if (feature) {
    const coordinates = feature.getGeometry().getCoo
    rdinates();
    let content = '<h3>Informasi Fitur</h3>';
    content += '<p>Nama Daerah: <strong>' + feature.
      get('Nama_Pemetaan') +
      '</strong></p>' + '<p>Jumlah Korban: ' + feat
    ure.get('Jumlah_Korban') + '</p>';

    document.getElementById('popup-content').innerHTML = content;

    popup.setPosition(coordinates);
  } else {
    popup.setPosition(undefined);
  }
});



const featureOverlay = new VectorLayer({
  source: new VectorSource(),
  map: map,
  style: {
    'stroke-color': 'rgba(255, 255, 255, 0.7)',
    'stroke-width': 2,
  },
});

let highlight;
const highlightFeature = function (pixel) {
  const feature = map.forEachFeatureAtPixel(pixel, function (feature) {
    return feature;
  });
  if (feature !== highlight) {
    if (highlight) {
      featureOverlay.getSource().removeFeature(highlight);
    }
    if (feature) {
      featureOverlay.getSource().addFeature(feature)
        ;
    }
    highlight = feature;
  }
};

const displayFeatureInfo = function (pixel) {
  const feature = map.forEachFeatureAtPixel(pixel, function (feat) {
    return feat;
  });
  const info = document.getElementById('info');
  if (feature) {
    info.innerHTML = feature.get('DESA') || '&nbsp;';
  } else {
    info.innerHTML = '&nbsp;';
  }
};

map.on('pointermove', function (evt) {
  if (evt.dragging) {
    popup.setPosition(undefined);
  }
  const pixel = map.getEventPixel(evt.originalEvent);
  highlightFeature(pixel);
  displayFeatureInfo(pixel);
});

const polygonLayerCheckbox = document.getElementById('polygon');
const pointLayerCheckbox = document.getElementById('point');
polygonLayerCheckbox.addEventListener('change', function () {
  riau.setVisible(polygonLayerCheckbox.checked);
});
pointLayerCheckbox.addEventListener('change', function () {
  banjir.setVisible(pointLayerCheckbox.checked);
});


// const container = document.getElementById('popup');

// const content_element = document.getElementById('popup-content');

// const closer = document.getElementById('popup-closer');
// //Create overlay popup

// const overlay = new Overlay({
//   element: container,
//   autoPan: {
//     animation: {
//       duration: 250,
//     },
//   },
// });
// //End.


// map.addOverlay(overlay); //untuk menambah overlay
// // JS for click popup
// map.on('singleclick', function (evt) {
//   const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
//     return feature;
//   });
//   if (!feature) {
//     return;
//   }
//   const coordinate = evt.coordinate;
//   const content = '<h3>Tempat Lokasi: ' + feature.get('LOKASI') +
//     '</h3>' + '<p>Suhu Sekitar Pohon : ' + feature.get('SUHU SEKITAR \nPOHON') + '</p>' + '<p>Suhu Diluar Pohon: ' + feature.get('SUHU DILUAR \nPOHON') + '</p>' + '<p>Kondisi Pohon: ' + feature.get('KONDISI') + '</p>';
//   content_element.innerHTML = content;
//   overlay.setPosition(coordinate);
// });

// //Click handler to hide popup
// closer.onclick = function () {
//   overlay.setPosition(undefined);
//   closer.blur();
//   return false;
// };
