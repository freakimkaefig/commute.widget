Übersicht | Commute Widget
==========================

Displays the next connection for a defined journey inside the public transportation of Stuttgart, Germany (VVS).

![Screenshot](lib/screenshot.png)


Configuration
-------------

The origin and destination of the journey can be configured in `lib/efa.js`.

To find out which strings match which location, you can use the [Elektronische Fahrplanauskunft](https://www3.vvs.de/). Open the Chrome Developer Panel (or the one of your favorite browser). Search for your origin and destination on the page. Once you hit the "Anfordern"-Button, you can lookup the request url in the network panel.

![Configuration](lib/configuration.png)

The fields `name_origin` and `name_destination` need to be copied to the regarding variable in `lib/efa.js`.

