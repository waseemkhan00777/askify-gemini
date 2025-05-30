import React, { useState } from "react";

const UserLocation = () => {
  const [location, setLocation] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          console.log(latitude, longitude);
          setLocation({ latitude, longitude });
          setError(null);
        },
        err => {
          setError(err.message);
          setLocation(null);
        },
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div>
      <button onClick={getUserLocation}>Get Current Location</button>
      {location ? (
        <div>
          <p>Latitude: {location.latitude}</p>
          <p>Longitude: {location.longitude}</p>
        </div>
      ) : (
        error && <p>Error: {error}</p>
      )}
    </div>
  );
};

export default UserLocation;
