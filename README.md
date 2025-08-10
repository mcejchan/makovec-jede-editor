# Level Editor - 2D Platformer

Editor levelů pro 2D plošinovku s podporou různých typů bloků a pohyblivých platforem.

## Struktura projektu

```
level-editor/
├── index.html          # Hlavní HTML soubor
├── css/
│   ├── main.css       # Základní styly
│   ├── panels.css     # Styly pro panely
│   └── modal.css      # Styly pro modální okna
├── js/
│   ├── main.js        # Hlavní inicializační soubor
│   ├── config.js      # Konfigurace a konstanty
│   ├── grid.js        # Správa herního gridu
│   ├── drawing.js     # Vykreslování na canvas
│   ├── tools.js       # Správa nástrojů a kreslení
│   ├── platform.js    # Správa pohyblivých platforem
│   ├── import-export.js # Import a export levelů
│   └── ui.js          # Správa UI
└── README.md          # Tento soubor
```

## Funkce

- **Nástroje pro kreslení**: Pevný blok, vymazání, mince, nepřítel, start hráče, exit dveře, pohyblivá platforma
- **Editace gridu**: Změna velikosti, vyčištění, vyplnění podlahy, vytvoření okrajů
- **Import/Export**: Možnost importovat a exportovat levely jako JavaScript kód
- **Vizualizace**: Zobrazení pohybového rozsahu platforem

## Použití

1. Otevřete `index.html` v prohlížeči
2. Vyberte nástroj z levého panelu
3. Klikněte a táhněte na canvasu pro kreslení
4. Použijte tlačítka pro rychlé akce
5. Exportujte level pomocí tlačítka "Export levelu"

## Typy bloků

- **0** - Prázdno (světle modrá)
- **1** - Pevný blok (hnědá)
- **2** - Mince (zlatá)
- **3** - Nepřítel (červená)
- **4** - Pohyblivá platforma (tmavě tyrkysová)
- **5** - Exit dveře (fialová)
- **6** - Start hráče (zelená)

## Přizpůsobení

Konfigurace se nachází v souboru `js/config.js`, kde můžete upravit:
- Výchozí velikost gridu
- Limity velikosti
- Velikost buňky
- Barvy bloků
- Rozsah pohybu platforem