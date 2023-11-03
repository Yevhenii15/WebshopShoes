const express = require('express'); // Express.js for building the server
const admin = require('firebase-admin'); // Firebase Admin SDK for authentication and custom claims

// Load the Firebase service account key from a JSON file
const serviceAccount = require('../serviceAccountKey.json');

// Initialize the Firebase Admin SDK with the service account key and database URL
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://webshopshoes.firebaseio.com',
});

// Create an Express.js application
const app = express();

// Define a route to handle the root URL
app.get('/', (req, res) => {
  res.send('Hello from Firebase Admin Server!');
});

// Set the 'admin' custom claim for a specific user
app.get('/set-admin-claim', (req, res) => {
  const uid = 'iBUTkEDhxgOiLn242V725BPCYCE2'; // Admin user ID
  // Set admin privilege for the user corresponding to uid
  admin
    .auth()
    .getUser(uid)
    .then((userRecord) => {
      // Check if the user already has the admin custom claim
      if (!userRecord.customClaims || !userRecord.customClaims.admin) {
        return admin.auth().setCustomUserClaims(uid, { admin: true });
      } else {
        // User already has the admin custom claim
        return Promise.resolve();
      }
    })
    .then(() => {
      // Success
      res.send('Custom claim set for admin user');
    })
    .catch((error) => {
      console.log('Error setting custom claim:', error);
      res.status(500).send('Error setting custom claim');
    });
});

//  Verify admin status
const isAdmin = (uid) => {
  // Get the user's ID from the request query parameters
  return admin
    .auth()
    .getUser(uid)
    // Check if the user has admin privileges
    .then((userRecord) => {
      // Return true if the user is an admin, otherwise false
      return !!(userRecord.customClaims && userRecord.customClaims.admin);
    })
    .catch((error) => {
      console.error('Error fetching user data:', error);
      return false;
    });
};

// Protect the admin route with the isAdmin 
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
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});