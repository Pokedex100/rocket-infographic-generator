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
  for (let datum of data.reverse()) {
    // CHARACTER
    console.log(datum.character.name);
    // REWARDED POKEMON
    for (let reward of datum.rewards)
      console.log(reward.pokemon.name, !!reward.shinies);
    // TEAM OF POKEMONS TO FIGHT WITH
    for (let team of datum.team) console.log(team.pokemon.name, team.slot);
    // SEPARATION
    console.warn("AAAAAAAAAAA");
    break;
  }
};
