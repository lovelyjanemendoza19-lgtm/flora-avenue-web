document.addEventListener("DOMContentLoaded", function () {

    function getPendingActionDestination() {
        const pendingActionRaw = localStorage.getItem("floraAvenuePendingAction");
        if (!pendingActionRaw) return null;

        let pendingAction;
        try {
            pendingAction = JSON.parse(pendingActionRaw);
        } catch (error) {
            console.warn("Unable to resume the requested action.", error);
            localStorage.removeItem("floraAvenuePendingAction");
            return null;
        }

        const destinationUrl = pendingAction?.continuationUrl || pendingAction?.url;
        let destination;
        try {
            destination = new URL(destinationUrl, window.location.href);
        } catch (error) {
            console.warn("Unable to resume the requested action.", error);
            localStorage.removeItem("floraAvenuePendingAction");
            return null;
        }

        const path = destination.pathname.toLowerCase();
        const siteRoot = new URL("../../index.html", window.location.href);
        const siteRootPath = siteRoot.pathname.replace(/index\.html$/i, "");
        const isSameSite = destination.origin === siteRoot.origin
            && destination.pathname.startsWith(siteRootPath);
        const isInquiry = pendingAction?.action === "inquiry"
            && pendingAction?.intent === "new-inquiry"
            && path.endsWith("/inquiries/inquiries.html");
        const isOrderDetails = pendingAction?.action === "order"
            && path.endsWith("/orders/order%20details.html");
        const isOrder = pendingAction?.action === "order"
            && (
                path.endsWith("/products/product-details.html")
                || path.endsWith("/products/customization.html")
                || path.endsWith("/orders/order%20form.html")
            );
        const isCustomization = pendingAction?.action === "customize"
            && (
                path.endsWith("/products/product-details.html")
                || path.endsWith("/products/customization.html")
            );

        if (!isSameSite || !(isInquiry || isOrder || isCustomization || isOrderDetails)) {
            localStorage.removeItem("floraAvenuePendingAction");
            return null;
        }

        if (isOrderDetails) {
            const customerEmail = (localStorage.getItem("floraAvenueUserEmail") || "").trim().toLowerCase();
            const orderReference = destination.searchParams.get("order");
            let savedOrders;
            try {
                savedOrders = JSON.parse(localStorage.getItem("floraAvenueOrders") || "[]");
            } catch (error) {
                console.warn("Unable to check the requested customer order.", error);
                localStorage.removeItem("floraAvenuePendingAction");
                return null;
            }
            const hasCustomerOrder = Array.isArray(savedOrders) && savedOrders.some(order =>
                order
                && order.reference === orderReference
                && String(order.customerEmail || order.contactEmail || "").trim().toLowerCase() === customerEmail
            );
            if (!hasCustomerOrder) {
                localStorage.removeItem("floraAvenuePendingAction");
                return null;
            }
        }

        return destination.href;
    }

    function redirectAfterSignIn() {
        const destination = getPendingActionDestination();
        if (destination && localStorage.getItem("floraAvenuePendingAction")) {
            try {
                const pendingAction = JSON.parse(localStorage.getItem("floraAvenuePendingAction"));
                if (pendingAction?.continuationUrl) {
                    localStorage.removeItem("floraAvenuePendingAction");
                }
            } catch (error) {
                console.warn("Unable to clear the resumed action.", error);
                localStorage.removeItem("floraAvenuePendingAction");
            }
        }
        window.location.href = destination || "../../index.html";
    }


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

                if (button.classList.contains("customer-password-toggle")) {
                    button.setAttribute("aria-label", "Hide password");
                } else {
                    button.textContent = "Hide";
                }

            } else {

                input.type = "password";

                if (button.classList.contains("customer-password-toggle")) {
                    button.setAttribute("aria-label", "Show password");
                } else {
                    button.textContent = "Show";
                }

            }

        });

    });

    const loginForm =
        document.getElementById("loginForm");


    if (loginForm) {

        try {
            if (localStorage.getItem("floraAvenueSignedIn") === "true") {
                redirectAfterSignIn();
                return;
            }
        } catch (error) {
            console.error("Unable to check the signed-in customer account.", error);
        }

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

            redirectAfterSignIn();

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