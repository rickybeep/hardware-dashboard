// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCV1ge5StvjCpJKn2XBcZvQ8lJlaCTEIYE",
  authDomain: "hardware-monitoring-15136.firebaseapp.com",
  projectId: "hardware-monitoring-15136",
  storageBucket: "hardware-monitoring-15136.firebasestorage.app",
  messagingSenderId: "915667032342",
  appId: "1:915667032342:web:18454ca839d3c541215837",
  measurementId: "G-XNW11F9B9C",
};


// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();

// Function to fetch collection names from metadata
async function fetchCollectionNames() {
  try {
    const metadataDoc = await db.collection("metadata").doc("collections").get();
    if (metadataDoc.exists) {
      return metadataDoc.data().list || [];
    }
    console.warn("No metadata/collections document found!");
    return [];
  } catch (error) {
    console.error("Error fetching collection names:", error);
    return [];
  }
}

// Function to display hardware stats for a collection
async function fetchAndDisplayCollection(collectionName) {
  try {
    const snapshot = await db
      .collection(collectionName)
      .orderBy("timestamp", "desc")
      .limit(1)
      .get();

    snapshot.forEach((doc) => {
      const log = doc.data();
      displayLog(collectionName, log);
    });
  } catch (error) {
    console.error(`Error fetching data for ${collectionName}:`, error);
  }
}

// Function to display a single computer's stats
function displayLog(collectionName, log) {
  const dashboard = document.getElementById("dashboard");
  const section = document.createElement("div");
  section.innerHTML = `
    <h3>${collectionName} Stats</h3>
    <p><strong>CPU Temp:</strong> ${log["CPU Temp [°C]"]}°C</p>
    <p><strong>SSD Temp:</strong> ${log["SSD Temp [°C]"]}°C</p>
    <p><strong>GPU1 Temp:</strong> ${log["GPU1 Temp [°C]"]}°C</p>
    <p><strong>GPU2 Temp:</strong> ${log["GPU2 Temp [°C]"]}°C</p>
    <p><strong>CPU Usage:</strong> ${log["CPU Usage [%]"]}%</p>
    <p><strong>SSD Read:</strong> ${log["SSD Read [%]"]}%</p>
    <p><strong>SSD Write:</strong> ${log["SSD Write [%]"]}%</p>
    <p><strong>GPU1 Usage:</strong> ${log["GPU1 Usage [%]"]}%</p>
    <p><strong>GPU2 Usage:</strong> ${log["GPU2 Usage [%]"]}%</p>
    <p><strong>Timestamp:</strong> ${log.timestamp}</p>
  `;
  dashboard.appendChild(section);
}

// Main function to fetch and display all collections
async function fetchAllCollections() {
  try {
    const collectionNames = await fetchCollectionNames();
    for (const collectionName of collectionNames) {
      await fetchAndDisplayCollection(collectionName);
    }
  } catch (error) {
    console.error("Error fetching all collections:", error);
  }
}

// Initial call
fetchAllCollections();
