import { db } from '../config/firebase';
import { collection, doc, setDoc, onSnapshot } from 'firebase/firestore';

const SENSORS_COLLECTION = 'sensors';

// Push new sensor data to Firestore (simulate sensor behavior)
export const pushSensorData = async (sensor) => {
  await setDoc(doc(db, SENSORS_COLLECTION, sensor.id), sensor);
};

// Simulate sensor updates (mock data generator)
export const simulateSensors = () => {
  const mockSensors = [
    {
      id: "1",
      location: "Kuala Lumpur",
      lat: 3.1390,
      lon: 101.6869,
      threshold: 100,
    },
    {
      id: "2",
      location: "Shah Alam",
      lat: 3.0733,
      lon: 101.5185,
      threshold: 100,
    }
  ];

  // Randomize water levels and status
  mockSensors.forEach(sensor => {
    const waterLevel = Math.floor(Math.random() * 150); // 0-150cm
    const status = waterLevel > sensor.threshold ? "flooded" : "safe";
    
    pushSensorData({
      ...sensor,
      waterLevel,
      status,
      updatedAt: new Date().toISOString(),
    });
  });
};

// Listen for real-time changes in Firestore
export const subscribeToSensors = (callback) => {
  return onSnapshot(collection(db, SENSORS_COLLECTION), (snapshot) => {
    const sensors = snapshot.docs.map(doc => doc.data());
    callback(sensors);
  });
};