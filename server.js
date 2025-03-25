const io = require("socket.io")(4000, {
    cors: {
      origin: "*",
    },
  });
  
  console.log("WebSocket server running on port 4000");
  
  const vehicles = [
    { id: 1, lat: 3.139, lng: 101.6869 },
    { id: 2, lat: 3.141, lng: 101.6875 },
  ];
  
  setInterval(() => {
    vehicles.forEach((vehicle) => {
      vehicle.lat += (Math.random() - 0.5) * 0.001;
      vehicle.lng += (Math.random() - 0.5) * 0.001;
      io.emit("vehicleLocation", vehicle);
    });
  }, 2000);
  