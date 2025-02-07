const symptoms = [
    "itching", "skin_rash", "nodal_skin_eruptions", "continuous_sneezing", "shivering",
    "chills", "joint_pain", "stomach_pain", "acidity", "ulcers_on_tongue",
    "muscle_wasting", "vomiting", "burning_micturition", "spotting_urination", "fatigue",
    "weight_gain", "anxiety", "cold_hands_and_feets", "mood_swings", "weight_loss",
    "restlessness", "lethargy", "patches_in_throat", "irregular_sugar_level", "cough",
    "high_fever", "sunken_eyes", "breathlessness", "sweating", "dehydration",
    "indigestion", "headache", "yellowish_skin", "dark_urine", "nausea",
    "loss_of_appetite", "pain_behind_the_eyes", "back_pain", "constipation", "abdominal_pain",
    "diarrhoea", "mild_fever", "yellow_urine", "yellowing_of_eyes", "acute_liver_failure",
    "fluid_overload", "swelling_of_stomach", "swelled_lymph_nodes", "malaise", "blurred_and_distorted_vision",
    "phlegm", "throat_irritation", "redness_of_eyes", "sinus_pressure", "runny_nose",
    "congestion", "chest_pain", "weakness_in_limbs", "fast_heart_rate", "pain_during_bowel_movements",
    "pain_in_anal_region", "bloody_stool", "irritation_in_anus", "neck_pain", "dizziness",
    "cramps", "bruising", "obesity", "swollen_legs", "swollen_blood_vessels",
    "puffy_face_and_eyes", "enlarged_thyroid", "brittle_nails", "swollen_extremeties", "excessive_hunger",
    "extra_marital_contacts", "drying_and_tingling_lips", "slurred_speech", "knee_pain", "hip_joint_pain",
    "muscle_weakness", "stiff_neck", "swelling_joints", "movement_stiffness", "spinning_movements",
    "loss_of_balance", "unsteadiness", "weakness_of_one_body_side", "loss_of_smell", "bladder_discomfort",
    "foul_smell_of_urine", "continuous_feel_of_urine", "passage_of_gases", "internal_itching", "toxic_look_(typhos)",
    "depression", "irritability", "muscle_pain", "altered_sensorium", "red_spots_over_body",
    "belly_pain", "abnormal_menstruation", "dischromic_patches", "watering_from_eyes", "increased_appetite",
    "polyuria", "family_history", "mucoid_sputum", "rusty_sputum", "lack_of_concentration",
    "visual_disturbances", "receiving_blood_transfusion", "receiving_unsterile_injections", "coma", "stomach_bleeding",
    "distention_of_abdomen", "history_of_alcohol_consumption", "fluid_overload", "blood_in_sputum", "prominent_veins_on_calf",
    "palpitations", "painful_walking", "pus_filled_pimples", "blackheads", "scurring",
    "skin_peeling", "silver_like_dusting", "small_dents_in_nails", "inflammatory_nails", "blister",
    "red_sore_around_nose", "yellow_crust_ooze"
];

function populateDropdown(symptomId) {
    const dropdown = document.getElementById(`dropdown${symptomId}`);
    if (dropdown.innerHTML.trim() === '') {
        symptoms.forEach(symptom => {
            const symptomDiv = `<div onclick="selectSymptom(this, ${symptomId})">${symptom}</div>`;
            dropdown.innerHTML += symptomDiv;
        });
    }
}

function toggleDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

function selectSymptom(element, symptomId) {
    const input = document.getElementById(`symptom${symptomId}`);
    input.value = element.textContent;
    element.parentElement.style.display = 'none';
}

function addSymptom() {
    const symptomInputs = document.getElementById('symptomInputs');
    const newDiv = document.createElement('div');
    newDiv.className = 'symptom-group';

    const newInput = document.createElement('input');
    const symptomId = document.querySelectorAll('.symptom-group').length + 1;
    newInput.type = 'text';
    newInput.placeholder = `Symptom ${symptomId}`;
    newInput.id = `symptom${symptomId}`;
    newInput.onfocus = () => populateDropdown(symptomId);

    const newDropdownIcon = document.createElement('div');
    newDropdownIcon.className = 'dropdown-icon';
    newDropdownIcon.innerText = '▼';
    newDropdownIcon.setAttribute('onclick', `toggleDropdown('dropdown${symptomId}')`);
    
    const newDropdown = document.createElement('div');
    newDropdown.className = 'dropdown-content';
    newDropdown.id = `dropdown${symptomId}`;

    newDiv.appendChild(newInput);
    newDiv.appendChild(newDropdownIcon);
    newDiv.appendChild(newDropdown);
    symptomInputs.insertBefore(newDiv, document.getElementById('addSymptomButton'));
}

