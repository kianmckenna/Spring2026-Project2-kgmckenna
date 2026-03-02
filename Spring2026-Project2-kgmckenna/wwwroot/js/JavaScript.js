console.log("JavaScript loaded");

$(function () {
    const apiKey = "e5ad18ebd2b4e4dbfdecb987d0c7c1ea56b56be6";

    // TIME button -> load HH:MM into #time and show as jQuery UI dialog
    $("#timeButton").on("click", function () {
        const now = new Date();

        const hh = String(now.getHours()).padStart(2, "0");
        const mm = String(now.getMinutes()).padStart(2, "0");
        const formatted = `${hh}:${mm}`;

        $("#time")
            .html(`<p>${formatted}</p>`)
            .show()
            .dialog({
                title: "Current Time",
                modal: false,
                width: 250
            });
    });

    $("#searchForm").on("submit", function (e) {
        e.preventDefault();

        const query = $("#query").val().trim();
        if (!query) return;

        const url =
            "https://google.serper.dev/search?q=" +
            encodeURIComponent(query) +
            "&apiKey=" +
            encodeURIComponent(apiKey);

        $.ajax({
            url: url,
            method: "GET",
            dataType: "json",
            success: function (data) {
                console.log("Serper response:", data);

                $("#searchResults")
                    .show()
                    .html("<pre>" + JSON.stringify(data, null, 2) + "</pre>");
            },
            error: function (xhr, status, err) {
                console.error("Search failed:", status, err);
                $("#searchResults").show().text("Search failed. Check console.");
            }
        });
    });
});