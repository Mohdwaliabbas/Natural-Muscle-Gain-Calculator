document.addEventListener("DOMContentLoaded", () => {
    const calculateBtn = document.getElementById("calculateBtn");

    function getTimeBeforeTrainingValue(months) {
        if (months >= 0 && months <= 6) return 11.2;
        else if (months <= 12) return 9.1;
        else if (months <= 18) return 7.1;
        else if (months <= 24) return 6.1;
        else if (months <= 30) return 5.1;
        else if (months <= 36) return 4.1;
        else if (months <= 42) return 3.1;
        else if (months <= 48) return 1.8;
        else if (months <= 54) return 1.2;
        else if (months <= 60) return 0.92;
        else return 0.8;
    }

    function getAgeValue(age) {
        if (age >= 16 && age < 29) return 1.0;
        else if (age < 36) return 1.15;
        else if (age < 41) return 1.46;
        else if (age < 46) return 1.69;
        else return 2.44;
    }

    const workoutMap = { 
        "Low (Not Consistent)": 1.69, 
        "Medium (Consistent but not Focused)": 1.22, 
        "High (Consistent plus Focused and Training till failure)": 1.0 
    };
    const dietMap = { 
        "Poor (Low protein and calorie diet (≥0.5X and <1X gram protein))": 1.30, 
        "Average (Good protein and calorie diet (≥1X and <1.5X gram protein))": 1.15, 
        "Good (High protein and calorie diet (>1.5X gram protein))": 1.0 
    };
    const geneticsMap = { 
        "Hard Muscle Gainer": 1.57, 
        "Average Muscle Gainer": 1.22, 
        "Easy Muscle Gainer": 1.0 
    };

    // ----------------- Muscle Gain Calculator -----------------
    calculateBtn.addEventListener("click", () => {
        const ageRaw = document.getElementById("age").value.trim();
        const trainingRaw = document.getElementById("trainingTime").value.trim();
        const resultTimeRaw = document.getElementById("resultTime").value.trim();
        const workout = document.getElementById("workoutQuality").value;
        const diet = document.getElementById("dietQuality").value;
        const genetics = document.getElementById("geneticsType").value;

        const weightRaw = document.getElementById("currentWeight")?.value.trim();
        const currentFatRaw = document.getElementById("currentFat")?.value.trim();
        const desiredFatRaw = document.getElementById("desiredFat")?.value.trim();

        let errors = [];

        // ---- VALIDATIONS FOR AGE & TRAINING ----
        if (!ageRaw) errors.push("⚠️ Age is required");
        else if (isNaN(ageRaw)) errors.push("⚠️ Please input numeric value for Age");
        else if (ageRaw < 0) errors.push("⚠️ Age can't be negative");
        else if (ageRaw < 16) errors.push("⚠️ Age is too low");
        else if (ageRaw > 60) errors.push("⚠️ Age is too high");

        if (!trainingRaw) errors.push("⚠️ Time Before Training is required");
        else if (isNaN(trainingRaw)) errors.push("⚠️ Please input numeric value for Time Before Training");
        else if (trainingRaw < 0) errors.push("⚠️ Before trained time can't be negative");
        else if (trainingRaw > 300) errors.push("⚠️ Months are too high");

        // ---- VALIDATIONS FOR OPTIONAL NUMERIC INPUTS ----
        let weight = parseFloat(weightRaw);
        let currentFat = parseFloat(currentFatRaw);
        let desiredFat = parseFloat(desiredFatRaw);

        if (weightRaw) {
            if (isNaN(weightRaw)) errors.push("⚠️ Enter numeric value for Current Weight");
            else if (weight <= 0) errors.push("⚠️ There should be some weight");
            else if (weight > 300) errors.push("⚠️ Weight is too heavy");
        }
        if (currentFatRaw) {
            if (isNaN(currentFatRaw)) errors.push("⚠️ Please enter numeric value in Current Body Fat (%)");
            else if (currentFat <= 0) errors.push("⚠️ Current Body Fat (%) is too low");
            else if (currentFat > 100) errors.push("⚠️ Current Body Fat (%) is too high");
        }
        if (desiredFatRaw) {
            if (isNaN(desiredFatRaw)) errors.push("⚠️ Please enter numeric value in Desired Body Fat (%)");
            else if (desiredFat <= 0) errors.push("⚠️ Desired Body Fat (%) is too low");
            else if (desiredFat > 100) errors.push("⚠️ Desired Body Fat (%) is too high");
        }

        // ---- CHECK DROPDOWNS ----
        if (!workout) errors.push("⚠️ Please select Workout Quality");
        if (!diet) errors.push("⚠️ Please select Diet Quality");
        if (!genetics) errors.push("⚠️ Please select Genetics Type");
        if (!resultTimeRaw) errors.push("⚠️ Please select Time of Result");

        const resultDisplay = document.getElementById("resultDisplay");
        resultDisplay.innerHTML = "";

        // ---- SHOW ALL ERRORS SIMULTANEOUSLY ----
        if (errors.length > 0) {
            resultDisplay.style.color = "#ff4d4d";
            resultDisplay.innerHTML = errors.join("<br>");
            return;
        }

        // ---- CALCULATION ----
        const age = parseFloat(ageRaw);
        const timeBeforeTraining = parseFloat(trainingRaw);
        const timeResult = parseFloat(resultTimeRaw);

        const timeBeforeVal = getTimeBeforeTrainingValue(timeBeforeTraining);
        const ageVal = getAgeValue(age);
        const workoutVal = workoutMap[workout];
        const dietVal = dietMap[diet];
        const geneticsVal = geneticsMap[genetics];

        const muscleGain = ((((timeBeforeVal / ageVal) / workoutVal) / dietVal) / geneticsVal) / 12 * timeResult;

        // ---- Corrected Body Weight Calculation ----
        let finalWeightText = "";
        if (weightRaw && currentFatRaw && desiredFatRaw && !isNaN(weight) && !isNaN(currentFat) && !isNaN(desiredFat)) {
            const leanMass = weight * (1 - currentFat / 100);
            const newLeanMass = leanMass + muscleGain;
            const finalWeight = newLeanMass / (1 - desiredFat / 100);
            finalWeightText = `<br><b>Estimated Final Body Weight After Muscle Gain:</b> <b>${finalWeight.toFixed(1)} kg</b><br>`;
        }

        // ---- DISPLAY RESULTS ----
        resultDisplay.style.color = "#00ff99";
        resultDisplay.innerHTML = ` 
             <b>Estimated Pure And Only Muscle Gain:</b> <b>${muscleGain.toFixed(3)} kg</b>
            ${finalWeightText}<br>
            <br><b>Workout Quality:</b> ${workout}<br>
            <b>Diet Quality:</b> ${diet}<br>
            <b>Genetics:</b> ${genetics}<br>
            <b>Time Before Training:</b> ${timeBeforeTraining} months<br>
            <b>Age:</b> ${age} years<br>
            <b>Time of Result:</b> ${timeResult} months
        `;
    });

    // ----------------- Body Fat Calculator -----------------
    const bodyFatBtn = document.getElementById("bodyFatCalcBtn");
    bodyFatBtn.addEventListener("click", () => {
        const heightRaw = document.getElementById("height").value.trim();
        const neckRaw = document.getElementById("neck").value.trim();
        const waistRaw = document.getElementById("waist").value.trim();
        const bfResult = document.getElementById("bodyFatResultDisplay"); // separate display

        let bfErrors = [];

        // ---- Height Validation ----
        if (!heightRaw) bfErrors.push("⚠️ Height is required");
        else if (isNaN(heightRaw)) bfErrors.push("⚠️ Please enter numeric value for height");
        else if (parseFloat(heightRaw) <= 0) bfErrors.push("⚠️ There should be some height");
        else if (parseFloat(heightRaw) > 500) bfErrors.push("⚠️ Height is too high");

        // ---- Neck Validation ----
        if (!neckRaw) bfErrors.push("⚠️ Neck Circumference is required");
        else if (isNaN(neckRaw)) bfErrors.push("⚠️ Please enter numeric value for neck circumference");
        else if (parseFloat(neckRaw) <= 0) bfErrors.push("⚠️ There should be some neck circumference");
        else if (parseFloat(neckRaw) > 300) bfErrors.push("⚠️ Neck Circumference is too thick");

        // ---- Waist Validation ----
        if (!waistRaw) bfErrors.push("⚠️ Waist Circumference is required");
        else if (isNaN(waistRaw)) bfErrors.push("⚠️ Please enter numeric value for waist circumference");
        else if (parseFloat(waistRaw) <= 0) bfErrors.push("⚠️ There should be some waist circumference");
        else if (parseFloat(waistRaw) > 400) bfErrors.push("⚠️ Waist circumference is too thick");

        // ---- SHOW ERRORS ----
        if (bfErrors.length > 0) {
            bfResult.style.color = "#ff4d4d";
            bfResult.innerHTML = bfErrors.join("<br>");
            return;
        }

        // ---- Body Fat % Calculation (U.S. Navy Formula for Men) ----
        const height = parseFloat(heightRaw);
        const neck = parseFloat(neckRaw);
        const waist = parseFloat(waistRaw);

        // ✅ Accurate U.S. Navy Formula for Men
        const bodyFatPercent = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;

        bfResult.style.color = "#00ff99";
        bfResult.innerHTML = `<b>Estimated Body Fat Percentage: ${bodyFatPercent.toFixed(1)}%</b>`;
    });
});
