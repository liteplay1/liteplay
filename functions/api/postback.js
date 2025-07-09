export default function handler(req, res) {
  const { uid, payout } = req.query;
  console.log('User ID:', uid);
  console.log('Payout:', payout);

  res.status(200).send('OK');
}
