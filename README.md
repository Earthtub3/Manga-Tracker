# Manga Sammlung Tracker

Dies ist eine einfache Webanwendung zum Verwalten deiner Manga‑Sammlung. Du kannst Titel manuell hinzufügen, bearbeiten oder löschen und den Lesefortschritt für jedes Werk festhalten. Zusätzlich lassen sich über eine integrierte API‑Suche (Jikan, basierend auf der MyAnimeList‑Datenbank) grundlegende Informationen wie Autor, Kapitelzahl und Coverbilder automatisch abrufen. Alle Daten werden lokal im Browser gespeichert (Local Storage), wodurch keine Registrierung oder Datenbank erforderlich ist.

## Funktionen

- **Manga hinzufügen:** Über einen Dialog kannst du Titel eingeben und wahlweise per API nach relevanten Informationen suchen. Pflichtfeld ist lediglich der Titel, alle anderen Felder sind optional und können später angepasst werden.
- **Manga bearbeiten und löschen:** Jeder Eintrag kann im Nachhinein bearbeitet oder entfernt werden.
- **Statistiken:** Die Anwendung zeigt dir die Gesamtanzahl deiner Titel, die Summe gelesener Kapitel, die Gesamtzahl aller Kapitel sowie deinen prozentualen Fortschritt an.
- **Fortschrittsbalken:** Für jedes Werk wird ein Balken angezeigt, der das Verhältnis aus gelesenen zu gesamten Kapiteln visualisiert.
- **Suche & Filter:** Du kannst deine Bibliothek nach Titel durchsuchen und nach Status (z.B. „Lesend“, „Abgeschlossen“) filtern.
- **Responsive Design:** Die Seite funktioniert sowohl auf Desktop‑ als auch auf Mobilgeräten.

## Lokale Entwicklung

1. Klone dieses Repository oder kopiere den Ordner `manga-tracker-site` auf deinen Rechner.
2. Öffne die Datei `index.html` direkt im Browser oder starte einen lokalen Webserver (z. B. via `python -m http.server`) im Projektverzeichnis.
3. Die Anwendung speichert Daten ausschließlich im Local Storage deines Browsers. Wenn du deinen Verlauf oder Speicher löscht, gehen die Daten verloren. Über Browser‑Funktionen lassen sie sich jedoch exportieren, indem du den Eintrag `mangaLibrary` aus dem Local Storage sicherst.

## Deployment auf GitHub Pages

Für das Hosting über GitHub Pages kannst du wie folgt vorgehen:

1. Lege ein neues Repository auf GitHub an (z. B. `manga-tracker`).
2. Füge die Dateien aus `manga-tracker-site` in dein Repository ein und führe einen Commit durch.
3. Aktiviere GitHub Pages unter „Settings → Pages“ und wähle den Branch `main` bzw. `master` mit dem Ordner `root` aus.
4. Nach wenigen Minuten ist deine Seite unter `https://<dein‑nutzername>.github.io/<repository‑name>/` erreichbar.

Viel Spaß beim Verwalten deiner Manga!