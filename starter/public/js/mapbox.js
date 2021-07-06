/* eslint-disable */

// the above line will disableeslint for this entire file

export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1Ijoic2FyYXRoa3VtYXJrcyIsImEiOiJja3FoemR2NnIwNHZpMnV0ajBrcDNob2MxIn0.yt-9zuxlO-nfN41v15_gAQ';

  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/sarathkumarks/ckqi4k32r08sc17rrqxrantx7',
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extend map bounds to include current location
    bounds.extend(loc.coordinates);

    map.fitBounds(bounds, {
      padding: {
        top: 200,
        bottom: 150,
        left: 100,
        right: 100,
      },
    });
  });
};
