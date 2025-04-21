import { db } from "../config/firebase";
import { collection, getDocs, onSnapshot } from "firebase/firestore";

const equipmentCollection = collection(db, "equipment");

export const getEquipment = async () => {
  const snapshot = await getDocs(equipmentCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const subscribeToEquipment = (callback) => {
  return onSnapshot(equipmentCollection, (snapshot) => {
    const equipment = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(equipment);
  });
};