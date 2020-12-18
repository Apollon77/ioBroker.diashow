![Logo](admin/diashow.png)
# ioBroker.diashow

[![NPM version](http://img.shields.io/npm/v/iobroker.diashow.svg)](https://www.npmjs.com/package/iobroker.diashow)
[![Downloads](https://img.shields.io/npm/dm/iobroker.diashow.svg)](https://www.npmjs.com/package/iobroker.diashow)
![Number of Installations (latest)](http://iobroker.live/badges/diashow-installed.svg)
![Number of Installations (stable)](http://iobroker.live/badges/diashow-stable.svg)
[![Dependency Status](https://img.shields.io/david/gaudes/iobroker.diashow.svg)](https://david-dm.org/gaudes/iobroker.diashow)
![Test and Release](https://github.com/gaudes/ioBroker.diashow/workflows/Test%20and%20Release/badge.svg)

[![NPM](https://nodei.co/npm/iobroker.diashow.png?downloads=true)](https://nodei.co/npm/iobroker.diashow/)

[Deutsche Beschreibung](#deutsch)

[English description](#english)

![Demo](docs/img/demo.gif)

## <a name="deutsch"></a>Diashow Adapter für ioBroker
Dieser Adapter für ioBroker stellt eine Diashow für VIS zur Verfügung.

Folgende Quellen stehen aktuell zur Verfügung:

* Die letzten acht täglichen Bilder von Bing.com
* Via VIS-Dateimanager hochgeladene Bilder
* Bilder aus beliebigem Pfad im Dateisystem

Zur Darstellung in VIS stellt der Adapter ein Widget zur Verfügung.
Dieses bietet auch Funktionen für Effekt beim Bildwechsel, beispielsweise sanftes Ein- und Ausblenden.
Zusätzlich kann ein Timeout eingestellt werden. Sofern auf anderen View im Projekt keine Aktion für das eingestellte Timeout erfolgt ist,
wird zur View mit der Diashow gewechselt. Durck Klicken des Bilds wird entweder zurück zur letzten Ansicht oder zu einer eingestellten Ansicht gewechselt.

### Konfiguration
In den Einstellungen des Adapters wird die Quelle der Bilder ausgewählt, außerdem das Intervall für den Wechsel der Bilder, beispielsweise 10 Sekunden.

Bei Auswahl der Quelle "Dateisystem" kann dann noch der Pfad im Dateisystem ausgewählt werden, außerdem das Format (Hoch- oder Querformat) der anzuzeigenden Bilder.

### VIS-Widget
Das Widget ist in der Kategorie "diashow" enthalten.

Das Widget sollte in eine eigene View integriert werden. Hierdurch lässt sich der automatische Start der Diashow nutzen.

Folgende Einstellungen sind möglich:

* Object-ID: Hier muss der vom Adapter erzeugte Datenpunkt ausgewählt werden, beispielsweise "diashow.0.picture"
* Abschnitt "Effekt"
	* DiashowEffect: Als Effekt kann zwischen folgenden gewählt werden:
		* "Kein"
		* "Fade": Einfaches Verblassen und Erscheinen
		* "Transition": Überblenden
		* "jQuery-Effekt": Diverse jQuery-Effekte, beispielsweise Rolladen
	* Übergangsphase: Zeit in Millisekunden für den Effekt, gute Werte sind 500 oder 1000ms
	* Transition Style: Stil für "Transistion" und "jQuery-Effekt"
	* jQuery-Effekt: Gewünschter jQuery-Effekt
* Abschnitt "Automatischer Diashow-Start"
	* Aktivierung des automatischen Starts
	* Timeout: Nach welcher Zeit ohne Aktion auf die Diashow-View gewechselt wird
	* Ziel beim Klicken:
		* Zuletzt verwendete Ansicht
		* Konfigurierte Ansicht (siehe nächster Einstellung)
		* Kein, falls beispielsweise ein eigener Button integriert werden soll
	* Zielansicht: Aufzurufende Ansicht beim Verlassen der Diashow

## <a name="english"></a>Diashow Adapter for ioBroker
This Adapter for ioBroker provides a Diashow for VIS.

The following Sources can actually be used:

* The last eight daily pictures from Bing.com
* Pictures uploaded by VIS-File-Manager
* Pictures from file system path

The Adapter provides a Widget for Presentation in VIS, which offers effects on picture change, for example smooth fade-out and fade-in.
Additionally a timeout can be configured. When on other views in the same VIS project no actions for the defined timeout occured, the view with the Diashow will be started. With a click on the picture it changes back to the last view or to a predefined view.

### Configuration
In the Adapter settings the picture source can be choosen. Although the interval for picture change.

When source "File system" is selected, the path can be entered and the format (landscape or portrait) of the pictures to be shown.

### VIS-Widget
The Widget can be found in category "diashow".

The widget should be integrated in an own view, so the automatic start of the Diashow can be used.

The following configuration options exist:

* Object-ID: The ioBroker object created by the adapter must be provided, for example "diashow.0.picture"
* Category "Effect"
	* DiashowEffect: The following options are available:
		* "None"
		* "Fade": Simple fade-out and fade-in
		* "Transition": fade-over
		* "jQuery-Effekt": Different jQuery effects, for example "blind"
	* Transition period: Time in miliseconds for the effect, 500 or 1000 are recommended values
	* Transition style: Style for "Transistion" und "jQuery-Effect"
	* jQuery-Effect: Desired effect
* Category "Automatic Diashow start"
	* Enable automatic start
	* Timeout: After which time in seconds of inactivity on other views the Diashow will be started
	* Target on click:
		* Last used view
		* Configured view (see next setting)
		* None, for example when integrating another widget therefore
	* Target view: View to show when leaving Diashow

## Changelog
<!--
	Placeholder for the next version (at the beginning of the line):
	### __WORK IN PROGRESS__
-->

### 0.0.1
* (Gaudes) initial release

## License
MIT License

Copyright (c) 2020 Gaudes <ralf@gaudes.net>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.