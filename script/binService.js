import { db } from "../config/firebase";
import { collection, getDocs, onSnapshot } from "firebase/firestore";

const binsCollection = collection(db, "bins");

export const getBins = async () => {
  const snapshot = await getDocs(binsCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const subscribeToBins = (callback) => {
  return onSnapshot(binsCollection, (snapshot) => {
    const bins = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(bins);
  });
};