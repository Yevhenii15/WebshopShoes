const express = require('express');
const admin = require('firebase-admin');

const serviceAccount = require('../serviceAccountKey.json');

const firebaseConfig = {
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://webshopshoes.firebaseio.com',
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://webshopshoes.firebaseio.com',
});

const app = express();

app.get('/', (req, res) => {
  res.send('Hello from Firebase Admin Server!');
});

// Middleware to set the 'admin' custom claim for a specific user
app.get('/set-admin-claim', (req, res) => {
  const uid = 'iBUTkEDhxgOiLn242V725BPCYCE2'; // Replace with the desired user's UID

  admin
    .auth()
    .getUser(uid)
    .then((userRecord) => {
      if (!userRecord.customClaims || !userRecord.customClaims.admin) {
        return admin.auth().setCustomUserClaims(uid, { admin: true });
      } else {
        console.log('User is already an admin.');
        return Promise.resolve();
      }
    })
    .then(() => {
      console.log('Custom claim set for admin user');
      res.send('Custom claim set for admin user');
    })
    .catch((error) => {
      console.log('Error setting custom claim:', error);
      res.status(500).send('Error setting custom claim');
    });
});

// Middleware to verify admin status
const isAdmin = (uid) => {
  return admin
    .auth()
    .getUser(uid)
    .then((userRecord) => {
      return !!(userRecord.customClaims && userRecord.customClaims.admin);
    })
    .catch((error) => {
      console.error('Error fetching user data:', error);
      return false;
    });
};

// Protect the admin route with the isAdmin middleware
app.get('/admin', (req, res) => {
  // Get the user's UID from the query parameters
  const uid = req.query.uid;

  // Check if the user with the provided UID is an admin
  isAdmin(uid)
    .then((isAdmin) => {
      if (isAdmin) {
        // User is an admin, grant access to the admin page
        res.send('Welcome to the admin page!');
      } else {
        // User is not an admin, send an unauthorized response
        res.status(403).send('Access forbidden. You are not an admin.');
      }
    })
    .catch((error) => {
      // Error occurred while checking admin status
      console.error('Error checking admin status:', error);
      res.status(500).send('Internal Server Error');
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
