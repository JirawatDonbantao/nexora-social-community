# Firebase Authentication setup

Nexora reads Firebase Web configuration from the local .env file. Copy .env.example when setting up a new machine, then fill in the values from Firebase Console. Do not commit .env.

## Google Sign-In

1. In Firebase Console, open Build → Authentication → Sign-in method.
2. Enable Google, choose a Project support email, then save.
3. In Authentication → Settings → Authorized domains, add localhost for development and add the deployed domain before publishing.
4. Restart the Vite development server after changing .env.

Google Sign-In creates a Firebase Authentication user on the first successful sign-in. Test with an account you control. Never add a Service Account JSON, password, OAuth token, or Firebase Admin SDK to this frontend project.
