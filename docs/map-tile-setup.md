# Making Icewind Dale map tiles

Web makes are based on square tiles of the place they're mapping at various degrees of resolution - they have 16 zoom levels, where 1 shows the whole world, and 16 shows a tiny little snippet. To make a zoomable interactive map, we want to take one high-resolution source image and chop it into a set of squares for each zoom level.

The original blog I was following for this used Photoshop tile cutter - it sounds like a more simple tool if you have access!  (https://github.com/bramus/photoshop-google-maps-tile-cutter/)

Since I don't have Photoshop to hand, I looked around for alternatives and found mention of the GDAL toolset, which has a tool called `gdal2tiles` that can cut an image into webmap tiles and even auto-generates a set of HTML template that serve those as Leaflet or GoogleMaps or OpenLayers maps.

This turned out to be a bit more involved, but it taught me some interesting things about the field of tech and cartography called Geographic Information Systems.

## Installing GDAL 

First ensure you have Python available on your operating system of choice! Then take a look at the right way to install GDAL for your system - this great blog series goes over installation for Windows and Mac: https://medium.com/planet-stories/a-gentle-introduction-to-gdal-part-1-a3253eb96082.

I tried installing the python package from pip first, but I got suspicious errors about how I was missing various libraries, and I noticed that there's a `gdal-bin` package in my local Linux apt respository, so I ended up doing this:

```
sudo apt-get install libgdal-dev
gdal-config --version
sudo apt install gdal-bin
```

Quite likely I don't actually need the first two commands, just the third. Either way you should be able to run `gdalinfo` against a file and get some metadata back:

```
Driver: JPEG/JPEG JFIF
Files: raw-icewind-dale-map.jpg
Size is 6000, 4215
Image Structure Metadata:
  COMPRESSION=JPEG
  INTERLEAVE=PIXEL
  SOURCE_COLOR_SPACE=YCbCr
Corner Coordinates:
Upper Left  (    0.0,    0.0)
Lower Left  (    0.0, 4215.0)
Upper Right ( 6000.0,    0.0)
Lower Right ( 6000.0, 4215.0)
Center      ( 3000.0, 2107.5)
Band 1 Block=6000x1 Type=Byte, ColorInterp=Red
  Overviews: 3000x2108, 1500x1054, 750x527
  Image Structure Metadata:
    COMPRESSION=JPEG
Band 2 Block=6000x1 Type=Byte, ColorInterp=Green
  Overviews: 3000x2108, 1500x1054, 750x527
  Image Structure Metadata:
    COMPRESSION=JPEG
Band 3 Block=6000x1 Type=Byte, ColorInterp=Blue
  Overviews: 3000x2108, 1500x1054, 750x527
  Image Structure Metadata:
    COMPRESSION=JPEG
```

## Using it!

To chop an image into map tiles we need to provide some metadata:

1. A world file, which is a six-line set of information about how your image is positioned relative to the coordinate system you are using
2. Information on the "spatial reference system" we are using.

### World file

I thought about putting Icewind Dale somewhere where it could see the Aurora, but I understand it as you get nearer the poles, getting distances from coordinates starts to be more complicated, because the earth isn't round. So I put it in England because that's familiar enough I'd have a rough sense of whether I'd massively fucked up distances between places.

My world file is this:

```
1.0 # how many pixels to a metre
0 # skew of the image - 0 if north is up!
0 # skew of the image - 0 if north is up!
-1.0 # how many pixels to a metre, but inverted for mysterious reasons I didn't read about
-0.89751 # longitude for the top left pixel 
53.23102 # longitude for the top left pixel
```

The file needs to be saved with the same filename as your source image but a different suffix. The suffix is the first and last letters in the file extension and then w - so `jgw` for JPG, `pgw` for PNG. 

Save that file as `<your-image-filename>.jgw` or equivalent and then rerun the `gdalinfo` command from above. You should now see two files in the `Files` section, and the corner coordinates should match your world file.

```
$ gdalinfo mycoolfile.jgp
Driver: JPEG/JPEG JFIF
Files: source-data/raw-icewind-dale-map.jpg
       source-data/raw-icewind-dale-map.jgw
Size is 6000, 4215
Origin = (-1.397510000000000,53.731020000000001)
Pixel Size = (1.000000000000000,-1.000000000000000)
Image Structure Metadata:
  COMPRESSION=JPEG
  INTERLEAVE=PIXEL
  SOURCE_COLOR_SPACE=YCbCr
Corner Coordinates:
Upper Left  (  -1.3975100,  53.7310200) 
Lower Left  (      -1.398,   -4161.269) 
Upper Right (    5998.602,      53.731) 
Lower Right (    5998.602,   -4161.269) 
Center      (    2998.602,   -2053.769) 
Band 1 Block=6000x1 Type=Byte, ColorInterp=Red
  Overviews: 3000x2108, 1500x1054, 750x527
  Image Structure Metadata:
    COMPRESSION=JPEG
Band 2 Block=6000x1 Type=Byte, ColorInterp=Green
  Overviews: 3000x2108, 1500x1054, 750x527
  Image Structure Metadata:
    COMPRESSION=JPEG
Band 3 Block=6000x1 Type=Byte, ColorInterp=Blue
  Overviews: 3000x2108, 1500x1054, 750x527
  Image Structure Metadata:
    COMPRESSION=JPEG

```

## Coordinate System

The impression I get from reading around is that if you want to use mapping tools that work based on coordinates for a fake place, you have two options:

1. Use what's called a Projected Coordinate System, which means you declare a point of origin to be at 0,0 on your map and provide rules for how distances and coordinates relate yourself
2. Tell the mapping tools that your fake place is somewhere in the real world, which lets you reference one of the various existing Geographic Coordinate Systems, which translates degree-based coordinates like latitude & longitude into distance-based scales.

I took a stab at the latter, mostly because I could find examples of it being suggested to other people tinkering with fantasy world maps!

I took a look at my map and took a rough stab at estimating the distance it covered - it seemed like roughly 100 miles east-west, and 70 north-south. So I very half-assedly picked some places similar distances apart on a helpful third-party map here: https://www.calcmaps.com/map-distance/ and wrote down coordinates.

This gave me input information I could use as a `projwin` - project window, or bounding box for the area I want my web map to cover. Now, something to note here is that Leaflet and GDAL have different opinions about whether you put latitude or longitude first. Both GDAL and this bounding box finder tool want longitude (x) first, then latitude (y) second.

If like me this leaves you scratching your head, some kind soul has made a site called http://bboxfinder.com which you can feed coordinates in the format `(-0.89751,53.23102,1.575447,52.205)` to that tool and check it draws the right area.

After picking some coordinates, we can make a .vrt file with Gool Geography Facts gdal can use to make tiles! We want the output format `-of VRT` (don't make an image with the geodata embedded in it, just an XML file that lives alongside our source image). I am using the SRS `EPSG:4326` because it seemed very standard and I don't know better, and then the rest of the command is just the source file and the name of the .vrt file we want to create:

```
gdal_translate \
  -of VRT \
  -a_srs EPSG:4326 \
  -projwin -0.89751 53.23102 1.575447 52.205 \
  raw-icewind-dale-map.jpg raw-icewind-dale-map.vrt 
```

I also tried this command, which seemed to accomplish the same thing:

```
gdal_translate \
  -of VRT \
  -a_srs EPSG:4326 \
  -a_ullr -0.89751 53.23102 1.575447 52.205 \
  raw-icewind-dale-map.jpg \
  raw-icewind-dale-map.vrt
```

For a big map covering a big area, or one far towards the poles, this guide recommended warping the image to match your chosen SRS: https://developers.google.com/kml/articles/raster#install. I tried this and it didn't seem to make a difference for my case, but no harm in it! 

```
gdalwarp -of VRT -t_srs EPSG:4326 raw-icewind-dale-map.vrt  warped-icewind-dale-map.vrt  
```

After thus probably horribly misusing the hard work of some geometrics software engineers, we are ready to make some webmap tiles! Pick a map projection if you want to use a non-default (mercator) one, and then provide the zoom levels you want with `-z`. 1 is "the whole world" and 16 is "street-level". It'll take longer to do the most zoomed-in levels, but give the command the .vrt file we made above and let it run for somewhere between seconds and minutes:  

```
gdal2tiles.py --profile=mercator -z 8-13 warped-icewind-dale-map.vrt  
```

This will make a directory with the name of the file (without an extension) - so for me `warped-icewind-dale-map`. That will have one directory for each zoom level in, as well as subdirectories with image files. It'll also have `googlemaps.html`, `leaflet.html`, etc in! Open one of those you should have a lovely zoomable map!

## Debugging

If you don't have a map:

- check the files have images in and aren't just blank
- check the developer tools console in your browser for errors
- check your bounding box matches the coordinates in your world file 


## Reference:

- https://www.techtrail.net/creating-an-interactive-map-with-leaflet-js/
- cool background info on this! https://www.youtube.com/watch?v=EmfE9VyAYcY
gdal: https://alastaira.wordpress.com/2011/07/11/maptiler-gdal2tiles-and-raster-resampling/
mapping distances: https://github.com/aprilandjan/leaflet.measure
overlays (this guy knows what he's talking about) https://chris-osm.blogspot.com/2014/04/images-to-map-overlays.html
bounding: https://gis.stackexchange.com/questions/195306/specify-the-bounding-box-for-gdal2tiles
adding georeference data: https://gis.stackexchange.com/questions/84363/georeferencing-png-using-gdal
WORLDFILES: https://en.wikipedia.org/wiki/World_file
??: https://www.cartographersguild.com/showthread.php?t=5337
zoom: https://medium.com/geekculture/generating-map-tiles-at-different-zoom-levels-using-gdal2tiles-in-python-af905eecf954
https://github.com/noerw/leaflet-sidebar-v2

====
GDAL overview: https://medium.com/planet-stories/a-gentle-introduction-to-gdal-part-1-a3253eb96082
HATE COORDINATE SYSTEMS: https://ihatecoordinatesystems.com/#redefine
mapping features: https://mangomap.com/gis-mapping
explaining spatial reference systems: https://desktop.arcgis.com/en/arcmap/10.3/guide-books/map-projections/geographic-coordinate-system.htm
mappbox exaplining web maps: https://docs.mapbox.com/help/getting-started/web-apps/


http://132.72.155.230:3838/js/geojson-1.html


TOOLS:
http://bboxfinder.com/#-0.897510,-0.897510,53.231020,53.231020


NOT USEFUL BUT COOL:

mildly fascinating: https://www.geospatialworld.net/article/the-great-trigonometrical-survey-of-india/
guy who wrote some good blog posts: https://medium.com/@robsimmon

====

What i understand that I need to do:

1. provide a world file which has the scale, the lat/long of the top left, and rotation: http://webhelp.esri.com/arcims/9.3/General/topics/author_world_files.htm
2. provide a gdal translate command that specifies the spatial reference system im using (projection or similar), this creates a .vrt text file with metadata about my image
3. possibly warp my image to my desired projection (this should prolly not matter so much for a tiny projection!)
4. chop the image into tiles


----

questions: 
- what projection is suitable? i could use a non-geographic projection that just puts 0,0 at the middle of the image and uses entirely consistent units, but its harder to find examples that use this. so i could also just pretend icewind dale is in Cambridge and grab fake coordinates from there.

- how big is the map? it seems like its about 100miles across and 70 miles up/down.

