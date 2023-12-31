let BASEURL = "https://rocket.malte.im/";
async function raidsFetch(base, endpoint, method, message) {
  await fetch(base + endpoint, {
    method: method,
    headers: {
      "Content-Type": "Application/JSON",
    },
    body: method !== "GET" ? JSON.stringify(message) : undefined,
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else throw new Error("Not 2xx response", { cause: res });
    })
    .then((data) => (cloning(data.characters), buildData(data.characters)))
    .catch((e) => console.log(e));
}

raidsFetch(BASEURL, "api/characters?hours=24", "GET");

const cloning = (data) => {
  for (let iteration of data) {
    let gruntName = iteration.character.name.split("_")[2];
    if (gruntName === "ARLO" || gruntName === "CLIFF" || gruntName === "SIERRA")
      continue;
    let temp = document.getElementsByTagName("template")[0];
    let clone = temp.content.cloneNode(true);
    document.querySelector(".chart-container").appendChild(clone);
  }
};

const buildData = (data) => {
  // let chartNodes = document.querySelector(".chart-container").children;
  // console.log(chartNodes);
  let gruntNodes = document.querySelectorAll(".grunt-container");
  let headline = document.querySelectorAll(".headline");
  let typeIcon = document.querySelectorAll(".grunt-type img.type");
  let grunts = document.querySelectorAll(".grunt");
  let i = 0;
  for (let datum of data) {
    console.log(datum.character.name);
    // CHARACTER
    let gruntName = datum.character.name.split("_")[2];
    if (gruntName === "ARLO" || gruntName === "CLIFF" || gruntName === "SIERRA")
      continue;

    let type = datum.character.name.split("_")[1].toLowerCase();
    let grunt =
      datum.character.name.split("_")[3]?.toLowerCase() ??
      datum.character.name.split("_")[2]?.toLowerCase();

    switch (type) {
      case "grunt": {
        typeIcon[i].src = `./icons/ace.png`;
        typeIcon[i].classList.add("ace");
        break;
      }
      case "decoy": {
        typeIcon[i].src = `./icons/ace.png`;
        typeIcon[i].classList.add("ace");
        break;
      }
      case "metal": {
        typeIcon[i].src = `./icons/steel.svg`;
        typeIcon[i].classList.add("steel");
        break;
      }
      default: {
        typeIcon[i].src = `./icons/${type}.svg`;
        typeIcon[i].classList.add(type);
      }
    }

    grunts[i].src = `./icons/grunts/${grunt}.png`;
    grunts[i].classList.add(grunt);
    // REWARDED POKEMON
    let shinyMap = new Map();
    for (let reward of datum.rewards)
      shinyMap.set(reward.pokemon.name, !!reward.shinies);
    // TEAM OF POKEMONS TO FIGHT WITH
    let stage1 = gruntNodes[i].querySelectorAll(".stage-1 span img");
    let stage2 = gruntNodes[i].querySelectorAll(".stage-2 span img");
    let stage3 = gruntNodes[i].querySelectorAll(".stage-3 span img");
    let a = 0;
    let b = 0;
    let c = 0;
    for (let team of datum.team)
      switch (team.slot) {
        case 0: {
          stage1[
            a
          ].src = `https://img.pokemondb.net/sprites/home/normal/${team.pokemon.name.toLowerCase()}.png`;
          shinyMap.get(team.pokemon.name) && stage1[a].classList.add("shiny");
          !shinyMap.has(team.pokemon.name) &&
            stage1[a]?.closest("div").classList.remove("encounterable");
          a++;
          break;
        }
        case 1: {
          stage2[
            b
          ].src = `https://img.pokemondb.net/sprites/home/normal/${team.pokemon.name.toLowerCase()}.png`;
          shinyMap.get(team.pokemon.name) && stage2[b].classList.add("shiny");
          !shinyMap.has(team.pokemon.name) &&
            stage2[b]?.closest("div").classList.remove("encounterable");
          b++;
          break;
        }
        case 2: {
          stage3[
            c
          ].src = `https://img.pokemondb.net/sprites/home/normal/${team.pokemon.name.toLowerCase()}.png`;
          shinyMap.get(team.pokemon.name) && stage3[c].classList.add("shiny");
          !shinyMap.has(team.pokemon.name) &&
            stage3[c]?.closest("div").classList.remove("encounterable");
          c++;
          break;
        }
      }
    // SEPARATION
    // console.warn("AAAAAAAAAAA");
    i++;
  }
};
