import json
from pathlib import Path


def build_levels():
    levels = []
    for i in range(1, 61):
        chapter = (i - 1) // 15 + 1
        pet_types = min(6 + ((i - 1) // 4), 18)
        total_tiles = 36 + ((i - 1) // 3) * 6
        if total_tiles % 3:
            total_tiles += 3 - (total_tiles % 3)
        layers = min(2 + ((i - 1) // 10), 6)
        obstacle_rate = round(min(0.2, max(0, (i - 15) * 0.005)), 3)
        slot_capacity = 7 if i < 46 else 6
        levels.append(
            {
                "id": i,
                "chapter": chapter,
                "petTypes": pet_types,
                "totalTiles": total_tiles,
                "layers": layers,
                "slotCapacity": slot_capacity,
                "obstacleRate": obstacle_rate,
                "target": "clear_all",
            }
        )

    return {"levels": levels}


def main():
    payload = build_levels()
    for out in [Path("config/levels.json"), Path("assets/resources/config/levels.json")]:
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
