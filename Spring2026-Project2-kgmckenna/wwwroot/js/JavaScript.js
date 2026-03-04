$(function () {
    // PROOF: this should show on refresh
    alert("JavaScript.js is running");

    // TIME button -> HH:MM into #time div -> jQuery UI dialog
    $("#timeButton").on("click", function () {
        const now = new Date();
        const hh = String(now.getHours()).padStart(2, "0");
        const mm = String(now.getMinutes()).padStart(2, "0");
        const formatted = `${hh}:${mm}`;

        $("#time")
            .html(`<p style="margin:0;">${formatted}</p>`)
            .show()
            .dialog({ title: "Current Time", width: 250 });
    });

    // Search submit (just logs for now)
    $("#searchForm").on("submit", function (e) {
        e.preventDefault();
        const query = $("#query").val().trim();
        console.log("Searching for:", query);
    });
});