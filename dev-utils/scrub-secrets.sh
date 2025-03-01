#\!/bin/bash
git filter-branch --force --index-filter \
  "git ls-files -z '*config.js' | xargs -0 \
  sed -i '' -e 's/apiKey: \"[A-Za-z0-9_-]*\"/apiKey: \"YOUR_API_KEY\"/g' \
  -e 's/authDomain: \"[A-Za-z0-9_.-]*\"/authDomain: \"YOUR_AUTH_DOMAIN\"/g' \
  -e 's/projectId: \"[A-Za-z0-9_-]*\"/projectId: \"YOUR_PROJECT_ID\"/g' \
  -e 's/storageBucket: \"[A-Za-z0-9_.-]*\"/storageBucket: \"YOUR_STORAGE_BUCKET\"/g' \
  -e 's/messagingSenderId: \"[0-9]*\"/messagingSenderId: \"YOUR_MESSAGING_SENDER_ID\"/g' \
  -e 's/appId: \"[0-9:]*\"/appId: \"YOUR_APP_ID\"/g' \
  -e 's/measurementId: \"[A-Z0-9-]*\"/measurementId: \"YOUR_MEASUREMENT_ID\"/g'" \
  --tag-name-filter cat -- --all
