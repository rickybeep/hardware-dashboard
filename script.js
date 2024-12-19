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

// Function to create HTML for a log entry
function createLogHTML(collectionName, log) {
  return `
    <h3>Hardware Stats for ${collectionName}</h3>
    <p><strong>CPU Temp:</strong> ${log["CPU Temp [°C]"] || "N/A"}°C</p>
    <p><strong>SSD Temp:</strong> ${log["SSD Temp [°C]"] || "N/A"}°C</p>
    <p><strong>GPU1 Temp:</strong> ${log["GPU1 Temp [°C]"] || "N/A"}°C</p>
    <p><strong>GPU2 Temp:</strong> ${log["GPU2 Temp [°C]"] || "N/A"}°C</p>
    <p><strong>CPU Usage:</strong> ${log["CPU Usage [%]"] || "N/A"}%</p>
    <p><strong>SSD Read:</strong> ${log["SSD Read [%]"] || "N/A"}%</p>
    <p><strong>SSD Write:</strong> ${log["SSD Write [%]"] || "N/A"}%</p>
    <p><strong>GPU1 Usage:</strong> ${log["GPU1 Usage [%]"] || "N/A"}%</p>
    <p><strong>GPU2 Usage:</strong> ${log["GPU2 Usage [%]"] || "N/A"}%</p>
    <p><strong>Timestamp:</strong> ${log.timestamp || "N/A"}</p>
    <hr />
  `;
}

// Function to fetch all collections dynamically
async function fetchAllCollections() {
  try {
    console.log("Fetching all collections...");

    // Dynamically list all collections in Firestore
    const collections = await db.listCollections();
    console.log("Collections found:", collections);

    const dashboard = document.getElementById("dashboard");
    dashboard.innerHTML = ""; // Clear previous dashboard content

    if (collections.length === 0) {
      dashboard.innerHTML = "<p>No collections found.</p>";
      return;
    }

    for (const collection of collections) {
      const collectionName = collection.id;
      console.log("Fetching latest log for collection:", collectionName);

      // Fetch the latest document from each collection
      const snapshot = await db
        .collection(collectionName)
        .orderBy("timestamp", "desc")
        .limit(1)
        .get();

      if (snapshot.empty) {
        dashboard.innerHTML += `<p>No data found for ${collectionName}.</p>`;
        continue;
      }

      snapshot.forEach((doc) => {
        const log = doc.data();
        console.log("Log data for", collectionName, log);
        dashboard.innerHTML += createLogHTML(collectionName, log);
      });
    }
  } catch (error) {
    console.error("Error fetching collections:", error);
    const dashboard = document.getElementById("dashboard");
    dashboard.innerHTML = "<p>Error loading data. Check console for details.</p>";
  }
}

// Initial call to fetch all collections
fetchAllCollections();
