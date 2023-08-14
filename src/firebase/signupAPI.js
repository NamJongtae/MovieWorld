import { collection, doc, setDoc } from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { db, storage } from "./setting";
import {
  uploadBytes,
  getDownloadURL,
  ref as storageRef,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

const auth = getAuth();
// 회원가입 API
export const signup = async (displayName, file, email, password, phone) => {
  const res = await createUserWithEmailAndPassword(auth, email, password);
  const fileName = file && `${uuidv4()}_${file.name}`;
  const uploadImgURLRes =
    file &&
    (await uploadBytes(
      storageRef(storage, `images/profile/${fileName}`),
      file
    ));
  const photoURL = file && (await getDownloadURL(uploadImgURLRes.ref));
  await updateProfile(res.user, {
    displayName,
    photoURL,
  });

  const user = collection(db, "user");
  await setDoc(doc(user, `${res.user.uid}`), {
    uid: res.user.uid,
    email: res.user.email,
    displayName: res.user.displayName,
    photoURL: res.user.photoURL || "",
    phone,
    likeList: [],
    reviewList: [],
    reportList: [],
    photoFileName: fileName || "",
  });
  return {
    uid: res.user.uid,
    email: res.user.email,
    displayName: res.user.displayName,
    photoURL: res.user.photoURL || "",
  };
};
