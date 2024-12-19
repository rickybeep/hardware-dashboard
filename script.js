// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCV1ge5StvjCpJKn2XBcZvQ8lJlaCTEIYE",
  authDomain: "hardware-monitoring-15136.firebaseapp.com",
  projectId: "hardware-monitoring-15136",
  storageBucket: "hardware-monitoring-15136.firebasestorage.app",
  messagingSenderId: "915667032342",
  appId: "1:915667032342:web:18454ca839d3c541215837",
  measurementId: "G-XNW11F9B9C"
};

// Initialize Firebase
console.log("Initializing Firebase...");
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();
console.log("Firestore initialized.");

// Function to fetch the latest hardware log
async function fetchLatestLog() {
  console.log("Fetching the latest hardware log...");
  try {
    // Get the latest entry from Firestore
    const snapshot = await db.collection("hwinfo_logs")
                             .orderBy("timestamp", "desc")
                             .limit(1)
                             .get();

    console.log("Snapshot received:", snapshot);
    snapshot.forEach(doc => {
      const log = doc.data();
      console.log("Latest log data:", log);
      displayLog(log); // Pass the data to a function that updates the UI
    });
  } catch (error) {
    console.error("Error fetching log:", error);
  }
}

// Function to display hardware stats
function displayLog(log) {
  console.log("Displaying log data on the dashboard...");
  const dashboard = document.getElementById("dashboard");
  if (!dashboard) {
    console.error("Dashboard element not found!");
    return;
  }
  dashboard.innerHTML = `
    <h3>Latest Hardware Stats</h3>
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
}

// Real-time listener for Firestore updates
console.log("Setting up Firestore listener...");
db.collection("hwinfo_logs")
  .orderBy("timestamp", "desc")
  .limit(1)
  .onSnapshot(snapshot => {
    console.log("Real-time Firestore update received:", snapshot);
    snapshot.forEach(doc => {
      const log = doc.data();
      console.log("Real-time log data:", log);
      displayLog(log); // Update the UI when new data arrives
    });
  });

// Initial call to fetch the latest log
fetchLatestLog();
console.log("Initial log fetch triggered.");
