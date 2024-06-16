# Study Buddy

De "Study Buddy" is een webapplicatie die studenten helpt met gepersonaliseerde studietips en advies. Het maakt gebruik van de Azure OpenAI API om vragen van studenten te beantwoorden en relevante begeleiding te bieden. De applicatie bestaat uit een client- en servercomponent en biedt een gebruiksvriendelijke interface voor interactie met de AI.


## Inhoud

- [Installatie](#installatie)
- [Gebruik](#gebruik)
- [Structuur van het project](#structuur-van-het-project)
- [API Keys en .env bestand](#api-keys-en-env-bestand)
- [Mogelijke problemen](#mogelijke-problemen)

## Installatie

Volg deze stappen om het project lokaal op te zetten:

1. Clone de repository:
    ```bash
    git clone https://github.com/jouw-gebruikersnaam/study-buddy.git
    cd study-buddy
    ```

2. Installeer de benodigde pakketten voor de server:
    ```bash
    cd server
    npm install
    ```

3. Maak een `.env` bestand in de `server` directory en voeg je OpenAI API keys toe:
    ```
    AZURE_OPENAI_API_KEY=your_api_key_here
    OPENAI_API_VERSION=your_api_version_here
    INSTANCE_NAME=your_instance_name_here
    ENGINE_NAME=your_engine_name_here
    ```

4. Start de server:
    ```bash
    node server.js
    ```

5. Open de `index.html` file in de `client` directory in je browser.

## Gebruik

1. Voer je vraag in het invoerveld in.
2. Klik op de knop "Ask a Question".
3. De server zal de vraag verwerken en een antwoord van de OpenAI API ophalen.
4. Het antwoord wordt weergegeven in de interface.

## Structuur van het project

Het project heeft de volgende structuur:

study-buddy
├── CLIENT
│ ├── index.html
│ ├── script.js
│ └── style.css
└── SERVER
├── .env
├── .gitignore
├── server.js

study-buddy
├── SERVER
│ ├── .env
│ ├── .gitignore
│ ├── server.js
├── CLIENT
│ ├── index.html
│ ├── script.js
│ ├──style.css


- **CLIENT**: Bevat de client-side code van de applicatie.
  - `index.html`: De HTML-file voor de interface.
  - `script.js`: De JavaScript-file die verantwoordelijk is voor de logica aan de client-side.
  - `style.css`: De CSS-file voor de styling van de applicatie.

- **SERVER**: Bevat de server-side code van de applicatie.
  - `.env`: Bevat de API keys (niet meeverzonden in de repository).
  - `.gitignore`: Bestanden en mappen die moeten worden genegeerd door git.
  - `server.js`: De hoofdserverfile.
  - `package.json`: Bevat de informatie en afhankelijkheden van het project.

## API Keys en .env bestand

Zorg ervoor dat je je API keys veilig opslaat in een `.env` bestand in de `server` directory. Dit bestand moet er als volgt uitzien:

OPENAI_API_TYPE=___
OPENAI_API_VERSION=___
OPENAI_API_BASE=___
AZURE_OPENAI_API_KEY=___
DEPLOYMENT_NAME=___
ENGINE_NAME=___
INSTANCE_NAME=___

**Let op**: Deel je API keys nooit publiekelijk. Voeg `.env` toe aan je `.gitignore` bestand om te voorkomen dat het wordt gepusht naar GitHub.

## Mogelijke problemen

- **CORS-fouten**: Als je CORS-gerelateerde fouten krijgt, zorg er dan voor dat de juiste CORS-instellingen zijn geconfigureerd op de server. Voeg bijvoorbeeld de `cors` middleware toe aan je Express-server:

    ```javascript
    const cors = require("cors");
    app.use(cors());
    ```