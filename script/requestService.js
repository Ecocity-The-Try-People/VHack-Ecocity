import { db } from "../config/firebase";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";

const requestsCollection = collection(db, "requests");

export const getRequests = async () => {
  const snapshot = await getDocs(requestsCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addRequest = async (request) => {
  const docRef = await addDoc(requestsCollection, request);
  return { id: docRef.id, ...request };
};

export const deleteRequest = async (id) => {
  await deleteDoc(doc(db, "requests", id));
};