# Audioguida – web app per iPad (esposizione)

Lettore audio a schermo intero per iPad, installabile dalla schermata Home, funzionante offline.
I file audio restano **solo sull'iPad**: online va pubblicato soltanto il codice.

## Contenuto della cartella

| File | Scopo |
|---|---|
| `index.html` | La app (interfaccia + logica) |
| `sw.js` | Service worker: rende la app disponibile offline |
| `manifest.json` | Nome e icona della app |
| `icons/` | Icone per la schermata Home |

## 1. Pubblicazione (una volta sola) – GitHub Pages

1. Crea un account gratuito su https://github.com
2. **New repository** → nome ad es. `audioguida` → **Public** → *Create repository*.
3. Nella pagina del repository: **Add file → Upload files** → trascina **il contenuto** della cartella
   (index.html, sw.js, manifest.json e la cartella icons) → *Commit changes*.
4. **Settings → Pages** → *Source: Deploy from a branch* → branch `main`, cartella `/ (root)` → *Save*.
5. Dopo 1–2 minuti la app è su: `https://<tuo-utente>.github.io/audioguida/`

Il repository è pubblico, ma contiene solo il codice: nessun file audio.

## 2. Installazione sull'iPad

1. Apri l'URL in **Safari** (con Wi-Fi).
2. Tocca **Condividi** → **Aggiungi alla schermata Home** → *Aggiungi*.
3. Da qui in poi apri la app **sempre dall'icona sulla Home**.

> Importante: la app aperta dalla Home ha una memoria **separata** da Safari.
> Importa gli audio **dopo** averla aperta dall'icona, non da Safari.
> Nella schermata Gestione, sotto "Info", è indicato da dove è stata avviata.

## 3. Copiare gli MP3 sull'iPad

Dal PC Windows, la via più semplice:
- **iCloud Drive**: carica i file da https://www.icloud.com/iclouddrive nel browser del PC,
  oppure
- **OneDrive / Google Drive**: carica dal PC e installa la relativa app sull'iPad.

I file diventano visibili nell'app **File** dell'iPad e si selezionano dalla app al punto successivo.

Consiglio: rinomina i file con un numero davanti (`01 - Benvenuto.mp3`, `02 - La facciata.mp3`, …).
L'importazione li ordina così e toglie il numero dal titolo mostrato.

## 4. Gestione brani

- Tieni premuto **3 secondi l'angolo in alto a destra** dello schermo.
- Codice iniziale: **1234** → cambialo subito nella sezione *Codice di accesso*.
- **+ Aggiungi file audio** → seleziona più file insieme.
- Per ogni brano puoi modificare il titolo, spostarlo su/giù o eliminarlo.
- Imposta titolo e sottotitolo della schermata, il passaggio automatico al brano successivo
  e il ritorno alla schermata iniziale dopo inattività.
- La gestione si chiude da sola dopo 3 minuti senza tocchi.

## 5. Test prima dell'esposizione

1. Attiva **modalità aereo**, chiudi la app (scorri via dal multitasking) e riaprila dall'icona:
   deve partire e riprodurre tutti i brani.
2. Riavvia l'iPad e verifica che i brani siano ancora presenti.
3. Lascia il tutto acceso alcune ore collegato a casse e alimentatore.

## 6. Blocco su questa app – Accesso guidato

1. **Impostazioni → Accessibilità → Accesso guidato** → attiva.
2. *Impostazioni codice*: imposta un codice (e Touch ID se vuoi).
3. *Blocco automatico schermo* → **Mai**.
4. Apri la app → **triplo clic sul tasto Home** → *Opzioni*:
   tasto standby **off**, movimento **off**, tastiere **off**, tocco **on**,
   tasti volume a scelta → **Avvia**.
5. Per uscire: triplo clic sul tasto Home + codice o Touch ID.

Fai le modifiche nella schermata Gestione **prima** di avviare l'Accesso guidato:
con le tastiere disattivate non potrai scrivere titoli (il codice di sblocco invece funziona,
perché usa il tastierino della app).

## 7. Aggiornare la app

1. Modifica i file.
2. In `sw.js` aumenta la versione: `audioguida-v1` → `audioguida-v2`.
3. Ricarica i file su GitHub (Upload files, sovrascrivi).
4. Sull'iPad, con Wi-Fi: apri la app, chiudila e riaprila (eventualmente due volte).

Gli audio importati non vengono toccati dagli aggiornamenti.
**Se elimini l'icona dalla Home perdi anche gli audio importati**: andranno reimportati.

## Prova sul PC (facoltativa)

Nella cartella, da PowerShell:

```powershell
python -m http.server 8080
```

Poi apri `http://localhost:8080` in Chrome o Edge.
