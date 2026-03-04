// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
$(function () {

    $("#timeButton").on("click", function () {
        const now = new Date();

        let hh = now.getHours();
        const mm = String(now.getMinutes()).padStart(2, "0");

        const ampm = hh >= 12 ? "PM" : "AM";
        hh = hh % 12;
        hh = hh ? hh : 12; 

        const formatted = `${hh}:${mm} ${ampm}`;

        $("#time")
            .html(`<p style="margin:0;">${formatted}</p>`)
            .show()
            .dialog({ title: "Current Time", width: 250 });
    });

    $("#searchForm").on("submit", function (e) {
        e.preventDefault();
        const query = $("#query").val().trim();
        console.log("Searching for:", query);
    });

    // Background cycle when clicking the site name (h1)
    const backgrounds = [
        "https://images.unsplash.com/photo-1591561582301-7ce6588cc286?q=80&w=1974&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1452857297128-d9c29adba80b?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1629898569904-669319348211?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1564650211163-21049f1b683a?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ];

    let bgIndex = 0;
     
    // remembers last background (hopefully)
    const savedIndex = localStorage.getItem("bgIndex");
    if (savedIndex !== null) bgIndex = parseInt(savedIndex, 10) || 0;

    // Set background immediately
    $("body").css("background-image", `url('${backgrounds[bgIndex]}')`);

    $("h1").on("click", function () {
        bgIndex = (bgIndex + 1) % backgrounds.length;
        localStorage.setItem("bgIndex", bgIndex);

        $("body").css("background-image", `url('${backgrounds[bgIndex]}')`);
    });

});

$(function () {
    const apiKey = "e5ad18ebd2b4e4dbfdecb987d0c7c1ea56b56be6";

    // Search submit
    $("#searchForm").on("submit", function (e) {
        e.preventDefault();

        const query = $("#query").val().trim();
        if (!query) return;

        $("#searchResults")
            .show()
            .html("<p>Searching...</p>");

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
                renderResults(data);
            },
            error: function (xhr, status, err) {
                console.error("Search failed:", status, err);
                $("#searchResults").show().html("<p>Search failed. Check console.</p>");
            }
        });
    });

    function renderResults(data) {
        const $root = $("#searchResults").empty().show();

        // --- Knowledge graph ---
        $root.append(renderKnowledgeGraph(data.knowledgeGraph));

        // --- Organic results ---
        $root.append(renderOrganic(data.organic));

        // --- People also ask ---
        $root.append(renderPeopleAlsoAsk(data.peopleAlsoAsk));

        // --- Related searches ---
        $root.append(renderRelatedSearches(data.relatedSearches));
    }

    function section(title, innerHtml) {
        return `
          <section class="resultSection">
            <h2>${escapeHtml(title)}</h2>
            ${innerHtml}
          </section>
        `;
    }

    function renderKnowledgeGraph(kg) {
        if (!kg) return section("Knowledge graph", `<p class="muted">No knowledge graph result.</p>`);

        const title = kg.title ? `<h3 class="kgTitle">${escapeHtml(kg.title)}</h3>` : "";
        const type = kg.type ? `<div class="muted">${escapeHtml(kg.type)}</div>` : "";
        const desc = kg.description ? `<p>${escapeHtml(kg.description)}</p>` : "";

        const website = kg.website
            ? `<a href="${escapeAttr(kg.website)}" target="_blank" rel="noopener">Website</a>`
            : "";

        const image = kg.imageUrl
            ? `<img class="kgImg" src="${escapeAttr(kg.imageUrl)}" alt="Knowledge graph image">`
            : "";

        const box = `
          <div class="kgBox">
            ${image}
            <div>
              ${title}
              ${type}
              ${desc}
              ${website ? `<div class="kgLinks">${website}</div>` : ""}
            </div>
          </div>
        `;

        return section("Knowledge graph", box);
    }

    function renderOrganic(organic) {
        if (!Array.isArray(organic) || organic.length === 0) {
            return section("Organic results", `<p class="muted">No organic results.</p>`);
        }

        const items = organic
            .map(r => {
                const title = r.title || r.link || "Untitled";
                const link = r.link || "#";
                const snippet = r.snippet || "";
                const source = r.displayLink || "";

                return `
                  <div class="card">
                    <div class="muted small">${escapeHtml(source)}</div>
                    <a class="resultTitle" href="${escapeAttr(link)}" target="_blank" rel="noopener">
                      ${escapeHtml(title)}
                    </a>
                    <div class="snippet">${escapeHtml(snippet)}</div>
                  </div>
                `;
            })
            .join("");

        return section("Organic results", items);
    }

    function renderPeopleAlsoAsk(paa) {
        if (!Array.isArray(paa) || paa.length === 0) {
            return section("People also ask", `<p class="muted">No “People also ask” results.</p>`);
        }

        const items = paa
            .map(q => {
                const question = q.question || "Question";
                const snippet = q.snippet || "";
                const link = q.link;

                const linkHtml = link
                    ? `<div><a href="${escapeAttr(link)}" target="_blank" rel="noopener">Source</a></div>`
                    : "";

                return `
                  <div class="card">
                    <div class="paaQ">${escapeHtml(question)}</div>
                    ${snippet ? `<div class="snippet">${escapeHtml(snippet)}</div>` : ""}
                    ${linkHtml}
                  </div>
                `;
            })
            .join("");

        return section("People also ask", items);
    }

    function renderRelatedSearches(related) {
        if (!Array.isArray(related) || related.length === 0) {
            return section("Related searches", `<p class="muted">No related searches.</p>`);
        }

        const pills = related
            .map(x => {
                const q = x.query || x;
                return `<button type="button" class="pill" data-query="${escapeAttr(q)}">${escapeHtml(q)}</button>`;
            })
            .join("");

        // click a related search to re-run search
        setTimeout(() => {
            $(".pill").off("click").on("click", function () {
                const q = $(this).data("query");
                $("#query").val(q);
                $("#searchForm").trigger("submit");
            });
        }, 0);

        return section("Related searches", `<div class="pillWrap">${pills}</div>`);
    }

    // Helpers to avoid HTML injection
    function escapeHtml(str) {
        return String(str)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function escapeAttr(str) {
        return escapeHtml(str);
    }
});