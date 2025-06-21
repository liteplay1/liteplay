import { initializeApp, getApps } from "firebase/app";
import { getFirestore, doc, getDoc, updateDoc, increment } from "firebase/firestore";

// بيانات Firebase الخاصة بك
const firebaseConfig = {
  apiKey: "AIzaSyCx91hDU6vBwpzCt2q1jXDJZV5txrZNafE",
  authDomain: "litplay-b3177.firebaseapp.com",
  projectId: "litplay-b3177",
  storageBucket: "litplay-b3177.firebasestorage.app",
  messagingSenderId: "201526393824",
  appId: "1:201526393824:web:c8ab6afa0bcca902be4985",
};

// تهيئة Firebase مرة واحدة فقط
if (!getApps().length) {
  initializeApp(firebaseConfig);
}

const db = getFirestore();

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const { user_id, status } = req.query;

    if (!user_id || status !== "completed") {
      return res.status(400).send("Missing or invalid parameters");
    }

    const userRef = doc(db, "users", user_id);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return res.status(404).send("User not found");
    }

    await updateDoc(userRef, {
      points: increment(10) // غير القيمة حسب عدد النقاط التي تريد إضافتها
    });

    console.log(`✅ Added 10 points to user: ${user_id}`);
    res.status(200).send("Points added successfully");

  } catch (error) {
    console.error("❌ Error in postback handler:", error);
    res.status(500).send("Internal Server Error");
  }
}
