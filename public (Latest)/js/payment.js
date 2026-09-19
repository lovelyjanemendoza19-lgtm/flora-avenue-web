
(function () {

    const filterButtons =
        document.querySelectorAll(".filter-button");

    const paymentItems =
        document.querySelectorAll(".payments-item");

    function filterPayments(status) {
        paymentItems.forEach(function (item) {
            const matches =
                status === "all" || item.dataset.status === status;

            item.style.display = matches ? "flex" : "none";
        });
    }

    filterButtons.forEach(function (button) {
        button.onclick = function () {
            filterButtons.forEach(function (item) {
                item.classList.remove("active");
            });

            button.classList.add("active");
            filterPayments(button.dataset.filter);
        };
    });

})();