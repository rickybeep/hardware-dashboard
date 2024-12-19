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

// Function to dynamically fetch all collections and display their latest logs
async function fetchAllCollections() {
  try {
    // Dynamically list all collections in Firestore
    const collections = await db.listCollections();

    const dashboard = document.getElementById("dashboard");
    dashboard.innerHTML = ""; // Clear previous dashboard content

    for (const collection of collections) {
      const collectionName = collection.id;

      // Fetch the latest document from each collection
      const snapshot = await db
        .collection(collectionName)
        .orderBy("timestamp", "desc")
        .limit(1)
        .get();

      snapshot.forEach((doc) => {
        const log = doc.data();
        dashboard.innerHTML += createLogHTML(collectionName, log); // Add log to dashboard
      });
    }
  } catch (error) {
    console.error("Error fetching collections:", error);
  }
}

// Function to create HTML for a log entry
function createLogHTML(collectionName, log) {
  return `
    <div class="log-entry">
      <h3>Hardware Stats - ${collectionName}</h3>
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
    </div>
  `;
}

// Fetch and display all collections on load
fetchAllCollections();
