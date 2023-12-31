import { collection, getDocs, query, where } from "firebase/firestore";
import {
  getAuth,
  sendPasswordResetEmail,
  signOut,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword
} from "firebase/auth";
import { db } from "./setting";
import { sweetToast } from "../sweetAlert/sweetAlert";

const auth = getAuth();
// 이메일 찾기 API
export const findEmail = async (displayName: string, phone: string) => {
  const userRef = collection(db, "user");
  const q = query(
    userRef,
    where("displayName", "==", displayName),
    where("phone", "==", phone)
  );
  const res = await getDocs(q);
  const datas = res.docs.map((el) => el.data());
  if (datas.length > 0) return datas[0].email;
  else {
    sweetToast("일치하는 정보가 없습니다!", "warning");
    return false;
  }
};

// 비밀번호 변경 API
export const changePassword = async (email: string, phone: string) => {
  const userRef = collection(db, "user");
  const q = query(
    userRef,
    where("email", "==", email),
    where("phone", "==", phone)
  );
  const res = await getDocs(q);
  const datas = res.docs.map((el) => el.data());
  if (datas.length > 0) {
    sendPasswordResetEmail(auth, email)
      .then(() => {})
      .catch((error) => {
        throw error;
      });
    return true;
  } else {
    sweetToast("일치하는 정보가 없습니다!", "warning");
    return false;
  }
};

// 로그인 상태에서 비밀번호 변경 API
export async function changeLoginUserPw(
  currentPassword: string,
  newPassword: string
) {
  const user = auth.currentUser;
  if (!user || !user.email) return;
  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  // 현재 사용자의 정보를 확인하는 메서드
  // => 이것을 이용하여 현재 로그인한 유저의 비밀번화 일치하는지 판별해서
  // 일치하지 않는다면 오류가 발생하는데 이것을 예외처리해서
  // 비밀번호가 일치하지 않는다는 것을 판별
  await reauthenticateWithCredential(user, credential);
  if (currentPassword === newPassword) {
    sweetToast("현재 비밀번호와 새 비밀번호가 같습니다!", "warning");
    return false;
  }
  await updatePassword(auth.currentUser, newPassword);
  sweetToast(
    "비밀번호가 변경되었습니다. 변경사항 확인을 위해 다시 로그인 해주세요.",
    "warning"
  );
  await signOut(auth);
  
}
