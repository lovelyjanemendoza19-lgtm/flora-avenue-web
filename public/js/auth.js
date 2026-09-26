document.addEventListener("DOMContentLoaded", function () {

    const passwordToggles =
        document.querySelectorAll(".password-toggle");


    passwordToggles.forEach(function (button) {

        button.addEventListener("click", function () {

            const targetId =
                button.getAttribute("data-target");

            const input =
                document.getElementById(targetId);


            if (!input) {
                return;
            }


            if (input.type === "password") {

                input.type = "text";

                button.textContent = "Hide";

            } else {

                input.type = "password";

                button.textContent = "Show";

            }

        });

    });

    const loginForm =
        document.getElementById("loginForm");


    if (loginForm) {

        loginForm.addEventListener("submit", function (event) {

            event.preventDefault();


            const email =
                document.getElementById("loginEmail").value.trim();

            const password =
                document.getElementById("loginPassword").value;


            /* Basic validation */

            if (!email || !password) {

                alert("Please complete all fields.");

                return;

            }


            if (!email.includes("@")) {

                alert("Please enter a valid email address.");

                return;

            }


            /* Temporary demo login */

            try {
                localStorage.setItem("floraAvenueUserEmail", email.toLowerCase());
                localStorage.setItem("floraAvenueSignedIn", "true");
            } catch (error) {
                console.error("Unable to save the signed-in account.", error);
                alert("Unable to sign in on this device. Please check your browser storage settings.");
                return;
            }
            alert("Login successful!");

            const pendingAction = localStorage.getItem("floraAvenuePendingAction");
            if (pendingAction) {
                try {
                    const target = JSON.parse(pendingAction);
                    window.location.href = target.url;
                    return;
                } catch (error) {
                    localStorage.removeItem("floraAvenuePendingAction");
                    console.warn("Unable to resume the requested action.", error);
                }
            }

            window.location.href = "../../index.html";

        });

    }


    const registerForm =
        document.getElementById("registerForm");


    if (registerForm) {

        registerForm.addEventListener("submit", function (event) {

            event.preventDefault();


            const name =
                document.getElementById("registerName").value.trim();

            const email =
                document.getElementById("registerEmail").value.trim();

            const password =
                document.getElementById("registerPassword").value;

            const confirmPassword =
                document.getElementById("confirmPassword").value;

            const terms =
                document.getElementById("terms").checked;


            /* Name */

            if (!name) {

                alert("Please enter your full name.");

                return;

            }


            /* Email */

            if (!email || !email.includes("@")) {

                alert("Please enter a valid email address.");

                return;

            }


            /* Password */

            if (password.length < 6) {

                alert("Password must be at least 6 characters.");

                return;

            }


            /* Confirm password */

            if (password !== confirmPassword) {

                alert("Passwords do not match.");

                return;

            }


            /* Terms */

            if (!terms) {

                alert(
                    "Please agree to the Terms and Conditions."
                );

                return;

            }


            /* Temporary demo registration */

            const profileKey = `floraAvenueProfile:${encodeURIComponent(email.toLowerCase())}`;
            try {
                if (!localStorage.getItem(profileKey)) {
                    localStorage.setItem(profileKey, JSON.stringify({
                        name: name,
                        email: email.toLowerCase(),
                        contact: ""
                    }));
                }
            } catch (error) {
                console.error("Unable to save the new profile.", error);
                alert("Unable to save your profile on this device. Please check your browser storage settings.");
                return;
            }

            alert("Account created successfully!");



            window.location.href =
                "../login/login.html";

        });

    }

});