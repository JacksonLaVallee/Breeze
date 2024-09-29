import React, { useEffect, useRef, useState } from "react";
import FloatingList from "../FloatingList/FloatingList";
import "./GoogleMapComponent.css";
import axios from "axios";

// Default center of the map
const defaultCenter = {
  lat: 36.16449484460973,
  lng: -86.78347303808229,
};

function GoogleMapComponent({ places = [] }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const overlaysRef = useRef({});
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [center, setCenter] = useState(defaultCenter);

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const response = await axios.get(
          "https://breeze-theta.vercel.app/get-zip"
        );
        const zipCode = response.data;

        const geoResponse = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${zipCode}&key=AIzaSyCocc-1XF4aJSLYk3mMSyoQqhipLpf9NLo`
        );
        console.log("geoResponse:", geoResponse.data);

        if (geoResponse.data.results.length > 0) {
          const location = geoResponse.data.results[0].geometry.location;
          setCenter({ lat: location.lat, lng: location.lng });
        } else {
          console.error("Failed to fetch coordinates from the zip code");
        }
      } catch (error) {
        console.error(
          "Error fetching coordinates from backend or Google Geocoding API:",
          error
        );
      }
    };

    fetchCoordinates();
  }, []);

  useEffect(() => {
    if (window.google && mapRef.current) {
      if (!mapInstanceRef.current) {
        mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
          center: center,
          zoom: 13,
          mapTypeControl: false, // Disable map type options
          streetViewControl: false, // Disable street view control
          fullscreenControl: false, // Disable fullscreen control
        });
      } else {
        mapInstanceRef.current.setCenter(center);
      }
    }
  }, [center]);

  useEffect(() => {
    if (mapInstanceRef.current) {
      Object.values(overlaysRef.current).forEach(({ overlayDiv, overlay }) => {
        overlayDiv.parentNode && overlayDiv.parentNode.removeChild(overlayDiv);
        overlay.setMap(null);
      });
      overlaysRef.current = {};

      places.forEach((place) => {
        const marker = new window.google.maps.Marker({
          position: { lat: place.location.lat, lng: place.location.lng },
          map: mapInstanceRef.current,
          title: place.name,
        });

        const overlayDiv = document.createElement("div");
        overlayDiv.className = "place-image-container";
        overlayDiv.innerHTML = `<img src="${place.photoUrl}" alt="${place.name}" class="place-image" />`;
        overlayDiv.style.display = "none"; // Initially hide all overlays
        overlayDiv.style.zIndex = "1000"; // Ensure overlays appear above the map

        const overlay = new window.google.maps.OverlayView();
        overlay.onAdd = function () {
          const panes = this.getPanes();
          panes.overlayLayer.appendChild(overlayDiv);
        };
        overlay.draw = function () {
          const projection = this.getProjection();
          const position = projection.fromLatLngToDivPixel(
            new window.google.maps.LatLng(
              place.location.lat,
              place.location.lng
            )
          );
          overlayDiv.style.left = position.x + "px";
          overlayDiv.style.top = position.y + "px";
          overlayDiv.style.position = "absolute";
        };
        overlay.onRemove = function () {
          overlayDiv.parentNode.removeChild(overlayDiv);
        };
        overlay.setMap(mapInstanceRef.current);

        overlaysRef.current[place.id] = { overlayDiv, marker, overlay };

        marker.addListener("click", () => {
          setSelectedPlace(place.id);
        });
      });
    }
  }, [places]);

  useEffect(() => {
    Object.keys(overlaysRef.current).forEach((key) => {
      const { overlayDiv, overlay } = overlaysRef.current[key];
      if (overlayDiv) {
        overlayDiv.style.display = key === selectedPlace ? "block" : "none";

        if (key === selectedPlace && overlay) {
          overlay.draw();
        }
      }
    });
  }, [selectedPlace]);

  const handlePlaceClick = (placeId) => {
    setSelectedPlace(placeId);
    const selectedOverlay = overlaysRef.current[placeId];
    if (selectedOverlay && selectedOverlay.marker) {
      mapInstanceRef.current.setCenter(selectedOverlay.marker.getPosition());
    }
  };

  return (
    <div className="map-layout">
      <FloatingList
        places={places}
        selectedPlace={selectedPlace}
        onSelectPlace={handlePlaceClick}
      />

      <div ref={mapRef} className="map-container" />
    </div>
  );
}

export default React.memo(GoogleMapComponent);
