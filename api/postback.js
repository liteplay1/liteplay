import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// إعداد Firebase Admin SDK
const serviceAccount = JSON.parse(process.env.FIREBASE_KEY_JSON);

const app = initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore(app);

export default async function handler(req, res) {
  const { uid, payout } = req.query;

  if (!uid || !payout) {
    return res.status(400).send('Missing uid or payout');
  }

  try {
    const userRef = db.collection('users').doc(uid);
    const doc = await userRef.get();

    if (!doc.exists) {
      return res.status(404).send('User not found');
    }

    const userData = doc.data();
    const currentPoints = userData.points || 0;
    const newPoints = currentPoints + parseFloat(payout);

    await userRef.update({ points: newPoints });

    console.log(`✅ Added ${payout} points to user ${uid}`);
    res.status(200).send(`Points updated: ${newPoints}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating points');
  }
}
