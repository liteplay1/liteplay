import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const firebaseAdminConfig = JSON.parse(process.env.FIREBASE_KEY_JSON);

const app = initializeApp({
  credential: cert(firebaseAdminConfig)
});

const db = getFirestore(app);

export default async function handler(req, res) {
  const { uid, payout } = req.query;

  if (!uid || !payout) {
    return res.status(400).send('Missing uid or payout');
  }

  try {
    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).send('User not found');
    }

    const userData = userDoc.data();
    const currentPoints = userData.points || 0;
    const newPoints = currentPoints + parseFloat(payout);

    await userRef.update({
      points: newPoints
    });

    console.log(`✅ Added ${payout} points to user: ${uid}`);
    res.status(200).send('Points updated successfully');
  } catch (error) {
    console.error('❌ Error updating points:', error);
    res.status(500).send('Internal Server Error');
  }
}