async function submitSymptoms() {
    const symptoms = [];
    document.querySelectorAll('.symptom-group input').forEach(input => {
        if (input.value) {
            symptoms.push(input.value);
        }
    });

    const currentDate = new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });

    try {
        const response = await fetch(diagnoseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ symptoms }),
        });

        if (response.ok) {
            const result = await response.json();
            document.getElementById('diseaseName').innerText = result.predicted_disease;
            document.getElementById('diseaseDescription').innerText = result.desc;
            document.getElementById('diseaseImage').src = result.image_url;

            // Update AyuScan Report Section
            document.getElementById('predictedDisease').innerText = result.predicted_disease;
            document.getElementById('diseaseDescription').innerText = result.desc;
            document.getElementById('commonality').innerText = result.commonality;
            document.getElementById('diagnosis-date').innerText = currentDate;

            // Format the lists with '|' instead of commas
            document.getElementById('medicationsList').innerText = result.med.join(' | ');
            document.getElementById('homemadeSolutionsList').innerText = result.homemade_solutions.join(' | ');
            document.getElementById('dietList').innerText = result.die.join(' | ');
            document.getElementById('workoutList').innerText = result.wrkout.join(' | ');
            document.getElementById('neverDoList').innerText = result.nd.join(' | ');
            document.getElementById('recoveryTime').innerText = result.recovery_time;
            document.getElementById('possibleReasonsList').innerText = result.possible_reasons.join(' | ');
            document.getElementById('complicationsList').innerText = result.complications.join(' | ');

            // Load pictures related to the predicted disease
            loadDiseasePictures(result.predicted_disease);
        } else {
            console.error('Failed to get prediction');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function loadDiseasePictures(disease) {
    const diseasePicturesDiv = document.getElementById('diseasePictures');
    diseasePicturesDiv.innerHTML = ''; // Clear any previous images

    const imageFormats = ['jpg', 'jpeg', 'png', 'gif'];

    for (let i = 1; i <= 3; i++) {
        imageFormats.forEach(format => {
            const sanitizedDisease = encodeURIComponent(disease.trim()).replace(/%20/g, '_');
            const imgPath = `${baseImageUrl}/${sanitizedDisease}/${i}.${format}`;
            console.log(`Trying to load image from path: ${imgPath}`); // Debugging line
            const img = new Image();
            img.src = imgPath;
            img.alt = `${disease} image ${i}`;
            img.onload = function() {
                diseasePicturesDiv.appendChild(img);
            };
            img.onerror = function() {
                console.error(`Failed to load image from path: ${imgPath}`); // Debugging line
                // Ignore errors for missing images
            };
        });
    }
}

function tryMoreSymptoms() {
    const symptomInputs = document.getElementById('symptomInputs');
    symptomInputs.innerHTML = `
        <div class="symptom-group">
            <input type="text" id="symptom1" placeholder="Symptom 1" onfocus="populateDropdown(1)">
            <div class="dropdown-icon" onclick="toggleDropdown('dropdown1')">▼</div>
            <div class="dropdown-content" id="dropdown1"></div>
        </div>
        <div class="symptom-group">
            <input type="text" id="symptom2" placeholder="Symptom 2" onfocus="populateDropdown(2)">
            <div class="dropdown-icon" onclick="toggleDropdown('dropdown2')">▼</div>
            <div class="dropdown-content" id="dropdown2"></div>
        </div>
        <div class="symptom-group">
            <input type="text" id="symptom3" placeholder="Symptom 3" onfocus="populateDropdown(3)">
            <div class="dropdown-icon" onclick="toggleDropdown('dropdown3')">▼</div>
            <div class="dropdown-content" id="dropdown3"></div>
        </div>
        <button class="add-symptom-button" id="addSymptomButton" onclick="addSymptom()">+ Add Another Symptom</button>
        <button id="submitButton" onclick="submitSymptoms()">Submit</button>
    `;
}

function downloadReport() {
    const reportContent = `
        AyuScan Report
        --------------------
        Diagnosis Date: ${document.getElementById('diagnosis-date').innerText}

        Predicted Disease: ${document.getElementById('predictedDisease').innerText}
        Description: ${document.getElementById('diseaseDescription').innerText}
        Commonality: ${document.getElementById('commonality').innerText}

        Medications: ${document.getElementById('medicationsList').innerText}
        Home Remedies: ${document.getElementById('homemadeSolutionsList').innerText}
        Diet: ${document.getElementById('dietList').innerText}
        Workouts: ${document.getElementById('workoutList').innerText}
        Things to Avoid: ${document.getElementById('neverDoList').innerText}

        Estimated Recovery Time: ${document.getElementById('recoveryTime').innerText}
        Possible Causes: ${document.getElementById('possibleReasonsList').innerText}
        Complications: ${document.getElementById('complicationsList').innerText}
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'AyuScan_Report.txt';
    link.click();
}

document.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const navLinks = document.querySelector('.nav-links');
    const loginBtn = document.querySelector('.login-btn');

    hamburgerBtn.addEventListener('click', () => {
        navLinks.classList.toggle('show-nav');
        loginBtn.classList.toggle('hide-login');
    });
});