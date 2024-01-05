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

const typeObj = {
  grass: "Don't tangle with us.",
  fire: "Do you know how hot Pokémon fire breath can get!",
  water: "These waters are treacherous.",
  electric: "Get ready to shocked",
  ground: "You'll be defeated into the ground.",
  ice: "You're gonna be frozen in your tracks.",
  rock: "Let's rock and roll!",
  steel: "You're no match for my iron will.",
  metal: "You're no match for my iron will.",
  fighting: "This buff physique isn't just for show.",
  psychic: "Are you scared of psychics that use unseen power.",
  ghost: "Ke... ke... ke... ke... ke... ke!",
  dark: "Wherever there is light, there is also shadow.",
  fairy: "Check out my cute Pokémon",
  poison: "Coiled and ready to strike.",
  bug: "Go, my super bug Pokémon.",
  flying: "Battle against my Flying-type Pokémon.",
  dragon: "ROAR! ...How'd that sound!",
  normal: "Normal does not mean weak",
  grunt: "...",
  decoy: "...",
};

const buildData = (data) => {
  // let chartNodes = document.querySelector(".chart-container").children;
  let sortedTypes = [...Object.keys(typeObj)];

  let sortedData = data.sort(
    (a, b) =>
      sortedTypes.indexOf(a.character.name.split("_")[1].toLowerCase()) -
      sortedTypes.indexOf(b.character.name.split("_")[1].toLowerCase())
  );
  let gruntNodes = document.querySelectorAll(".grunt-container");
  let headline = document.querySelectorAll(".headline");
  let typeIcon = document.querySelectorAll(".grunt-type img.type");
  let grunts = document.querySelectorAll(".grunt");
  let i = 0;
  for (let datum of sortedData) {
    // CHARACTER
    // console.log(datum.character.name);
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
        additionalContext("ace", grunt, headline[i]);
        break;
      }
      case "decoy": {
        typeIcon[i].src = `./icons/ace.png`;
        typeIcon[i].classList.add("ace");
        additionalContext("decoy", grunt, headline[i]);
        break;
      }
      case "metal": {
        typeIcon[i].src = `./icons/steel.svg`;
        typeIcon[i].classList.add("steel");
        headline[i].textContent = typeObj.steel;
        break;
      }
      default: {
        typeIcon[i].src = `./icons/${type}.svg`;
        typeIcon[i].classList.add(type);
        headline[i].textContent = typeObj[type];
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
          let pokemonName =
            team.form.name !== "FORM_UNSET"
              ? team.form.name
                  .replace(/_ALOLAN?/, "-alolan")
                  .replace(/_GALARI?A?N?/, "-galarian")
                  .replace(/_HISUIA?N?/, "-hisuian")
                  .replace(/_PALDEAN?/, "-paldean")
              : team.pokemon.name;
          stage1[
            a
          ].src = `https://img.pokemondb.net/sprites/home/normal/${pokemonName.toLowerCase()}.png`;
          shinyMap.get(team.pokemon.name) && stage1[a].classList.add("shiny");
          !shinyMap.has(team.pokemon.name) &&
            stage1[a]?.closest("div").classList.remove("encounterable");
          a++;
          break;
        }
        case 1: {
          let pokemonName =
            team.form.name !== "FORM_UNSET"
              ? team.form.name
                  .replace(/_ALOLAN?/, "-alolan")
                  .replace(/_GALARI?A?N?/, "-galarian")
                  .replace(/_HISUIA?N?/, "-hisuian")
                  .replace(/_PALDEAN?/, "-paldean")
              : team.pokemon.name;
          stage2[
            b
          ].src = `https://img.pokemondb.net/sprites/home/normal/${pokemonName.toLowerCase()}.png`;
          shinyMap.get(team.pokemon.name) && stage2[b].classList.add("shiny");
          !shinyMap.has(team.pokemon.name) &&
            stage2[b]?.closest("div").classList.remove("encounterable");
          b++;
          break;
        }
        case 2: {
          let pokemonName =
            team.form.name !== "FORM_UNSET"
              ? team.form.name
                  .replace(/_ALOLAN?/, "-alolan")
                  .replace(/_GALARI?A?N?/, "-galarian")
                  .replace(/_HISUIA?N?/, "-hisuian")
                  .replace(/_PALDEAN?/, "-paldean")
              : team.pokemon.name;
          stage3[
            c
          ].src = `https://img.pokemondb.net/sprites/home/normal/${pokemonName.toLowerCase()}.png`;
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

const additionalContext = (type, gender, headline) => {
  let heading =
    (type === "ace" ? gender.toUpperCase() : type.toUpperCase()) + " GRUNT";
  let span = document.createElement("span");
  span.textContent = heading;
  headline.appendChild(span);

  let aceLabelData = [
    "Don't bother--I've already won.",
    "Get ready to be defeated!",
    "Winning is for winners.",
  ];
  let decoyLabelData = ["It teels good to see you disappointed."];
  switch (type) {
    case "ace": {
      let ul = document.createElement("ul");
      for (label of aceLabelData) {
        let li = document.createElement("li");
        li.textContent = label;
        ul.appendChild(li);
      }
      headline.appendChild(ul);
      break;
    }
    case "decoy": {
      let p = document.createElement("p");
      p.textContent = decoyLabelData[0];
      headline.appendChild(p);
      break;
    }
  }
};
