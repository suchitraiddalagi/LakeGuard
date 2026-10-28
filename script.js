/* =========================================
   LAKEGUARD
   Interactive Demonstration Website
   All readings are simulated.
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    // -----------------------------------------
    // 1. Simulation Settings
    // -----------------------------------------

    const STORAGE_KEY = "lakeGuardSimulatedReadings";
    const ALERTS_KEY = "lakeGuardDemoAlerts";

    const DEFAULT_READINGS = {
        ph: 7.2,
        turbidity: 4.0,
        oxygen: 7.0,
        temperature: 25.0
    };

    const THRESHOLDS = {
        phMin: 6.5,
        phMax: 8.5,
        turbidityMax: 5.0,
        oxygenMin: 5.0,
        temperatureMin: 20.0,
        temperatureMax: 30.0
    };


    // -----------------------------------------
    // 2. Read and Store Simulated Data
    // -----------------------------------------

    function getReadings() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);

            if (saved) {
                const parsed = JSON.parse(saved);

                if (
                    Number.isFinite(parsed.ph) &&
                    Number.isFinite(parsed.turbidity) &&
                    Number.isFinite(parsed.oxygen) &&
                    Number.isFinite(parsed.temperature)
                ) {
                    return parsed;
                }
            }
        } catch (error) {
            console.warn("Could not read saved demonstration data.");
        }

        return { ...DEFAULT_READINGS };
    }


    function saveReadings(readings) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(readings));
        } catch (error) {
            console.warn("Could not save demonstration data.");
        }
    }


    let readings = getReadings();


    // -----------------------------------------
    // 3. Status Evaluation
    // -----------------------------------------

    function getParameterStatus(parameter, value) {

        if (parameter === "ph") {
            if (
                value < THRESHOLDS.phMin ||
                value > THRESHOLDS.phMax
            ) {
                return "warning";
            }

            return "good";
        }

        if (parameter === "turbidity") {
            if (value > THRESHOLDS.turbidityMax) {
                return "warning";
            }

            return "good";
        }

        if (parameter === "oxygen") {
            if (value < THRESHOLDS.oxygenMin) {
                return "warning";
            }

            return "good";
        }

        if (parameter === "temperature") {
            if (
                value < THRESHOLDS.temperatureMin ||
                value > THRESHOLDS.temperatureMax
            ) {
                return "warning";
            }

            return "good";
        }

        return "neutral";
    }


    function getStatusLabel(status) {
        if (status === "good") return "Within Demo Range";
        if (status === "warning") return "Review Reading";

        return "Information";
    }


    function updateStatusElement(element, status) {
        if (!element) return;

        element.textContent = getStatusLabel(status);

        element.classList.remove(
            "status-good",
            "status-warning",
            "status-danger",
            "status-neutral"
        );

        if (status === "good") {
            element.classList.add("status-good");
        } else if (status === "warning") {
            element.classList.add("status-warning");
        } else {
            element.classList.add("status-neutral");
        }
    }


    // -----------------------------------------
    // 4. Dashboard Readings
    // -----------------------------------------

    function updateDashboard() {

        const phValue = document.getElementById("phValue");
        const turbidityValue = document.getElementById("turbidityValue");
        const oxygenValue = document.getElementById("oxygenValue");
        const temperatureValue = document.getElementById("temperatureValue");

        if (phValue) {
            phValue.textContent = readings.ph.toFixed(1);
        }

        if (turbidityValue) {
            turbidityValue.textContent = readings.turbidity.toFixed(1);
        }

        if (oxygenValue) {
            oxygenValue.textContent = readings.oxygen.toFixed(1);
        }

        if (temperatureValue) {
            temperatureValue.textContent = readings.temperature.toFixed(1);
        }


        updateStatusElement(
            document.getElementById("phStatus"),
            getParameterStatus("ph", readings.ph)
        );

        updateStatusElement(
            document.getElementById("turbidityStatus"),
            getParameterStatus("turbidity", readings.turbidity)
        );

        updateStatusElement(
            document.getElementById("oxygenStatus"),
            getParameterStatus("oxygen", readings.oxygen)
        );

        updateStatusElement(
            document.getElementById("temperatureStatus"),
            getParameterStatus("temperature", readings.temperature)
        );


        // Update the demonstration data table.

        const tableValues = {
            tablePh: readings.ph.toFixed(1),
            tableTurbidity: readings.turbidity.toFixed(1),
            tableOxygen: readings.oxygen.toFixed(1),
            tableTemperature: readings.temperature.toFixed(1)
        };

        Object.entries(tableValues).forEach(function ([id, value]) {
            const element = document.getElementById(id);

            if (element) {
                element.textContent = value;
            }
        });


        const tableStatuses = {
            tablePhStatus: getParameterStatus("ph", readings.ph),
            tableTurbidityStatus: getParameterStatus(
                "turbidity",
                readings.turbidity
            ),
            tableOxygenStatus: getParameterStatus(
                "oxygen",
                readings.oxygen
            ),
            tableTemperatureStatus: getParameterStatus(
                "temperature",
                readings.temperature
            )
        };

        Object.entries(tableStatuses).forEach(function ([id, status]) {
            updateStatusElement(document.getElementById(id), status);
        });


        // Calculate a simple demonstration risk score.
        // This is illustrative, not a scientifically validated model.

        const statuses = [
            getParameterStatus("ph", readings.ph),
            getParameterStatus("turbidity", readings.turbidity),
            getParameterStatus("oxygen", readings.oxygen),
            getParameterStatus("temperature", readings.temperature)
        ];

        const warningCount = statuses.filter(
            status => status === "warning"
        ).length;

        const riskScore = warningCount * 25;

        const riskMeterFill = document.getElementById("riskMeterFill");

        if (riskMeterFill) {
            riskMeterFill.style.width = riskScore + "%";
        }

        const overallStatus = document.getElementById("overallStatus");
        const riskDescription = document.getElementById("riskDescription");

        if (overallStatus) {

            overallStatus.classList.remove(
                "status-good",
                "status-warning",
                "status-danger",
                "status-neutral"
            );

            if (warningCount === 0) {
                overallStatus.textContent = "Within Demo Ranges";
                overallStatus.classList.add("status-good");
            } else {
                overallStatus.textContent = "Readings Need Review";
                overallStatus.classList.add("status-warning");
            }
        }

        if (riskDescription) {
            if (warningCount === 0) {
                riskDescription.textContent =
                    "All simulated readings are within the example ranges.";
            } else {
                riskDescription.textContent =
                    warningCount +
                    " simulated parameter(s) fall outside the example ranges.";
            }
        }

        if (riskMeterFill) {
            riskMeterFill.style.background =
                warningCount === 0 ? "#16a085" : "#d97706";
        }
    }


    // -----------------------------------------
    // 5. Refresh Simulated Readings
    // -----------------------------------------

    const refreshButton = document.getElementById("refreshReadings");

    if (refreshButton) {

        refreshButton.addEventListener("click", function () {

            refreshButton.disabled = true;
            refreshButton.textContent = "Generating...";

            // Generate new illustrative readings.
            readings = {
                ph: randomNumber(5.5, 9.0),
                turbidity: randomNumber(1.0, 12.0),
                oxygen: randomNumber(2.0, 10.0),
                temperature: randomNumber(18.0, 34.0)
            };

            saveReadings(readings);

            updateDashboard();
            updateAnalysis();

            window.setTimeout(function () {
                refreshButton.disabled = false;
                refreshButton.textContent = "Refresh Readings";
            }, 350);
        });
    }


    function randomNumber(min, max) {
        return Math.round(
            (Math.random() * (max - min) + min) * 10
        ) / 10;
    }


    // -----------------------------------------
    // 6. Analysis Page
    // -----------------------------------------

    function updateAnalysis() {

        updateAnalysisParameter(
            "ph",
            readings.ph,
            document.getElementById("analysisPhText"),
            document.getElementById("analysisPhBar")
        );

        updateAnalysisParameter(
            "turbidity",
            readings.turbidity,
            document.getElementById("analysisTurbidityText"),
            document.getElementById("analysisTurbidityBar")
        );

        updateAnalysisParameter(
            "oxygen",
            readings.oxygen,
            document.getElementById("analysisOxygenText"),
            document.getElementById("analysisOxygenBar")
        );

        updateAnalysisParameter(
            "temperature",
            readings.temperature,
            document.getElementById("analysisTemperatureText"),
            document.getElementById("analysisTemperatureBar")
        );
    }


    function updateAnalysisParameter(parameter, value, textElement, barElement) {

        if (!textElement && !barElement) return;

        const status = getParameterStatus(parameter, value);
        const label = getStatusLabel(status);

        if (textElement) {
            textElement.textContent =
                value.toFixed(1) + " — " + label;
        }

        if (barElement) {

            let percentage = 50;

            if (parameter === "ph") {
                percentage = (value / 14) * 100;
            } else if (parameter === "turbidity") {
                percentage = (value / 15) * 100;
            } else if (parameter === "oxygen") {
                percentage = (value / 14) * 100;
            } else if (parameter === "temperature") {
                percentage = (value / 40) * 100;
            }

            percentage = Math.max(5, Math.min(100, percentage));

            barElement.style.width = percentage + "%";

            barElement.style.background =
                status === "warning" ? "#d97706" : "#16a085";
        }
    }


    // -----------------------------------------
    // 7. Alerts: Read and Save Demonstrations
    // -----------------------------------------

    function getSavedAlerts() {
        try {
            const saved = localStorage.getItem(ALERTS_KEY);

            if (saved) {
                const parsed = JSON.parse(saved);

                if (Array.isArray(parsed)) {
                    return parsed;
                }
            }
        } catch (error) {
            console.warn("Could not read demonstration alerts.");
        }

        return [];
    }


    function saveAlerts(alerts) {
        try {
            localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts));
        } catch (error) {
            console.warn("Could not save demonstration alerts.");
        }
    }


    function updateAlertCounts() {

        const cards = document.querySelectorAll(
            "#alertList .alert-card"
        );

        let high = 0;
        let medium = 0;
        let info = 0;

        cards.forEach(function (card) {
            const level = card.dataset.level;

            if (level === "high") high++;
            if (level === "medium") medium++;
            if (level === "info") info++;
        });

        setText("totalAlerts", cards.length);
        setText("highAlerts", high);
        setText("mediumAlerts", medium);
        setText("infoAlerts", info);
    }


    function setText(id, value) {
        const element = document.getElementById(id);

        if (element) {
            element.textContent = value;
        }
    }


    function createAlertCard(alert) {

        const card = document.createElement("article");

        card.className = "alert-card alert-" + alert.level;
        card.dataset.level = alert.level;

        const symbol = document.createElement("div");
        symbol.className = "alert-symbol";

        const symbols = {
            high: "🚨",
            medium: "⚠️",
            info: "ℹ️"
        };

        symbol.textContent = symbols[alert.level] || "ℹ️";

        const content = document.createElement("div");
        content.className = "alert-content";

        const titleRow = document.createElement("div");
        titleRow.className = "alert-title-row";

        const heading = document.createElement("h3");
        heading.textContent = alert.title;

        const badge = document.createElement("span");
        badge.className = "priority-badge priority-" + alert.level;

        const labels = {
            high: "High Priority",
            medium: "Medium Priority",
            info: "Information"
        };

        badge.textContent = labels[alert.level] || "Information";

        titleRow.append(heading, badge);

        const description = document.createElement("p");
        description.textContent = alert.description;

        const time = document.createElement("span");
        time.className = "alert-time";
        time.textContent = "Generated demonstration alert · Simulated";

        content.append(titleRow, description, time);
        card.append(symbol, content);

        return card;
    }


    function renderSavedAlerts() {

        const alertList = document.getElementById("alertList");

        if (!alertList) return;

        const savedAlerts = getSavedAlerts();

        savedAlerts.forEach(function (alert) {
            alertList.prepend(createAlertCard(alert));
        });

        updateAlertCounts();
        applyAlertFilter();
    }


    // -----------------------------------------
    // 8. Alert Filtering
    // -----------------------------------------

    const alertFilter = document.getElementById("alertFilter");

    function applyAlertFilter() {

        if (!alertFilter) return;

        const selectedLevel = alertFilter.value;
        const cards = document.querySelectorAll(
            "#alertList .alert-card"
        );

        let visibleCount = 0;

        cards.forEach(function (card) {

            const matches =
                selectedLevel === "all" ||
                card.dataset.level === selectedLevel;

            card.style.display = matches ? "flex" : "none";

            if (matches) visibleCount++;
        });

        const emptyMessage = document.getElementById("emptyAlertMessage");

        if (emptyMessage) {
            emptyMessage.hidden = visibleCount !== 0;
        }
    }


    if (alertFilter) {
        alertFilter.addEventListener("change", applyAlertFilter);
    }


    // -----------------------------------------
    // 9. Generate Demonstration Alert
    // -----------------------------------------

    const generateAlertButton = document.getElementById(
        "generateAlertButton"
    );

    if (generateAlertButton) {

        generateAlertButton.addEventListener("click", function () {

            const options = [
                {
                    level: "high",
                    title: "Low Dissolved Oxygen — Simulated",
                    description:
                        "Example notification: a simulated dissolved oxygen reading requires review."
                },
                {
                    level: "medium",
                    title: "Increased Turbidity — Simulated",
                    description:
                        "Example notification: a simulated turbidity reading exceeds the illustrative threshold."
                },
                {
                    level: "info",
                    title: "Monitoring Update — Simulated",
                    description:
                        "Example notification: the demonstration system has generated a new sample message."
                }
            ];

            const alert = {
                ...options[Math.floor(Math.random() * options.length)],
                id: Date.now()
            };

            const alertList = document.getElementById("alertList");

            if (!alertList) return;

            const savedAlerts = getSavedAlerts();

            savedAlerts.unshift(alert);

            // Limit saved demonstration alerts to 20.
            saveAlerts(savedAlerts.slice(0, 20));

            alertList.prepend(createAlertCard(alert));

            updateAlertCounts();

            if (alertFilter) {
                alertFilter.value = "all";
            }

            applyAlertFilter();

            const originalText = generateAlertButton.textContent;

            generateAlertButton.textContent = "Demo Alert Generated";

            window.setTimeout(function () {
                generateAlertButton.textContent = originalText;
            }, 1200);
        });
    }


    // -----------------------------------------
    // 10. Initialize All Pages
    // -----------------------------------------

    updateDashboard();
    updateAnalysis();
    renderSavedAlerts();

});

