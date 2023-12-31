import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "./setting";

// 중복검사 API
export const duplication = async (duplicationValue:string, duplicationTarget:string) => {
  const userRef = collection(db, "user");
  const q = query(
    userRef,
    where(duplicationTarget, "==", duplicationValue.toLowerCase())
  );
  const res = await getDocs(q);
  const data = res.docs.map((el) => el.data());
  if (data.length > 0) {
    return true;
  } else {
    return false;
  }
};