const revealElements = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('is-visible'));
}

const mapElement = document.querySelector('#geo-map');

if (mapElement && window.L) {
  try {
  const lat = 53.0153025;
  const lon = 18.58724;
  const schoolLat = 53.0155268;
  const schoolLon = 18.5870283;
  const liceumLat = 53.0158227;
  const liceumLon = 18.5813775;
  const kauflandLat = 53.0166039;
  const kauflandLon = 18.5894402;
  const plazaLat = 53.0153002;
  const plazaLon = 18.5614320;
  const restaurants = [
    { name: 'RabarBar', lat: 53.0150021, lon: 18.5911431, photo: 'assets/rabarbar.jpg' },
    { name: "McDonald's", lat: 53.0160366, lon: 18.5627021, photo: 'assets/mcd.jpg' },
    { name: 'KFC', lat: 53.0160930, lon: 18.5627727, photo: 'assets/kfc.jpg' },
  ];
  const gymLat = 53.017436;
  const gymLon = 18.588718;
  const sportsPlaces = [
    { name: 'Ścianka wspinaczkowa Gato', lat: 53.0177522, lon: 18.5882917, photo: 'assets/gato.jpg' },
    { name: 'Lodowisko Tor-Tor', lat: 53.0191383, lon: 18.5918682, photo: 'assets/tor-tor.jpg' },
    { name: 'Basen UMK', lat: 53.0224518, lon: 18.5809252, photo: 'assets/basen-umk.jpg' },
  ];
  const greenPlaces = [
    { name: 'Park Rudelka', lat: 53.0156678, lon: 18.5850198, photo: 'assets/rudelka.jpg' },
    { name: 'Park Zajęcze Góry', lat: 53.0139142, lon: 18.5872704, photo: 'assets/zajecze-gory.jpeg' },
    { name: 'Szkoła Leśna na Barbarce', lat: 53.0534484, lon: 18.5406824, photo: 'assets/barbarka.jpg' },
  ];
  const nearbyPlaces = [
    { name: 'Pomnik Kopernika', lat: 53.0103048, lon: 18.6049494, photo: 'assets/pomnik-kopernika.jpg' },
  ];
  const busStops = [
    { name: 'Gałczyńskiego nż. 02', lat: 53.0162644, lon: 18.5874502, photo: 'assets/mzk.jpg' },
    { name: 'Sztuki Piękne 04', lat: 53.0140357, lon: 18.5832511, photo: 'assets/mzk.jpg' },
    { name: 'Kraszewskiego 02', lat: 53.0142468, lon: 18.5925569, photo: 'assets/mzk.jpg' },
    { name: 'Kraszewskiego 01', lat: 53.0138702, lon: 18.5925828, photo: 'assets/mzk.jpg' },
    { name: 'Fałata 02', lat: 53.0153149, lon: 18.5812048, photo: 'assets/mzk.jpg' },
  ];

  const toRadians = (value) => (value * Math.PI) / 180;
  const distanceInMeters = (fromLat, fromLon, toLat, toLon) => {
    const earthRadius = 6371000;
    const dLat = toRadians(toLat - fromLat);
    const dLon = toRadians(toLon - fromLon);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(fromLat)) * Math.cos(toRadians(toLat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    return 2 * earthRadius * Math.asin(Math.sqrt(a));
  };

  const getWalkingMinutes = (targetLat, targetLon) => {
    const straightDistance = distanceInMeters(lat, lon, targetLat, targetLon);
    const routeDistance = straightDistance * 1.25;
    const metersPerMinute = 80;

    return Math.max(1, Math.round(routeDistance / metersPerMinute));
  };

  const getBikeMinutes = (targetLat, targetLon) => {
    const straightDistance = distanceInMeters(lat, lon, targetLat, targetLon);
    const routeDistance = straightDistance * 1.2;
    const metersPerMinute = 230;

    return Math.max(1, Math.round(routeDistance / metersPerMinute));
  };

  const getTravelTimeHtml = (targetLat, targetLon) => {
    const walk = getWalkingMinutes(targetLat, targetLon);
    const bike = getBikeMinutes(targetLat, targetLon);

    return '<span class="time-with-icons">' +
      `<span class="time-chip"><span class="time-icon time-icon--walk" aria-hidden="true"></span><span>ok. ${walk} min</span></span>` +
      `<span class="time-chip"><span class="time-icon time-icon--bike" aria-hidden="true"></span><span>ok. ${bike} min</span></span>` +
      '</span>';
  };

  const getLabelHtml = (name, targetLat, targetLon) => `${name} ${getTravelTimeHtml(targetLat, targetLon)}`;
  const fallbackPhoto =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='460' viewBox='0 0 800 460'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' stop-color='%23efe6d7'/%3E%3Cstop offset='100%25' stop-color='%23d9c8af'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='460' fill='url(%23g)'/%3E%3Ctext x='50%25' y='46%25' text-anchor='middle' font-family='Arial' font-size='34' fill='%23674a2d'%3EBrak zdjecia obiektu%3C/text%3E%3Ctext x='50%25' y='56%25' text-anchor='middle' font-family='Arial' font-size='22' fill='%23674a2d'%3EDodaj plik do folderu assets/%3C/text%3E%3C/svg%3E";

  const escapeHtml = (value) =>
    value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

  const createPopupHtml = (name, photo) => {
    const safeName = escapeHtml(name);
    const imageSrc = photo || fallbackPhoto;

    return `<article class="object-popup"><img src="${imageSrc}" alt="${safeName}" loading="lazy"/><h4>${safeName}</h4></article>`;
  };

  const bindPopupWithTooltipClick = (marker, name, photo) => {
    marker.bindPopup(createPopupHtml(name, photo), {
      maxWidth: 300,
      closeButton: true,
      autoPanPadding: [24, 24],
    });

    marker.on('click', () => marker.openPopup());

    marker.on('tooltipopen', () => {
      const tooltip = marker.getTooltip();
      const tooltipElement = tooltip ? tooltip.getElement() : null;

      if (!tooltipElement || tooltipElement.dataset.popupBound === 'true') {
        return;
      }

      tooltipElement.dataset.popupBound = 'true';
      tooltipElement.style.cursor = 'pointer';
      tooltipElement.addEventListener('click', () => marker.openPopup());
    });
  };

  const map = L.map('geo-map', {
    zoomControl: true,
    scrollWheelZoom: false,
  }).setView([lat, lon], 18);

  map.on('popupopen', (event) => {
    const popupRoot = event.popup.getElement();
    const image = popupRoot ? popupRoot.querySelector('.object-popup img') : null;

    if (!image) {
      return;
    }

    image.addEventListener(
      'load',
      () => {
        event.popup.update();
      },
      { once: true }
    );

    image.addEventListener(
      'error',
      () => {
        image.src = fallbackPhoto;
      },
      { once: true }
    );
  });

  const categoryLayers = {
    house: L.layerGroup().addTo(map),
    school: L.layerGroup().addTo(map),
    shop: L.layerGroup().addTo(map),
    restaurants: L.layerGroup().addTo(map),
    sports: L.layerGroup().addTo(map),
    green: L.layerGroup().addTo(map),
    bus: L.layerGroup(),
    places: L.layerGroup().addTo(map),
  };

  L.tileLayer(
    'https://mapy.geoportal.gov.pl/wss/service/PZGIK/ORTO/WMTS/StandardResolution?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ORTOFOTOMAPA&STYLE=default&TILEMATRIXSET=EPSG:3857&TILEMATRIX=EPSG:3857:{z}&TILEROW={y}&TILECOL={x}&FORMAT=image/jpeg',
    {
      minZoom: 7,
      maxZoom: 19,
      attribution: '&copy; Geoportal.gov.pl',
    }
  ).addTo(map);

  const houseIcon = L.divIcon({
    className: 'house-marker',
    html: '<span aria-hidden="true">🏠</span>',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });

  const houseMarker = L.marker([lat, lon], { icon: houseIcon }).addTo(categoryLayers.house);
  bindPopupWithTooltipClick(houseMarker, 'Dom - ul. Bema 66A', 'assets/main_photo.jpg');

  const schoolMarker = L.circleMarker([schoolLat, schoolLon], {
    radius: 6,
    color: '#ffffff',
    weight: 2,
    fillColor: '#1e6fd8',
    fillOpacity: 1,
  })
    .addTo(categoryLayers.school)
    .bindTooltip(getLabelHtml('Szkoła Podstawowa nr. 7', schoolLat, schoolLon), {
      permanent: true,
      direction: 'right',
      offset: [10, 0],
      className: 'school-label',
      interactive: true,
    });
  bindPopupWithTooltipClick(schoolMarker, 'Szkoła Podstawowa nr. 7', 'assets/sp7.jpg');

  const liceumMarker = L.circleMarker([liceumLat, liceumLon], {
    radius: 6,
    color: '#ffffff',
    weight: 2,
    fillColor: '#1e6fd8',
    fillOpacity: 1,
  })
    .addTo(categoryLayers.school)
    .bindTooltip(getLabelHtml('V Liceum Ogólnokształcące', liceumLat, liceumLon), {
      permanent: true,
      direction: 'right',
      offset: [10, 0],
      className: 'school-label',
      interactive: true,
    });
  bindPopupWithTooltipClick(liceumMarker, 'V Liceum Ogólnokształcące', 'assets/v-liceum.jpg');

  const kauflandMarker = L.circleMarker([kauflandLat, kauflandLon], {
    radius: 6,
    color: '#ffffff',
    weight: 2,
    fillColor: '#d4372a',
    fillOpacity: 1,
  })
    .addTo(categoryLayers.shop)
    .bindTooltip(getLabelHtml('Kaufland', kauflandLat, kauflandLon), {
      permanent: true,
      direction: 'right',
      offset: [10, 0],
      className: 'shop-label',
      interactive: true,
    });
  bindPopupWithTooltipClick(kauflandMarker, 'Kaufland', 'assets/kaufland.jpg');

  const plazaMarker = L.circleMarker([plazaLat, plazaLon], {
    radius: 6,
    color: '#ffffff',
    weight: 2,
    fillColor: '#d4372a',
    fillOpacity: 1,
  })
    .addTo(categoryLayers.shop)
    .bindTooltip(getLabelHtml('Toruń Plaza', plazaLat, plazaLon), {
      permanent: true,
      direction: 'right',
      offset: [10, 0],
      className: 'shop-label',
      interactive: true,
    });
  bindPopupWithTooltipClick(plazaMarker, 'Toruń Plaza', 'assets/plaza.jpg');

  restaurants.forEach((place) => {
    const restaurantMarker = L.circleMarker([place.lat, place.lon], {
      radius: 6,
      color: '#ffffff',
      weight: 2,
      fillColor: '#cc4b15',
      fillOpacity: 1,
    })
      .addTo(categoryLayers.restaurants)
      .bindTooltip(getLabelHtml(place.name, place.lat, place.lon), {
        permanent: true,
        direction: 'right',
        offset: [10, 0],
        className: 'restaurant-label',
        interactive: true,
      });

    bindPopupWithTooltipClick(restaurantMarker, place.name, place.photo);
  });

  const gymMarker = L.circleMarker([gymLat, gymLon], {
    radius: 6,
    color: '#ffffff',
    weight: 2,
    fillColor: '#7b3fd1',
    fillOpacity: 1,
  })
    .addTo(categoryLayers.sports)
    .bindTooltip(getLabelHtml('Siłownia (hala widowiskowo-sportowa)', gymLat, gymLon), {
      permanent: true,
      direction: 'right',
      offset: [10, 0],
      className: 'gym-label',
      interactive: true,
    });
  bindPopupWithTooltipClick(gymMarker, 'Siłownia (hala widowiskowo-sportowa)', 'assets/silownia.jpg');

  sportsPlaces.forEach((place) => {
    const sportsMarker = L.circleMarker([place.lat, place.lon], {
      radius: 6,
      color: '#ffffff',
      weight: 2,
      fillColor: '#7b3fd1',
      fillOpacity: 1,
    })
      .addTo(categoryLayers.sports)
      .bindTooltip(getLabelHtml(place.name, place.lat, place.lon), {
        permanent: true,
        direction: 'right',
        offset: [10, 0],
        className: 'gym-label',
        interactive: true,
      });

    bindPopupWithTooltipClick(sportsMarker, place.name, place.photo);
  });

  greenPlaces.forEach((place) => {
    const greenMarker = L.circleMarker([place.lat, place.lon], {
      radius: 6,
      color: '#ffffff',
      weight: 2,
      fillColor: '#1e8b58',
      fillOpacity: 1,
    })
      .addTo(categoryLayers.green)
      .bindTooltip(getLabelHtml(place.name, place.lat, place.lon), {
        permanent: true,
        direction: 'right',
        offset: [10, 0],
        className: 'place-label',
        interactive: true,
      });

    bindPopupWithTooltipClick(greenMarker, place.name, place.photo);
  });

  busStops.forEach((stop) => {
    const busMarker = L.circleMarker([stop.lat, stop.lon], {
      radius: 5,
      color: '#ffffff',
      weight: 2,
      fillColor: '#0a8a63',
      fillOpacity: 1,
    })
      .addTo(categoryLayers.bus)
      .bindTooltip(getLabelHtml(`Przystanek MZK: ${stop.name}`, stop.lat, stop.lon), {
        permanent: true,
        direction: 'top',
        offset: [0, -8],
        className: 'bus-label',
        interactive: true,
      });

    bindPopupWithTooltipClick(busMarker, `Przystanek MZK: ${stop.name}`, stop.photo);
  });

  nearbyPlaces.forEach((place) => {
    const placeMarker = L.circleMarker([place.lat, place.lon], {
      radius: 6,
      color: '#ffffff',
      weight: 2,
      fillColor: '#8d5a13',
      fillOpacity: 1,
    })
      .addTo(categoryLayers.places)
      .bindTooltip(getLabelHtml(place.name, place.lat, place.lon), {
        permanent: true,
        direction: 'right',
        offset: [10, 0],
        className: 'place-label',
        interactive: true,
      });

    bindPopupWithTooltipClick(placeMarker, place.name, place.photo);
  });

  const filterButtons = document.querySelectorAll('.map-filter-btn[data-map-category]');

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const category = button.dataset.mapCategory;
      const layer = categoryLayers[category];

      if (!layer) {
        return;
      }

      if (map.hasLayer(layer)) {
        map.removeLayer(layer);
        button.classList.remove('is-active');
        button.setAttribute('aria-pressed', 'false');
      } else {
        layer.addTo(map);
        button.classList.add('is-active');
        button.setAttribute('aria-pressed', 'true');
      }
    });
  });
  } catch (error) {
    console.error('Blad inicjalizacji mapy:', error);
    const details = error && error.message ? ` (${error.message})` : '';
    mapElement.innerHTML =
      `<div class="map-error">Nie udalo sie zaladowac mapy${details}. Otworz mape interaktywna z linku ponizej.</div>`;
  }
} else if (mapElement) {
  mapElement.innerHTML =
    '<div class="map-error">Brak biblioteki mapy. Otworz mape interaktywna z linku ponizej.</div>';
}
