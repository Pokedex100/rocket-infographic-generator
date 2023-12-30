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
  let grunts = document.querySelectorAll(".grunt");
  let i = 0;
  for (let datum of data) {
    // CHARACTER
    console.log(datum.character.name);
    let type = datum.character.name.split("_")[1].toLowerCase();
    let grunt =
      datum.character.name.split("_")[3]?.toLowerCase() ??
      datum.character.name.split("_")[2]?.toLowerCase();

    typeIcon[i].src = `./icons/${type}.svg`;
    typeIcon[i].classList.add(type);

    grunts[i].src = `./icons/grunts/${grunt}.png`;
    grunts[i].classList.add(grunt);
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
