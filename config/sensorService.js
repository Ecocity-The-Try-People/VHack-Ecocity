import { db } from '../config/firebase';
import { collection, doc, setDoc, onSnapshot } from 'firebase/firestore';

const SENSORS_COLLECTION = 'sensors';

export const pushSensorData = async (sensor) => {
  await setDoc(doc(db, SENSORS_COLLECTION, sensor.id), sensor);
};

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
    },

    {
      id: "3",
      location: "Georgetown",
      lat: 5.416665,
      lon: 100.3166654,
      threshold: 100,
    },

    {
      id: "4",
      location: "Butterworth",
      lat: 5.4380,
      lon: 100.3882,
      threshold: 100,
    },

    {
      id: "5",
      location: "Petaling Jaya",
      lat: 3.083333,
      lon: 101.6499974,
      threshold: 100,
    },
  ];

  mockSensors.forEach(sensor => {
    const waterLevel = Math.floor(Math.random() * 150);
    const status = waterLevel > sensor.threshold ? "flooded" : "safe";
    
    pushSensorData({
      ...sensor,
      waterLevel,
      status,
      updatedAt: new Date().toISOString(),
    });
  });
};

export const subscribeToSensors = (callback) => {
  return onSnapshot(collection(db, SENSORS_COLLECTION), (snapshot) => {
    const sensors = snapshot.docs.map(doc => doc.data());
    callback(sensors);
  });
};