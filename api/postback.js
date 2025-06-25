import admin from "firebase-admin";
import fs from "fs";
import path from "path";

// تحميل مفتاح الخدمة من الملف الآمن
const serviceAccount = JSON.parse(
  fs.readFileSync(path.resolve("secure/firebaseKey.json"), "utf8")
);

// تأكد من عدم تهيئة Firebase مرتين
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

export default async function handler(req, res) {
  const { subid, points } = req.query;

  if (!subid || !points) {
    return res.status(400).json({ success: false, message: "Missing subid or points." });
  }

  try {
    const userRef = db.collection("users").doc(subid);
    await userRef.update({
      points: admin.firestore.FieldValue.increment(parseInt(points)),
    });

    return res.status(200).json({ success: true, message: `Added ${points} points to ${subid}` });
  } catch (error) {
    console.error("Error in postback:", error);
    return res.status(500).json({ success: false, message: "Error updating points." });
  }
}
