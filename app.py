from flask import Flask, request, jsonify, render_template, url_for
import pandas as pd
import numpy as np
import pickle

app = Flask(__name__)

# Load the trained SVC model, LabelEncoder, and Symptoms Dictionary
with open("models/svc.pkl", 'rb') as model_file:
    loaded_svc = pickle.load(model_file)

with open("models/label_encoder.pkl", 'rb') as le_file:
    le = pickle.load(le_file)

with open("models/symptoms_dict.pkl", 'rb') as symp_file:
    symptoms_dict = pickle.load(symp_file)

# Load additional datasets
sym_des = pd.read_csv("symtoms_df.csv")
diets = pd.read_csv("diets.csv")
never_do = pd.read_csv("never_do.csv")
disease_commonality = pd.read_csv("disease_commonality.csv")
disease_complications = pd.read_csv("disease_complications.csv")
disease_homemade_solutions = pd.read_csv("disease_homemade_solutions.csv")
disease_possible_reasons = pd.read_csv("disease_possible_reasons.csv")
disease_recovery_time = pd.read_csv("disease_recovery_time.csv")
Final_description = pd.read_csv("Final_description.csv")
Final_precautions = pd.read_csv("Final_precautions.csv")
Final_workouts = pd.read_csv("Final_workouts.csv")
medications = pd.read_csv("medications.csv")

# Helper function to fetch additional information
def helper(dis):
    desc = Final_description[Final_description['Disease'] == dis]['Definition']
    desc = " ".join(desc) if not desc.empty else "Description not available."

    pre = Final_precautions[Final_precautions['Disease'] == dis]['Precautions']
    pre = [p for p in pre.values] if not pre.empty else []

    med = medications[medications['Disease'] == dis]['Medication']
    med = [m for m in med.values] if not med.empty else []

    die = diets[diets['Disease'] == dis]['Diet']
    die = [d for d in die.values] if not die.empty else []

    wrkout = Final_workouts[Final_workouts['Disease'] == dis]['Workouts']
    wrkout = [w for w in wrkout.values] if not wrkout.empty else []

    nd = never_do[never_do['Disease'] == dis]['NEVER DO']
    nd = [n for n in nd.values] if not nd.empty else []

    commonality = disease_commonality[disease_commonality['Disease'] == dis]['Commonality']
    commonality = " ".join(commonality) if not commonality.empty else "Commonality not available."

    complications = disease_complications[disease_complications['Disease'] == dis]['Complications']
    complications = [c for c in complications.values] if not complications.empty else []

    homemade_solutions = disease_homemade_solutions[disease_homemade_solutions['Disease'] == dis]['Homemade Solutions']
    homemade_solutions = [h for h in homemade_solutions.values] if not homemade_solutions.empty else []

    possible_reasons = disease_possible_reasons[disease_possible_reasons['Disease'] == dis]['Possible Reasons']
    possible_reasons = [r for r in possible_reasons.values] if not possible_reasons.empty else []

    recovery_time = disease_recovery_time[disease_recovery_time['Disease'] == dis]['Recovery Time']
    recovery_time = " ".join(recovery_time) if not recovery_time.empty else "Recovery time not available."

    return desc, pre, med, die, wrkout, nd, commonality, complications, homemade_solutions, possible_reasons, recovery_time

# Disease Prediction Function
def get_predicted_value(patient_symptoms):
    input_vector = np.zeros(len(symptoms_dict))

    for item in patient_symptoms:
        item = item.lower()
        if item in symptoms_dict:
            input_vector[symptoms_dict[item]] = 1
        else:
            print(f"Symptom '{item}' not found in symptoms_dict")

    predicted_index = loaded_svc.predict([input_vector])[0]
    predicted_disease = le.inverse_transform([predicted_index])[0]

    # Fix known mislabeling issues
    correction_dict = {
        "Peptic ulcer diseae": "Peptic ulcer disease",
        "Osteoarthristis": "Osteoarthritis",
        "Hypertension ": "Hypertension",
        "hepatitis A": "Hepatitis A",
        "Dimorphic hemmorhoids(piles)": "Dimorphic hemorrhoids (piles)",
        "Diabetes ": "Diabetes",
        "(vertigo) Paroymsal  Positional Vertigo": "(vertigo) Paroxysmal Positional Vertigo"
    }

    if predicted_disease in correction_dict:
        predicted_disease = correction_dict[predicted_disease]

    result = helper(predicted_disease)
    return predicted_disease, result

@app.route('/')
def rani():
    return render_template('rani.html')

@app.route('/test')
def test():
    username = request.args.get('username')
    return render_template('test.html', username=username or '')

@app.route('/project-timeline')
def project_timeline():
    return render_template('project-timeline.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/diagnose', methods=['POST'])
def diagnose():
    data = request.get_json()  # Get the JSON data from the request
    symptoms = data.get('symptoms', [])
    predicted_disease, result = get_predicted_value(symptoms)
    desc, pre, med, die, wrkout, nd, commonality, complications, homemade_solutions, possible_reasons, recovery_time = result
    response = {
        'predicted_disease': predicted_disease,
        'desc': desc,
        'med': med,
        'homemade_solutions': homemade_solutions,
        'die': die,
        'wrkout': wrkout,
        'nd': nd,
        'commonality': commonality,
        'complications': complications,
        'possible_reasons': possible_reasons,
        'recovery_time': recovery_time,
        'image_url': url_for('static', filename='images/a1.png')  # Example image URL
    }
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)