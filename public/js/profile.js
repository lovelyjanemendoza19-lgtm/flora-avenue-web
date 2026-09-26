(function () {
    const legacyStorageKey = "floraAvenueProfile";
    const profileTitle = document.getElementById("profile-title");
    const inputs = document.querySelectorAll("[data-profile-input]");
    const values = document.querySelectorAll("[data-profile-value]");
    const editButton = document.getElementById("editProfileButton");
    const cancelButton = document.getElementById("cancelProfileButton");
    const saveButton = document.getElementById("saveProfileButton");
    const profileStatus = document.getElementById("profileStatus");
    const profileFeedback = document.getElementById("profileFeedback");

    if (localStorage.getItem("floraAvenueSignedIn") !== "true") {
        inputs.forEach(function (input) {
            input.hidden = true;
        });
        document.querySelectorAll("[data-profile-value]").forEach(function (value) {
            value.hidden = false;
        });
        document.querySelector(".profile-actions").innerHTML =
            '<a class="profile-action profile-sign-in" href="../login/login.html">Sign In</a>';
        return;
    }

    function getProfileKey(email) {
        return `floraAvenueProfile:${encodeURIComponent(email.trim().toLowerCase())}`;
    }

    function readProfile(storageKey) {
        try {
            const storedProfile = JSON.parse(localStorage.getItem(storageKey));
            if (storedProfile && typeof storedProfile === "object" && !Array.isArray(storedProfile)) {
                return {
                    name: typeof storedProfile.name === "string" ? storedProfile.name : "",
                    email: typeof storedProfile.email === "string" ? storedProfile.email : "",
                    contact: typeof storedProfile.contact === "string" ? storedProfile.contact : ""
                };
            }
        } catch (error) {
            console.warn("Unable to load saved profile details.", error);
        }
        return null;
    }

    let accountEmail = (localStorage.getItem("floraAvenueUserEmail") || "").trim().toLowerCase();
    let profileStorageKey = accountEmail ? getProfileKey(accountEmail) : legacyStorageKey;
    let savedProfile = { name: "", email: accountEmail, contact: "" };
    let storedProfile = readProfile(profileStorageKey);

    if (!storedProfile) {
        const legacyProfile = readProfile(legacyStorageKey);
        if (!accountEmail || legacyProfile?.email.toLowerCase() === accountEmail) {
            storedProfile = legacyProfile;
            if (storedProfile) {
                profileStorageKey = legacyStorageKey;
            }
        }
    }
    if (storedProfile) {
        savedProfile = { ...savedProfile, ...storedProfile };
    }
    savedProfile.email = accountEmail || savedProfile.email;

    function updateDisplay(profile) {
        values.forEach(function (value) {
            const key = value.dataset.profileValue;
            value.textContent = profile[key]?.trim() || "Not provided";
        });
        profileTitle.textContent = profile.name?.trim() || "Not provided";
    }

    function showFeedback(message, isError) {
        profileFeedback.textContent = message;
        profileFeedback.hidden = !message;
        profileFeedback.dataset.error = String(isError);
    }

    function setEditing(editing) {
        profileTitle.textContent = editing ? "Edit Profile" : savedProfile.name?.trim() || "Not provided";
        inputs.forEach(function (input) {
            input.hidden = !editing;
            input.value = savedProfile[input.dataset.profileInput] || "";
        });
        values.forEach(function (value) {
            value.hidden = editing;
        });
        editButton.hidden = editing;
        cancelButton.hidden = !editing;
        saveButton.hidden = !editing;
    }

    function saveProfile() {
        const updatedProfile = {};
        inputs.forEach(function (input) {
            updatedProfile[input.dataset.profileInput] = input.value.trim();
        });

        const updatedEmail = updatedProfile.email.toLowerCase();
        const updatedStorageKey = getProfileKey(updatedEmail);
        if (updatedStorageKey !== profileStorageKey && localStorage.getItem(updatedStorageKey)) {
            showFeedback("A profile already exists for that email address.", true);
            return;
        }

        updatedProfile.email = updatedEmail;
        const previousUserEmail = localStorage.getItem("floraAvenueUserEmail");
        try {
            localStorage.setItem(updatedStorageKey, JSON.stringify(updatedProfile));
            localStorage.setItem("floraAvenueUserEmail", updatedEmail);
            if (profileStorageKey !== updatedStorageKey) {
                localStorage.removeItem(profileStorageKey);
            }
        } catch (error) {
            console.error("Unable to save profile details.", error);
            try {
                if (profileStorageKey !== updatedStorageKey) {
                    localStorage.removeItem(updatedStorageKey);
                }
                if (previousUserEmail === null) {
                    localStorage.removeItem("floraAvenueUserEmail");
                } else {
                    localStorage.setItem("floraAvenueUserEmail", previousUserEmail);
                }
            } catch (rollbackError) {
                console.error("Unable to restore profile data after the save failed.", rollbackError);
            }
            showFeedback("Unable to save your profile. Please try again.", true);
            return;
        }

        profileStorageKey = updatedStorageKey;
        accountEmail = updatedEmail;
        savedProfile = updatedProfile;
        updateDisplay(savedProfile);
        setEditing(false);
        profileStatus.textContent = "Your profile changes are saved on this device.";
        showFeedback("Profile updated successfully.", false);
    }

    updateDisplay(savedProfile);
    setEditing(false);
    editButton.addEventListener("click", function () {
        showFeedback("", false);
        setEditing(true);
        inputs[0].focus();
    });
    cancelButton.addEventListener("click", function () {
        showFeedback("", false);
        setEditing(false);
    });
    saveButton.addEventListener("click", function () {
        const invalidInput = Array.from(inputs).find(function (input) {
            return !input.checkValidity();
        });
        if (invalidInput) {
            invalidInput.reportValidity();
            return;
        }
        saveProfile();
    });
    profileStatus.textContent = accountEmail
        ? "Your profile is connected to your signed-in email."
        : "Add your email to connect your profile to this account.";
})();