import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// 🔒 تهيئة Firebase Admin باستخدام مفتاح الخدمة
const serviceAccount = {
  "type": "service_account",
  "project_id": "litplay-b3177",
  "private_key_id": "fa1638488e814371e60c2afaf1dc74f4c181ba27",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDRQAMrncwi78/4\nNVKkvUdP4bGHPtWEQ8lO1FA/73q1hDuYICQOzQgHz0GYAmOjDACtorz95mHDr3SV\nqX2XRpOscm+UOduhB0RPcOdfLvyNA/3twtSV4CSTXLQZOhsez8FysGXdpV8AQ8tc\nQszForzRSQRNK7Yvuv/SoJxXKGdCKKNW4xZkTV0nBsShGrcd8wYhUP/pOeGZcLd+\nBjtA74gqIA4NnDJVRcz8T46FD7u5mUAV0HArhRNwelHYZeqBBj1m+w8IGsw8fN0A\nWIFrrcmA1fElYw2b3qSs5XEGpaK2GqDGTTB7NuFiux7L/YkOkJDdlvUmqxO35COy\n7XooPxrRAgMBAAECggEAGMqTXZVrYEfGnW8O4LECvAx+vKn1gN9JoF7v95U7Vfpp\n150WPJEu5oL4D+cXkDOduHS/nLrRAi7dWpZ7SGMen6eqv9ZnhrFuVtWm+fxehGQQ\nz5y91Fh7KODqvxLm7+x4LEsJNJyRT/4YP9DzwyYj5g1XNr/rLMZEZTttbnedXUVt\nnlMJqyRj1pB0k6wJ9blIGCXnCjgqJjM8dDuRjoSd/2GUCgCes2htl6eu2I3D+wqx\nU24VZVaXNyX7wj6H5lLrl+Iy7hP3lnNdk+d7OLlpucoWd3BHzf/qAleqd1sj3OtN\nztHB+R9t/Y9YjWxbIAiVjZyaqMCTLEHaRVT5IdSPqQKBgQD1Pwo4HMJIfF7A4Ot2\n+R/27j6omFFw4bZwVveBeu60SKWFRH+3/0uwGUN+bL3qJA2VzqxSNrsZnVeuBkus\nVlY9mYMFmnfevwCFAdRLVCv6QezISZYRX7fzjDJzAH+damzMpRe1OXLHd0zq3f8t\nIvoDxBloeTeh5fTpQcSXWc/2SQKBgQDabOeaHLJgptat2OIw7HM4sdIprnZC2kJh\npSA/efoRezHhFLCX3A7LFNS/Uq1RUhEQ+K3zLAKWeVjjDtgpeX72kKqn9rzMsik4\noG4sx30MCjoH4jFhGPotjWVIuaRkSeF6Gdifw0aKE2l8A48buiSCUfVz31CGCDgE\nWC9i6OLgSQKBgBfqcN2t+EhHUJowlOXCP5q9+wBH8lE2warM4FARI+wS1Ylcd7QC\nwmfG3u0aP57wqx57zBQsYCyMSnufA4wn0zsomD1Ype3j5HIUDpbV+3/pI+UYP/kr\nw22Ns3HBj7BTK479XoV+t7G58ZdJ1NObAJSTcALfJ0yzdyG0Fy7HRF95AoGAfYPv\nYuPyrQ+ydZwX/r0hSQcGGeWjF6+MTcgxy8gwJzN/6jOVdu6BobmKt5au+fgKzpHY\ng9BafFWm+nNhTBQBHXbsWjCzNX17qoqmRR0tgmmuBzG35nAP83U5Kp1jFi5OX3fS\nv5vbQST+jMEOz4QbzreCMN+2yg6XAgga0t+43+ECgYEA5Ou5liyHh7qELgV6QgKq\njvjTD1vvB/qbQru6BYwR/A5RB6e7KDerN8Bju4RUtaHHIoY7ZK5AG4VNO2VsL30B\n17E45tL+vp50PaIg6DrKhFVXe0QtWkeyR+N6nb/V4FaPFMcLY6zPa+DJoIq/UYqh\naH6fvcvAq1Ko4ULhMzx6azM=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@litplay-b3177.iam.gserviceaccount.com",
  "client_id": "106476355611419552259",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40litplay-b3177.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};

if (!getApps().length) {
  initializeApp({ credential: cert(serviceAccount) });
}
const db = getFirestore();

export default async function handler(req, res) {
  const { subid, points } = req.query;

  if (!subid || !points || isNaN(points)) {
    return res.status(400).send("❌ بيانات غير صالحة");
  }

  try {
    await db.collection("users").doc(subid).update({
      points: parseInt(points)
    });
    return res.status(200).send("✅ تم إضافة النقاط بنجاح للمستخدم");
  } catch (error) {
    console.error("خطأ أثناء تحديث النقاط:", error);
    return res.status(500).send("❌ فشل في إضافة النقاط");
  }
}
