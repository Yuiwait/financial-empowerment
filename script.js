// Function to load the navbar
async function loadNavbar() {
    try {
        const response = await fetch("components/navbar.html");
        if (!response.ok) throw new Error("Navbar file not found");
        document.getElementById("navbar").innerHTML = await response.text();
    } catch (error) {
        console.error("Error loading navbar:", error);
    }
}

// Function to load the dashboard
async function loadDashboard() {
    try {
        const response = await fetch("components/dashboard.html");
        if (!response.ok) throw new Error("Dashboard file not found");

        let dashboardElement = document.getElementById("dashboard");
        if (!dashboardElement) throw new Error("Dashboard element not found!");

        dashboardElement.innerHTML = await response.text();
        console.log("Dashboard loaded successfully.");

        // Append financial tools & setup the chart
        appendFinancialTools();
        setupExpenseChart();
    } catch (error) {
        console.error("Error loading dashboard:", error);
    }
}

// Function to append financial tools dynamically
function appendFinancialTools() {
    let dashboardElement = document.getElementById("dashboard");
    if (!dashboardElement) return console.error("Dashboard element not found!");

    const financialTools = document.createElement("section");
    financialTools.innerHTML = `
        <h2>SIP Calculator</h2>
        <label>Investment (₹): <input type="number" id="sipAmount"></label>
        <label>Years: <input type="number" id="sipYears"></label>
        <button id="sipCalculateBtn">Calculate</button>
        <p id="sipResult"></p>

        <h2>Budget Calculator</h2>
        <label>Monthly Income (₹): <input type="number" id="income"></label>
        <button onclick="calculateBudget()">Calculate</button>
        <p id="budgetResult"></p>

        <h2>EMI Calculator</h2>
        <label>Loan Amount (₹): <input type="number" id="loanAmount"></label>
        <label>Interest Rate (% per year): <input type="number" id="interestRate"></label>
        <label>Loan Tenure (years): <input type="number" id="loanTenure"></label>
        <button onclick="calculateEMI()">Calculate</button>
        <p id="emiResult"></p>
    `;

    dashboardElement.appendChild(financialTools);
    console.log("Financial tools added.");

    // Attach SIP Calculator event listener
    document.getElementById("sipCalculateBtn").addEventListener("click", calculateSIP);
}

// Function to calculate SIP maturity amount
function calculateSIP() {
    let amount = parseFloat(document.getElementById("sipAmount").value);
    let years = parseInt(document.getElementById("sipYears").value);
    let resultElement = document.getElementById("sipResult");

    if (isNaN(amount) || isNaN(years) || amount <= 0 || years <= 0) {
        resultElement.textContent = "Please enter valid numbers.";
        return;
    }

    let rateOfReturn = 12 / 100; // 12% annual return
    let months = years * 12;
    let monthlyRate = rateOfReturn / 12;

    let maturityAmount = amount * (((Math.pow(1 + monthlyRate, months) - 1) * (1 + monthlyRate)) / monthlyRate);
    resultElement.textContent = `Estimated SIP Maturity Amount: ₹${maturityAmount.toFixed(2)}`;
}

// Function to calculate budget allocation (50% rule)
function calculateBudget() {
    let income = parseFloat(document.getElementById("income").value);
    let resultElement = document.getElementById("budgetResult");

    if (isNaN(income) || income <= 0) {
        resultElement.textContent = "Please enter a valid income.";
        return;
    }

    let budget = income * 0.5; // 50% for essentials
    resultElement.textContent = `Allocate ₹${budget.toFixed(2)} for essentials.`;
}

// Function to calculate EMI for loans
function calculateEMI() {
    let P = parseFloat(document.getElementById("loanAmount").value);
    let R = (parseFloat(document.getElementById("interestRate").value)) / 1200;
    let N = parseInt(document.getElementById("loanTenure").value) * 12;
    let resultElement = document.getElementById("emiResult");

    if (isNaN(P) || isNaN(R) || isNaN(N) || P <= 0 || R <= 0 || N <= 0) {
        resultElement.textContent = "Please enter valid loan details.";
        return;
    }

    let EMI = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
    resultElement.textContent = `Monthly EMI: ₹${EMI.toFixed(2)}`;
}

// Function to setup the expense chart
function setupExpenseChart() {
    let canvas = document.getElementById("expenseChart");
    if (!canvas) {
        console.error("Error: Expense chart canvas is missing.");
        return;
    }

    // Set a fixed size for the canvas
    canvas.style.width = "500px";
    canvas.style.height = "300px";

    var ctx = canvas.getContext("2d");
    var myChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Rent", "Groceries", "Transport", "Savings", "Entertainment"],
            datasets: [{
                label: "Monthly Expenses (₹)",
                data: [12000, 8000, 3000, 5000, 2000],
                backgroundColor: ["#FF5733", "#33FF57", "#3357FF", "#F1C40F", "#9B59B6"],
                borderColor: "#222",
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    console.log("Expense chart resized and initialized successfully.");
}

// Load everything when the document is ready
document.addEventListener("DOMContentLoaded", () => {
    loadNavbar();
    loadDashboard();
});
