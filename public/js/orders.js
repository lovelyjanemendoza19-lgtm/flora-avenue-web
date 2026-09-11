(function () {

    const filterButtons =
        document.querySelectorAll(".filter-button");

    const orderItems =
        document.querySelectorAll(".order-item");

    function filterOrders(status) {
        orderItems.forEach(function (item) {
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
            filterOrders(button.dataset.filter);
        };
    });

})();
