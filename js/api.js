console.log("api.js loaded");

// 🔹 API Gateway base URL
const apiBase = "https://74ghua4hbg.execute-api.us-east-1.amazonaws.com/prod";

// 🔹 Expose functions to HTML
window.addTransaction = addTransaction;
window.loadTransactions = loadTransactions;
window.getBalance = getBalance;

// ================= ADD TRANSACTION =================
async function addTransaction() {
    console.log("Add button clicked");

    const amount = document.getElementById("amount")?.value;
    const description = document.getElementById("description")?.value;
    const type = document.getElementById("type")?.value;

    const idToken = localStorage.getItem("idToken");
    const user = localStorage.getItem("user");

    if (!idToken || !user) {
        alert("Please login first");
        return;
    }

    if (!amount || !type) {
        alert("Amount and type are required");
        return;
    }

    try {
        const res = await fetch(`${apiBase}/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": idToken
            },
            body: JSON.stringify({
                user_id: user,
                amount: Number(amount),
                description,
                type
            })
        });

        console.log("HTTP status:", res.status);

        const text = await res.text();
        console.log("Raw response:", text);

        if (!res.ok) {
            alert("Backend error. Check console.");
            return;
        }

        const data = JSON.parse(text);
        alert("Transaction added successfully!");
        console.log("Parsed response:", data);

    } catch (err) {
        console.error("Fetch failed:", err);
        alert("Network / CORS / API error");
    }
}

// ================= LOAD TRANSACTIONS (IMPROVED) =================
async function loadTransactions() {
    const idToken = localStorage.getItem("idToken");
    const user = localStorage.getItem("user");

    if (!idToken || !user) {
        alert("Please login first");
        return;
    }

    try {
        const res = await fetch(
            `${apiBase}/get?user_id=${encodeURIComponent(user)}`,
            {
                method: "GET",
                headers: {
                    "Authorization": idToken
                }
            }
        );

        if (!res.ok) {
            alert("Failed to load transactions");
            return;
        }

        const transactions = await res.json();
        console.log("Transactions:", transactions);

        const output = document.getElementById("output");
        if (!output) return;

        if (!transactions || transactions.length === 0) {
            output.textContent = "No transactions found.";
            return;
        }

        let formatted = "";

        transactions.forEach(txn => {
            const icon = txn.type === "income" ? "💰 Income" : "💸 Expense";
            const date = txn.date ? new Date(txn.date).toLocaleDateString() : "—";

            formatted += `
${icon} | ₹${txn.amount}
📝 ${txn.description || "No description"}
📅 ${date}
----------------------------
`;
        });

        output.textContent = formatted.trim();

    } catch (err) {
        console.error("Load transactions failed:", err);
        alert("Network / API error");
    }
}

// ================= GET BALANCE =================
async function getBalance() {
    const idToken = localStorage.getItem("idToken");
    const user = localStorage.getItem("user");

    if (!idToken || !user) {
        alert("Please login first");
        return;
    }

    try {
        const res = await fetch(
            `${apiBase}/balance?user_id=${encodeURIComponent(user)}`,
            {
                method: "GET",
                headers: {
                    "Authorization": idToken
                }
            }
        );

        if (!res.ok) {
            alert("Failed to fetch balance");
            return;
        }

        const data = await res.json();
        console.log("Balance:", data);

        const balanceDiv = document.getElementById("balance");
        if (balanceDiv) {
            balanceDiv.innerHTML = `
<strong>💰 Income:</strong> ₹${data.income}<br>
<strong>💸 Expense:</strong> ₹${data.expense}<br>
<strong>📊 Balance:</strong> ₹${data.balance}
`;
        }

    } catch (err) {
        console.error("Get balance failed:", err);
        alert("Network / API error");
    }
}

// ================= DOM READY =================
document.addEventListener("DOMContentLoaded", () => {
    const addBtn = document.getElementById("addBtn");

    if (addBtn) {
        addBtn.addEventListener("click", addTransaction);
        console.log("Add button connected");
    } else {
        console.log("Add button NOT found (this is OK on other pages)");
    }
});
