import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
};

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount)
  });
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

    const userRef = db.collection("users").doc(user_id);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return res.status(404).send("User not found");
    }

    await userRef.update({
      points: FieldValue.increment(10)
    });

    res.status(200).send("✅ Points added successfully!");
  } catch (error) {
    console.error("❌ Error in postback:", error);
    res.status(500).send("Internal Server Error");
  }
}
