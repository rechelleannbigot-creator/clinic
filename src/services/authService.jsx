import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

export const login = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password);
};

