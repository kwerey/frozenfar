# Current state

We use Leaflet.draw to let users draw lines, then we use the 'created' and 'edited' events to trigger a handler function which adds a popup that gives distances between relevant points.

The user-drawn objects and the popup markers are both added to a 'drawnItems' layer group, which means the deletion tools work on them: users can delete their own markers.

Leaflet.draw docs: https://leaflet.github.io/Leaflet.draw/docs/leaflet-draw-latest.html 

## Potential changes

### Distance calculation

My coordinate grid is too big, so distances get over estimated. For now I have just hackishly divided the distance derived from coordinates by a vaguely right amount. This has several problems

* The popup on hover shows the proper L.marker.distanceTo() value
* It's a janky eyeballed estimate & it'd be nicer to just let the geography maths stuff do things right

I could solve this by figuring out an accurately sized coordinate grid and recutting the tiles to it. But it's kinda a nice-to-have that I want because I'm being pedantic!

### Marker behaviour

I considered making the markers update and be deleted automatically on the edit/delete events, but you can't look up a marker by its lat/lon. It looks like one way to do this would be:

* Create an array with the key named something predictable (like coordinates for the first marker with a prefix) in the create event function
* Push all markers into that array
* On the delete event, the coords of the first marker (`e.layer._latlngs[0]`) to look up that array
* Then simply delete the markers

I don't think the markers would behave in a reasonable way on edit though, so putting it all in the user's control and trusting in Leaflet.draw's tools to have better UX flow than my janky investigations seems like a sound call.
