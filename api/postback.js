const admin = require('firebase-admin');
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

module.exports = async (req, res) => {
  const uid = req.query.uid;
  const offerCash = parseFloat(req.query.points); // بالدولار

  if (!uid || isNaN(offerCash)) {
    return res.status(400).json({ error: 'Invalid request' });
  }

  // تحويل الدولار إلى نقاط: 1 دولار = 500 نقطة
  const earnedPoints = Math.floor(offerCash * 500);

  try {
    const userRef = db.collection('users').doc(uid);
    await userRef.set({ points: admin.firestore.FieldValue.increment(earnedPoints) }, { merge: true });

    res.status(200).json({ message: 'Points updated successfully', added: earnedPoints });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
