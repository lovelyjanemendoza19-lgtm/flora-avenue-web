(function () {
    const basePath = document.body.dataset.navigationBase || "";
    const fallbackImage = basePath + "public/images/rose.jpg";

    function useFallback(image) {
        if (image.dataset.fallbackUsed === "true") {
            return;
        }

        image.dataset.fallbackUsed = "true";
        image.src = fallbackImage;
    }

    document.querySelectorAll("img").forEach(function (image) {
        image.addEventListener("error", function () {
            useFallback(image);
        });

        if (image.complete && image.naturalWidth === 0) {
            useFallback(image);
        }
    });
})();
