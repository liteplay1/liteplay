import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

const serviceAccount = {
  type: "service_account",
  project_id: "litplay-b3177",
  private_key_id: "9bd160da2a95307b9e3787b5c764138e87c124d4",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDYaj1GF+2wMDPm\n078UHHvD8ObkREezSqUpz783itm4veiMwg3T3f3pdiVY3ISUA1YNZJn58MuW7gMe\nszeAuS64ywJ97N97vHwstj7kQqBGBrUEOFf3oyT2nASnB80JmRDFZEONvPvaa0YO\nVagg2gcHrUbQcv9mk7zgV8dWR5nlzQcPUFTscqFgCpns8dt94eY1xMg7TWPPEP24\nMYOz3rG2HTwK8RMJ97cnecvFmeQAwNpO+h38AD485XoSjSIkLxlxqqzyEHHsWMIy\nNU5YH3Z3iclJLMQb7S3URgsTaVOyzyEdrkDPRKAl2Q38Vr6GvX8Ero8r7kQ76Ogh\nCN4uZVAVAgMBAAECggEAVaMYsxt16YHxj9Zbpuwsh5lU7KAeVVLk75ovOx3dUO8J\nTmXdzehq+Q7Q8Yx1hBKb4znbel2wWn29y1C01mGxHNvslQL+Xnr0EkddtLqurHcr\n+0sGeE5dKp8LckMyfilNSycFWlmduc04UCTSHonYPU/ylTrkWOV+WLIzha9YtWeF\nqSvuALo+5t11OnKDMQjL2/RvCiO1v0y6BuPEGk9GyP4Qn6AgdNR602bteSwlBpD6\n1+H5GUU7cnmN7lMQlQxnr07HE9Omazx4mpKA2yEjOcdFDkYiGydKnykragIM3IwK\nLUvsC7baLe9eZj+1EwjPjq+7C9BLLsJNMAbJgzlgEwKBgQDtKONis7nW/3PXtnab\nM1R6ccxWyawuRl9q8Mt5QHqIbesWFi6/VX1T5+1UonZicckYKmHTLjwzz5eDd5Yq\nVjg5lnPPlCDyzKVMyjpIH3Pd6jeedtcAn2yrWdYyYOF4LnyxwdlOygCAl9/mAC1s\nfWBgIqjmgDRJScctUs+UdScgnwKBgQDpm3dYDu8JnMa2hqjXQQ0jYYesG9/YIrZj\nKwDKOMLhoLbX67gnV+UTheUNdT4vwIg1HdRxmxj43RunlgEfJBZoBTPjviomZ93y\nW6KkM7R90PCrSF2RcgO/S+Pu9KUO8ig6RFoJwova14PFpRq9/OMu6L3fKlp9QfeF\nJridJtJOywKBgAO/vbh1tt5bM22ZiM5zRUaaPeyxS3N/0UpTfCPyjP1TH4A94YdM\nxqpo5CuOVejAe7lSEjHQbUs0YOTHIyyQKFtgsXv6j3rHGWXZXIp/VMmRRkfPAR8V\nZhZfWS96sJXBxl7Y/aJtNwzRWcy8+/rXEIr0gU8Df9AYxnlE8dsa7v9pAoGBAKcc\ngdlKhZEYx8YWun2RmXZv9IAYSJ7y5go23w/KXw7Myz/W7hum8sZuiBaCgoPidQ2a\nUzkZvFl6wqe11QOT6ztqTV5j0P88Wjdfeg+AtWMzrpa448aCC1AzV9C+zbzNWh2k\ne8xzkVxxw2AF5gV2/IW4FOup/qWQJSLpOjOha9zVAoGAU8GNv6y6XjMfz0wXQubS\nuk7rNaVWN67kEXVOymJeEjWPJBmRMhQ9zYPM4rxJxipdJwFMzDJMrQ5eRkk9wvbF\nOdbTiR7IteEIBhw4a7kRLwMMGa4gOb/+kaGQODL66pLBnSRJThP9ojgPZrkJHZRG\nYL+cQY2NFOQSjPM2HeLQXSE=\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-fbsvc@litplay-b3177.iam.gserviceaccount.com",
  client_id: "106476355611419552259",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40litplay-b3177.iam.gserviceaccount.com"
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
