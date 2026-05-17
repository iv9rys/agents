const allMaps = [
    "Ascent",
    "Breeze",
    "Lotus",
    "Split",
    "Pearl",
    "Haven",
    "Fracture",
    "Bind",
    "Abyss",
    "Corrode",
    "Sunset"
];

const defaultPool = [
    "Ascent",
    "Breeze",
    "Lotus",
    "Split",
    "Pearl",
    "Haven",
    "Fracture"
];

const agentsByClass = {
    Duelists: [
        "jett",
        "raze",
        "reyna",
        "phoenix",
        "neon",
        "iso",
        "yoru",
        "waylay"
    ],

    Controllers: [
        "astra",
        "brimstone",
        "clove",
        "harbor",
        "omen",
        "viper"
    ],

    Initiators: [
        "breach",
        "fade",
        "gekko",
        "kayo",
        "skye",
        "sova",
        "tejo"
    ],

    Sentinels: [
        "chamber",
        "cypher",
        "deadlock",
        "killjoy",
        "sage",
        "vyse",
        "miks",
        "veto"
    ]
};

let mapPool =
    JSON.parse(localStorage.getItem("mapPool")) ||
    defaultPool;

let comps =
    JSON.parse(localStorage.getItem("comps")) ||
    {};

let bannedMap =
    localStorage.getItem("bannedMap") ||
    "";

let currentMap = null;

function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

if (document.getElementById("map-list")) {
    renderBuilder();
}

if (document.getElementById("saved-comps-container")) {
    renderSavedComps();
}

if (document.getElementById("settings-maps")) {
    renderSettings();
}

function renderBuilder() {
    const mapList = document.getElementById("map-list");
    const banSelect = document.getElementById("ban-select");
    const agentSections =
        document.getElementById("agent-sections");

    mapList.innerHTML = "";
    banSelect.innerHTML =
        `<option value="">None</option>`;

    mapPool.forEach(map => {
        const button =
            document.createElement("button");

        button.classList.add("map-btn");
        button.innerText = map;

        button.addEventListener("click", () => {
            currentMap = map;

            document
                .querySelectorAll(".map-btn")
                .forEach(btn =>
                    btn.classList.remove("active")
                );

            button.classList.add("active");

            document.getElementById(
                "current-map"
            ).innerText = map;

            renderSelectedAgents();
            updateBorders();
        });

        mapList.appendChild(button);

        const option =
            document.createElement("option");

        option.value = map;
        option.innerText = map;

        if (map === bannedMap) {
            option.selected = true;
        }

        banSelect.appendChild(option);
    });

    banSelect.addEventListener("change", () => {
        bannedMap = banSelect.value;

        localStorage.setItem(
            "bannedMap",
            bannedMap
        );
    });

    agentSections.innerHTML = "";

    Object.entries(agentsByClass).forEach(
        ([role, agents]) => {
            const section =
                document.createElement("div");

            section.classList.add(
                "agent-section"
            );

            section.innerHTML = `
                <h2>${role}</h2>
                <div class="agent-grid"></div>
            `;

            const grid =
                section.querySelector(".agent-grid");

            agents.forEach(agent => {
                const card =
                    document.createElement("div");

                card.classList.add("agent-card");

                card.innerHTML = `
                    <img src="agents/${agent}.png">
                    <div>
                        ${capitalize(agent)}
                    </div>
                `;

                card.addEventListener(
                    "click",
                    () => {
                        if (!currentMap) {
                            alert(
                                "Select a map first"
                            );
                            return;
                        }

                        let comp =
                            comps[currentMap] || [];

                        if (
                            comp.includes(agent)
                        ) {
                            comp = comp.filter(
                                a => a !== agent
                            );
                        } else {
                            if (
                                comp.length >= 5
                            ) {
                                alert(
                                    "Max 5 agents"
                                );
                                return;
                            }

                            comp.push(agent);
                        }

                        comps[currentMap] = comp;

                        localStorage.setItem(
                            "comps",
                            JSON.stringify(comps)
                        );

                        renderSelectedAgents();
                        updateBorders();
                    }
                );

                grid.appendChild(card);
            });

            agentSections.appendChild(section);
        }
    );
}

function renderSelectedAgents() {
    const container =
        document.getElementById(
            "selected-agents"
        );

    container.innerHTML = "";

    const comp =
        comps[currentMap] || [];

    comp.forEach(agent => {
        const div =
            document.createElement("div");

        div.classList.add(
            "selected-agent"
        );

        div.innerHTML = `
            <img src="agents/${agent}.png">
        `;

        container.appendChild(div);
    });
}

function updateBorders() {
    document
        .querySelectorAll(".agent-card")
        .forEach(card => {
            const name =
                card.innerText
                    .trim()
                    .toLowerCase();

            const comp =
                comps[currentMap] || [];

            if (
                comp.includes(name)
            ) {
                card.classList.add(
                    "selected"
                );
            } else {
                card.classList.remove(
                    "selected"
                );
            }
        });
}

function renderSavedComps() {
    const container =
        document.getElementById(
            "saved-comps-container"
        );

    mapPool.forEach(map => {
        const comp =
            comps[map] || [];

        const card =
            document.createElement("div");

        card.classList.add(
            "saved-comp"
        );

       card.innerHTML = `
    <h2>
        ${map}
        ${
            map === bannedMap
            ? '<span style="color:#ff4655;">(BANNED)</span>'
            : ''
        }
    </h2>

    <div class="saved-agents"></div>
`;

        const agentsDiv =
            card.querySelector(
                ".saved-agents"
            );

        comp.forEach(agent => {
            const img =
                document.createElement("img");

            img.src =
                `agents/${agent}.png`;

            agentsDiv.appendChild(img);
        });

        container.appendChild(card);
    });
}

function renderSettings() {
    const container =
        document.getElementById(
            "settings-maps"
        );

    allMaps.forEach(map => {
        const div =
            document.createElement("div");

        div.classList.add(
            "setting-map"
        );

        const checked =
            mapPool.includes(map)
                ? "checked"
                : "";

        div.innerHTML = `
            <input type="checkbox"
            ${checked}
            id="${map}">

            <label for="${map}">
                ${map}
            </label>
        `;

        const checkbox =
            div.querySelector("input");

        checkbox.addEventListener(
            "change",
            () => {
                if (
                    checkbox.checked
                ) {
                    mapPool.push(map);
                } else {
                    mapPool =
                        mapPool.filter(
                            m => m !== map
                        );
                }

                localStorage.setItem(
                    "mapPool",
                    JSON.stringify(mapPool)
                );
            }
        );

        container.appendChild(div);
    });
}
