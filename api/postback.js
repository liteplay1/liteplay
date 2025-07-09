import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = JSON.parse(process.env.FIREBASE_KEY_JSON);

// ✅ تأكد من عدم تكرار التهيئة
if (!global.firebaseApp) {
  global.firebaseApp = initializeApp({
    credential: cert(serviceAccount)
  });
}

const db = getFirestore(global.firebaseApp);

export default async function handler(req, res) {
  const { uid, payout } = req.query;

  console.log('User ID:', uid);
  console.log('Payout:', payout);

  if (!uid || !payout) {
    return res.status(400).send('Missing parameters');
  }

  try {
    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      const userData = userDoc.data();
      const currentPoints = userData.points || 0;
      const newPoints = currentPoints + parseFloat(payout);

      await userRef.update({ points: newPoints });

      console.log(`✅ Added ${payout} points to user ${uid}`);
      res.status(200).send('Points updated successfully');
    } else {
      console.log('❌ User not found');
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error('❌ Error updating points:', error);
    res.status(500).send('Internal Server Error');
  }
}
