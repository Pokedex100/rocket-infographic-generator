import json
import re

def clean_pokemon_name(pokemon):
    """
    Clean the Pokémon name by removing any prefixes like "1st:", "2nd:", "3rd:" and extra spaces.
    """
    return re.sub(r'^\d+(st|nd|rd|th):\s*', '', pokemon).strip().upper()

def parse_pokemon_line(line, slot):
    """
    Parse a line of Pokémon data and return the formatted dictionary for the team array.
    """
    pokemon_data = []
    pokemons = re.split(r',\s*', line.replace("(Encounter)", ""))
    for pokemon in pokemons:
        cleaned_name = clean_pokemon_name(pokemon)
        pokemon_lower = cleaned_name.lower()
        if "alolan" in pokemon_lower:
            form = "ALOLAN"
            name = cleaned_name.replace("ALOLAN", "").strip()
        elif "galarian" in pokemon_lower:
            form = "GALARIAN"
            name = cleaned_name.replace("GALARIAN", "").strip()
        elif "paldean" in pokemon_lower:
            form = "PALDEAN"
            name = cleaned_name.replace("PALDEAN", "").strip()
        elif "hisuian" in pokemon_lower:
            form = "HISUIAN"
            name = cleaned_name.replace("HISUIAN", "").strip()
        else:
            form = "FORM_UNSET"
            name = cleaned_name
        pokemon_data.append({
            "pokemon": {"name": name},
            "form": {"name": f"{name}_{form}" if form != "FORM_UNSET" else "FORM_UNSET"},
            "slot": slot
        })
    return pokemon_data

def parse_rewards(line):
    """
    Parse a line of Pokémon marked as encounter and return the formatted dictionary for the rewards array.
    """
    reward_data = []
    pokemons = re.split(r',\s*', line.replace("(Encounter)", ""))
    for pokemon in pokemons:
        cleaned_name = clean_pokemon_name(pokemon)
        pokemon_lower = cleaned_name.lower()
        if "alolan" in pokemon_lower:
            form = "ALOLAN"
            name = cleaned_name.replace("ALOLAN", "").strip()
        elif "galarian" in pokemon_lower:
            form = "GALARIAN"
            name = cleaned_name.replace("GALARIAN", "").strip()
        elif "paldean" in pokemon_lower:
            form = "PALDEAN"
            name = cleaned_name.replace("PALDEAN", "").strip()
        elif "hisuian" in pokemon_lower:
            form = "HISUIAN"
            name = cleaned_name.replace("HISUIAN", "").strip()
        else:
            form = "FORM_UNSET"
            name = cleaned_name
        reward_data.append({
            "pokemon": {"name": name},
            "form": {"name": f"{name}_{form}" if form != "FORM_UNSET" else "FORM_UNSET"},
            "shinies": 0
        })
    return reward_data

def parse_character_data(character_name, lines):
    """
    Parse the character data based on the type and return the formatted dictionary.
    """
    character_name = character_name.strip().upper().replace(" (FEMALE)", " FEMALE").replace(" (MALE)", " MALE")
    character_data = {
        "character": {
            "name": f"CHARACTER_{character_name.replace(' ', '_')}"
        },
        "rewards": [],
        "team": []
    }

    slot = 0
    for line in lines:
        line = line.strip()
        if "(Encounter)" in line:
            character_data["rewards"].extend(parse_rewards(line))
        # Ensure all Pokémon data including encounterables are added to team
        character_data["team"].extend(parse_pokemon_line(line, slot))
        slot += 1

    return character_data

def main():
    with open('data.txt', 'r') as file:
        lines = file.readlines()

    result = {"characters": []}
    current_character_name = ""
    current_character_lines = []

    for line in lines:
        line = line.strip()
        if line == "":
            # Empty line signals the end of a character's section
            if current_character_name and current_character_lines:
                result["characters"].append(parse_character_data(current_character_name, current_character_lines))
                current_character_name = ""
                current_character_lines = []
        elif not current_character_name:
            # Start of a new character's section
            current_character_name = line
        else:
            current_character_lines.append(line)

    # Add the last character
    if current_character_name and current_character_lines:
        result["characters"].append(parse_character_data(current_character_name, current_character_lines))

    with open('data.json', 'w') as outfile:
        json.dump(result, outfile, indent=4)

if __name__ == "__main__":
    main()
