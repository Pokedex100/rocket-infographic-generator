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
    .then((data) => buildData(data.characters))
    .catch((e) => console.log(e));
}

raidsFetch(BASEURL, "api/characters?hours=24", "GET");

const buildData = (data) => {
  let chartNodes = document.querySelector(".chart-container").childNodes;
  let headline = document.querySelector(".headline");
  let typeIcon = document.querySelectorAll(".grunt-type img.type");
  let i = 0;
  for (let datum of data.reverse()) {
    // CHARACTER
    console.log(datum.character.name);
    let type = datum.character.name.split("_")[1].toLowerCase();
    typeIcon[i].src = `./icons/${type}.svg`;
    typeIcon[i].classList.add(type);
    // REWARDED POKEMON
    for (let reward of datum.rewards)
      console.log(reward.pokemon.name, !!reward.shinies);
    // TEAM OF POKEMONS TO FIGHT WITH
    for (let team of datum.team) console.log(team.pokemon.name, team.slot);
    // SEPARATION
    console.warn("AAAAAAAAAAA");
    i++;
    if (i === 2) break;
  }
};
