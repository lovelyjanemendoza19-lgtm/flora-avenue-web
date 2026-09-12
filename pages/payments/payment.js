const filterButtons = document.querySelectorAll(".filter-button");
const paymentItems = document.querySelectorAll(".payment-item");

filterButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const selectedFilter = button.dataset.filter;

        filterButtons.forEach(function (btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        paymentItems.forEach(function (item) {

            const status = item.dataset.status || "";

            if (
                selectedFilter === "all" ||
                status === selectedFilter
            ) {
                item.style.display = "flex";
            } else {
                item.style.display = "none";
            }

        });

    });

});