import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// قراءة بيانات المفتاح من متغير البيئة
const firebaseKey = JSON.parse(process.env.FIREBASE_KEY_JSON);

// تهيئة Firebase إذا لم تكن مهيئة مسبقاً
if (!getApps().length) {
  initializeApp({
    credential: cert(firebaseKey),
  });
}

const db = getFirestore();

export default async function handler(req, res) {
  const { subid, points } = req.query;

  if (!subid || !points) {
    return res.status(400).json({ error: 'Missing subid or points' });
  }

  try {
    const userRef = db.collection('users').doc(subid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const currentPoints = userDoc.data().points || 0;
    const updatedPoints = currentPoints + parseInt(points);

    await userRef.update({ points: updatedPoints });

    return res.status(200).json({ message: 'Points updated successfully', newPoints: updatedPoints });
  } catch (error) {
    console.error('Postback Error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}
