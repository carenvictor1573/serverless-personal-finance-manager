const clientId = "6u3vrk8ahqfdjvtehp121pd2tk";
const region = "us-east-1";

async function signup() {
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    if (!email || !password) {
        alert("Email and password required");
        return;
    }

    const res = await fetch(`https://cognito-idp.${region}.amazonaws.com/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-amz-json-1.1",
            "X-Amz-Target": "AWSCognitoIdentityProviderService.SignUp"
        },
        body: JSON.stringify({
            ClientId: clientId,
            Username: email,
            Password: password
        })
    });

    const data = await res.json();

    if (data.__type) {
        alert(data.message || "Signup failed");
        return;
    }

    alert("Signup successful! Check your email for verification code.");
}

async function confirmSignup() {
    const email = document.getElementById("signupEmail").value;
    const code = document.getElementById("confirmCode").value;

    if (!email || !code) {
        alert("Email and verification code required");
        return;
    }

    const res = await fetch(`https://cognito-idp.${region}.amazonaws.com/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-amz-json-1.1",
            "X-Amz-Target": "AWSCognitoIdentityProviderService.ConfirmSignUp"
        },
        body: JSON.stringify({
            ClientId: clientId,
            Username: email,
            ConfirmationCode: code
        })
    });

    const data = await res.json();

    if (data.__type) {
        alert(data.message || "Confirmation failed");
        return;
    }

    alert("Email verified! You can now login.");
}

async function login(email, password) {
    const res = await fetch(`https://cognito-idp.${region}.amazonaws.com/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-amz-json-1.1",
            "X-Amz-Target": "AWSCognitoIdentityProviderService.InitiateAuth"
        },
        body: JSON.stringify({
            AuthFlow: "USER_PASSWORD_AUTH",
            ClientId: clientId,
            AuthParameters: {
                USERNAME: email,
                PASSWORD: password
            }
        })
    });

    const data = await res.json();

    if (!data.AuthenticationResult) {
        alert("Login failed");
        return;
    }

    localStorage.setItem("idToken", data.AuthenticationResult.IdToken);
    localStorage.setItem("user", email);

    window.location.href = "dashboard.html";
}

function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}