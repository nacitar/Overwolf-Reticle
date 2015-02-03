Overwolf-Reticle
================

A reticle overlay for overwolf.

An online demo is available at: http://www.ubercpp.com/overlay/files


Installation
============
Until the Overwolf team arrive at an official stance on overlays of this
nature, it will not be available in the app store.  I have high hopes for this
eventually being accepted as there are some game-specific apps in the store
that already include similar things.  Until then however...


Either clone the github repository or in your browser click the "Download ZIP"
button at the bottom of the right-side panel and then extract that zip
somewhere.  Run the developer version of overwolf, open the "Settings" window,
go to "Support" and click the "Development Options" link.  At the packages
window, choose "Load unpacked extension..." and navigate to the "overlay"
folder inside this repository, then click "OK".

Reminder: you choose the _overlay_ folder; not the outermost folder.


Usage
=====
This application is only visible within a game.  The default command to open
the Settings window is _CTRL-Shift-Backspace_ but this can be changed in
overwolf's settings.  You simply open settings, configure your reticle, click
"Hide" and you're ready to go.  Your settings will persist across play
sessions and you can also save profiles in case you wish to configure it
differently in some instances.  If you wish to share your current crosshair
with a friend, you can use the "Sharing" section to export your settings to an
input box where you can then copy/paste the data to your friend.  Your friend
can then copy/paste the data into the same box on his overlay and import them.


Features
========
Allows you to place a cross, outline-circle, circle/square, and an image in the
center of your screen with various customizations.  You can change the opacity
of the reticle, as well as the render-mode for each component of it.  As far as
render modes, I recommend using geometricPrecision for circular objects and
crispEdges for rectangular ones.


Future Plans
============
Use the filesystem plugin to allow local images instead of only web URLs, and
perhaps bundle a collection of desirable crosshair images.


Remarks
=======
The code was written by myself, however the concept came from another overlay
with similar but different features called "Ultimate-Crosshair".  In fact, the
only reason I found out that Overwolf even exists is because I found that
overlay.  I encourage competition, and only want you to choose my overlay if it
better meets your needs.

Ultimate Crosshair: https://github.com/tgienger/Ultimate-Crosshair
