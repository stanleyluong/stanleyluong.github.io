// Imports the Google Cloud client library
const {Storage} = require('@google-cloud/storage');

// Creates a client
const storage = new Storage();

async function getBucketMetadata() {
  // The ID of your GCS bucket
  const bucketName = 'stanleyluong-1377a.appspot.com';

  try {
    // Get Bucket Metadata
    const [metadata] = await storage.bucket(bucketName).getMetadata();
    console.log("Bucket metadata:");
    console.log(JSON.stringify(metadata, null, 2));
    
    console.log("\nCORS configuration:");
    console.log(JSON.stringify(metadata.cors, null, 2));
  } catch (error) {
    console.error("Error fetching bucket metadata:", error);
  }
}

getBucketMetadata();
