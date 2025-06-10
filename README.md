# IKEA CAO Assistent

De **IKEA CAO Assistent** is een gebruiksvriendelijke webapplicatie die medewerkers van IKEA helpt bij het beantwoorden van vragen over de cao. Gebruikers kunnen natuurlijke taal gebruiken om vragen te stellen, en de assistent reageert direct met informatie gebaseerd op de cao-teksten. De applicatie draait op een eigen backend met behulp van de Azure OpenAI API.

https://stud.hosted.hr.nl/0986809/IKEA-AI/

## Inhoud

- [Installatie](#installatie)
- [Gebruik](#gebruik)
- [Structuur van het project](#structuur-van-het-project)
- [API Keys en .env bestand](#api-keys-en-env-bestand)
- [Veelvoorkomende problemen](#veelvoorkomende-problemen)

---

## Installatie

1. Clone deze repository:
   ```bash
   git clone https://github.com/jouw-gebruikersnaam/ikea-cao-assistent.git
   cd ikea-cao-assistent
2. Installeer de dependencies voor de server:
    ```bash
    cd server
    npm install

3. Maak een .env bestand aan in de server map met jouw Azure OpenAI gegevens:
    ``` bash 
    AZURE_OPENAI_API_KEY=your_api_key_here
    OPENAI_API_VERSION=your_api_version_here
    INSTANCE_NAME=your_instance_name_here
    ENGINE_NAME=your_engine_name_here

4. Start de server:
    ```bash
    node server.js

5. Open index.html in de client map via Live Server of een lokale webserver (bijv. VS Code Live Server).

## Gebruik

1. Typ een cao-gerelateerde vraag in het invoerveld.Bijv. "Hoeveel vakantiedagen heb ik recht op bij IKEA?"

2. Klik op "Stel je vraag".

3. Het antwoord verschijnt automatisch in de interface, gebaseerd op de ingevoerde vraag en context.

## Structuur van het project

ikea-cao-assistent
``` bash
├── client
│   ├── index.html       # De gebruikersinterface
│   ├── style.css        # IKEA-geïnspireerde stijl
│   ├── script.js        # Verwerkt input & toont output
│   └── assets/
│       └── ikea_logo.png
│
└── server
    ├── server.js        # Node.js backend met OpenAI-koppeling
    ├── .env             # Gevoelige API gegevens (lokaal)
    ├── .gitignore
    └── package.json
```
## API Keys en .env bestand

Zorg dat je .env bestand in de server map staat en nooit gedeeld wordt.

Voeg .env altijd toe aan .gitignore zodat je gevoelige data niet op GitHub belandt.
   ```bash
   OPENAI_API_TYPE=
   OPENAI_API_VERSION=
   OPENAI_API_BASE=
   AZURE_OPENAI_API_KEY= 
   DEPLOYMENT_NAME=
   ENGINE_NAME=
   INSTANCE_NAME=
```

## Veelvoorkomende problemen

CORS-fouten:

Voeg de cors middleware toe in je server.js:
```bash
    const cors = require("cors");
    app.use(cors());

