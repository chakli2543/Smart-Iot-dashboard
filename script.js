document.addEventListener('DOMContentLoaded', function() {

const toggleInputs = document.querySelectorAll('.toggle-input');
const controlCards = document.querySelectorAll('.control-card');
const toastContainer = document.getElementById('toastContainer');
const powerOffBtn = document.getElementById('powerOffBtn');

// 🔥 FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyD5a5n1j8aKxTHRfAfOOAdnXdSn8mkpGe8",
  authDomain: "smart-factory-iot-dashboard.firebaseapp.com",
  databaseURL: "https://smart-factory-iot-dashboard-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "smart-factory-iot-dashboard",
  storageBucket: "smart-factory-iot-dashboard.firebasestorage.app",
  messagingSenderId: "307396796776",
  appId: "1:307396796776:web:51d0bde6fc9c864187f6dd"
};

// ✅ Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// DEVICE LIST
const devices = ["fan", "light", "conveyor", "plug"];

// ----------------------
// CONTROL → FIREBASE
// ----------------------
toggleInputs.forEach((input, index) => {

    input.addEventListener('change', function() {

        const card = controlCards[index];
        const device = card.dataset.equipment;
        const isOn = this.checked ? 1 : 0;

        db.ref("/" + device).set(isOn);

        if (isOn) {
            card.classList.add('on');
            showToast(device + " turned ON", "success");
        } else {
            card.classList.remove('on');
            showToast(device + " turned OFF", "info");
        }

    });

});

// ----------------------
// FIREBASE → UI
// ----------------------
devices.forEach(device => {

    db.ref("/" + device).on("value", snapshot => {

        const value = snapshot.val();

        const card = document.querySelector(`[data-equipment="${device}"]`);
        if (!card) return;

        const toggle = card.querySelector('.toggle-input');

        toggle.checked = value === 1;

        if (value === 1) {
            card.classList.add('on');
        } else {
            card.classList.remove('on');
        }

    });

});

// ----------------------
// SENSOR DATA
// ----------------------
db.ref("/sensor").on("value", snapshot => {

    const data = snapshot.val();
    if (!data) return;

    document.getElementById("temp").textContent = data.temperature + "°C";
    document.getElementById("humidity").textContent = data.humidity + "%";

});

// ----------------------
// POWER OFF ALL (FIXED)
// ----------------------
powerOffBtn.addEventListener('click', function() {

    // Atomic update (best method)
    const updates = {
        "/fan": 0,
        "/light": 0,
        "/conveyor": 0,
        "/plug": 0
    };

    db.ref().update(updates);

    // Update UI instantly
    devices.forEach(device => {

        const card = document.querySelector(`[data-equipment="${device}"]`);
        if (card) {
            const toggle = card.querySelector('.toggle-input');
            toggle.checked = false;
            card.classList.remove('on');
        }

    });

    showToast("All equipment powered OFF", "warning");

});

// ----------------------
// CONTACT FORM
// ----------------------
const contactForm = document.querySelector('.contact-form');

contactForm.addEventListener('submit', function(e) {

    e.preventDefault();

    const name = this.querySelector('input').value;
    const message = this.querySelector('textarea').value;

    if(name && message){
        alert("Thank you " + name + "! Message sent.");
        this.reset();
        showToast("Message sent successfully","success");
    }

});

// ----------------------
// TOAST FUNCTION
// ----------------------
function showToast(message, type="info"){

    const toast = document.createElement("div");

    toast.className = "toast " + type;
    toast.textContent = message;

    toastContainer.appendChild(toast);

    setTimeout(()=>{
        toast.remove();
    },3000);

}

// ----------------------
// FORCE SHOW CONTENT
// ----------------------
document.querySelectorAll("section").forEach(sec => {
    sec.classList.add("visible");
});

});
