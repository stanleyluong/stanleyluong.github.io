# Deployment Instructions

This project uses GitHub Actions to build and deploy to GitHub Pages. To ensure Firebase functionality works properly in the production environment, follow these steps:

## Setting up Firebase Environment Variables

The workflow requires Firebase configuration secrets to be added to the repository:

1. Go to your GitHub repository, click on **Settings**
2. In the left sidebar, click on **Secrets and variables** > **Actions**
3. Click on **New repository secret**
4. Add each of the following secrets individually:

| Secret Name | Description |
|-------------|-------------|
| `REACT_APP_FIREBASE_API_KEY` | Your Firebase API key |
| `REACT_APP_FIREBASE_AUTH_DOMAIN` | Your Firebase auth domain |
| `REACT_APP_FIREBASE_PROJECT_ID` | Your Firebase project ID |
| `REACT_APP_FIREBASE_STORAGE_BUCKET` | Your Firebase storage bucket |
| `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` | Your Firebase messaging sender ID |
| `REACT_APP_FIREBASE_APP_ID` | Your Firebase app ID |
| `REACT_APP_FIREBASE_MEASUREMENT_ID` | Your Firebase measurement ID (optional) |

5. To find these values, go to your Firebase console > Project settings > General > Your apps > Firebase SDK snippet > Config

## Deployment Process

The deployment process happens automatically when you push to the `master` branch. The GitHub Action will:

1. Check out your code
2. Set up Node.js
3. Install dependencies
4. Build the project using the Firebase environment variables
5. Deploy the built site to the `gh-pages` branch

If you want to trigger a manual deployment, you can go to the Actions tab in your repository and manually run the "Deploy to GitHub Pages" workflow.

## Troubleshooting

If you see Firebase errors on your deployed site:

1. Verify that all secrets are correctly set in the repository settings
2. Check that Firebase security rules allow access from your domain
3. Ensure your Firebase project is properly configured with web app support
4. Check for any CORS issues in the browser console

The site is configured to fall back to local JSON data if Firebase is unavailable, so your site will continue to function even if Firebase connectivity issues occur.