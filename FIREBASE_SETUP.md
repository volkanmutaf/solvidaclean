# Firebase Setup Guide

## Deploy Firestore Security Rules

To fix the "Missing or insufficient permissions" error, you need to deploy the Firestore security rules to your Firebase project.

### Option 1: Using Firebase CLI (Recommended)

1. Install Firebase CLI globally:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project:
   ```bash
   firebase init firestore
   ```

4. Deploy the security rules:
   ```bash
   firebase deploy --only firestore:rules
   ```

### Option 2: Using Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `binoclean-admin`
3. Go to Firestore Database → Rules
4. Replace the existing rules with the content from `firestore.rules`
5. Click "Publish"

### Current Rules

The `firestore.rules` file contains:
- Allow read/write access to the `quotes` collection
- Deny access to all other collections for security

### Testing

After deploying the rules:
1. Restart your server: `node server/index.js`
2. Submit a quote through the form
3. Check the admin dashboard - it should now display the quotes

## Troubleshooting

If you still get permission errors:
1. Make sure you're using the correct Firebase project
2. Verify the rules were deployed successfully
3. Check the Firebase Console for any error messages
4. Ensure your Firebase configuration in `src/firebase.js` matches your project
