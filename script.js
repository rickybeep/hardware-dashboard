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

// Function to fetch collections from metadata and set up real-time listeners
async function setupRealtimeListeners() {
  try {
    console.log("Fetching collections from metadata...");
    const metadataDoc = await db.collection("metadata").doc("collections").get();

    if (!metadataDoc.exists) {
      console.error("No metadata found.");
      document.getElementById("dashboard").innerHTML = "<p>No data available.</p>";
      return;
    }

    const collections = metadataDoc.data().list || [];
    console.log("Collections:", collections);

    const dashboard = document.getElementById("dashboard");
    dashboard.innerHTML = ""; // Clear the dashboard

    // Set up real-time listeners for each collection
    collections.forEach((collectionName) => {
      db.collection(collectionName)
        .orderBy("timestamp", "desc")
        .limit(1)
        .onSnapshot((snapshot) => {
          snapshot.forEach((doc) => {
            const log = doc.data();
            const existingSection = document.getElementById(`stats-${collectionName}`);
            const newHTML = createLogHTML(collectionName, log);

            if (existingSection) {
              existingSection.innerHTML = newHTML;
            } else {
              const section = document.createElement("div");
              section.id = `stats-${collectionName}`;
              section.innerHTML = newHTML;
              dashboard.appendChild(section);
            }
          });
        });
    });
  } catch (error) {
    console.error("Error setting up real-time listeners:", error);
    document.getElementById("dashboard").innerHTML =
      "<p>Error loading data. Check console for details.</p>";
  }
}

// Set up real-time listeners on page load
setupRealtimeListeners();
