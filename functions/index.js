const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.cpagripPostback = functions.https.onRequest(async (req, res) => {
  const uid = req.query.uid;
  const payout = parseFloat(req.query.payout);

  if (!uid || !payout) {
    return res.status(400).send("Missing parameters");
  }

  try {
    const userRef = admin.firestore().collection("users").doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).send("User not found");
    }

    const currentPoints = userDoc.data().points || 0;
    const newPoints = currentPoints + payout;

    await userRef.update({ points: newPoints });

    res.status(200).send(`Points updated for UID: ${uid}, +${payout}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Error");
  }
});
