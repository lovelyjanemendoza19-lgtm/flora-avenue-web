(function () {
    const storageKey = "floraAvenueProfile";
    const profileTitle = document.getElementById("profile-title");
    const inputs = document.querySelectorAll("[data-profile-input]");
    const values = document.querySelectorAll("[data-profile-value]");
    const editButton = document.getElementById("editProfileButton");
    const cancelButton = document.getElementById("cancelProfileButton");
    const saveButton = document.getElementById("saveProfileButton");

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

    let savedProfile = {
        name: "Flora Avenue Customer",
        email: "customer@example.com",
        contact: ""
    };

    try {
        const storedProfile = JSON.parse(localStorage.getItem(storageKey));
        if (storedProfile && typeof storedProfile === "object") {
            savedProfile = { ...savedProfile, ...storedProfile };
        }
    } catch (error) {
        console.warn("Unable to load saved profile details.", error);
    }

    function updateDisplay(profile) {
        values.forEach(function (value) {
            const key = value.dataset.profileValue;
            value.textContent = profile[key] || "Not provided";
        });
        profileTitle.textContent = profile.name || "Flora Avenue Customer";
    }

    function setEditing(editing) {
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
        savedProfile = updatedProfile;
        localStorage.setItem(storageKey, JSON.stringify(savedProfile));
        updateDisplay(savedProfile);
        setEditing(false);
    }

    updateDisplay(savedProfile);
    setEditing(false);
    editButton.addEventListener("click", function () {
        setEditing(true);
        inputs[0].focus();
    });
    cancelButton.addEventListener("click", function () {
        setEditing(false);
    });
    saveButton.addEventListener("click", saveProfile);
})();