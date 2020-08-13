# Where Do Birth Generations Live?

## Final Practicum GEOG 778 - University of Wisconsin Madison


Scrollytelling Page: https://kyle-mcnair.github.io/birth-generation-map/index.html

Interactive Map: https://kyle-mcnair.github.io/birth-generation-map/map/index.html

### About the Project
The project was inspired by Robert Manduca's [Where Are The Jobs?](http://www.robertmanduca.com/projects/jobs.html?utm_content=buffer903c7&utm_medium=social&utm_source=plus.google.com&utm_campaign=buffer) and Kyle Walker's [Educational Attainment in America](http://personal.tcu.edu/kylewalker/maps/education/#12/37.7536/-122.4473)

This project is divided into two sections: scrollytelling and an interactive dot-density map. The topic discusses where majority of the population in the United States lives by birth generation. Spatial and tabular data was provided from the National Historical GIS ([NHGIS](https://www.nhgis.org/)).

Provided by NHGIS, the spatial files needed for whole analysis (scrollytelling & interactive map):
  * United States Boundary
  * State Boundaries (DC included)
  * Urban Area Boundaries
  * U.S. Census Block Groups
  * U.S. Census Blocks

Tabular files for whole analysis (scrollytelling & interactive map) was brought from the American Community Survey (ACS) in NHGIS to use the Total Population - Sex by Age (B01001) Table. All tables were downloaded at the following geographic scales:
  * U.S. Census Block Groups 2014-2018
  * U.S. Census Block Groups 2009-2013
  * 2010 U.S. Census Blocks
  * Urban Areas
  * States
    * State data was added together to get national numbers.

Python was used to create the dot-density point and randomly place them within each U.S. Census Block Group. Because there are so many points being loaded onto a map, Mapbox's [Tippecanoe](https://github.com/mapbox/tippecanoe) was used to have the points be converted to vector tiles.

**Note:** Tippecanoe works best on a Mac device, but if using a Windows device, I found [ArcGIS2Mapbox](https://github.com/GISupportICRC/ArcGIS2Mapbox) to be very helpful.

Scrollytelling was used from [Scrollama.js](https://github.com/russellgoldenberg/scrollama) and [D3.js](https://d3js.org/), while the interactive dot-density map was used with [Mapbox GL](https://docs.mapbox.com/mapbox-gl-js/api/).

The interactive dot-density map portrays the approximate population density of each birth generation. The map shows an approximate distribution of population count by birth generation at different zoom scales. Random dot placement does **not** imply that the count of that particular birth generation lives in that specific point location, it is to imply that there is a population count of that birth generation within that U.S. Census Block Group.

### Order of Scripting
When organizing the data, these were the following scripts used in this order:
1. **Organize_Population_Count.py**
    * This script organizes the population data from the American Community Survey.
    * Mostly done for creating JSON files in the scrollytelling page. However, this tool was run to complete the analysis at the National, State, and Urban Area level.
2. **Find_Blank_Blocks.py**
    * In order to have the random points be placed accurately, the script finds any U.S. Census Block in each state and exports a new state shapefile of Census Blocks with a population of zero.
    * Process is recommended, as random points could be placed on roads, large bodies of water, etc.
3. **Export_Block_Groups.py**
    * This script does need ArcGIS, as it uses arcpy to compute.
    * Script takes the U.S. Census Block Groups and makes a copy of the shapefile by state.
    * Script is only necessary to run if you have all the U.S. Census Block Group data at the national level.
4. **Erase_Blocks_from_Block_Groups.py**
    * Takes the shapefiles of Census Blocks uses it to erase the area on the state Census Block Group shapefiles.
5. **Randomize_Points.py OR Randomize_Changed_Points.py**
    * Takes the original tabular csv data and joins it with the state shapefile to create random points within each Census Block Group based on population and preferred dot-density scale.
    * For Randomize_Points.py:
      * The script will automatically export csv and parquet files, while giving the user the option to combine all the parquet files at the end.
      * From trials, having 1 Dot = 1 Person takes roughly 60 hours to compute. The dot-density of 1 Dot = 25 People takes approximately 3 hours.
      * **NOTE:** Alaska may take a very long time to process. It might be possible to randomly generate the points using ArcGIS and manually create the csv from there. This part of the analysis is what brought the parquet scripts to be created.
    * For Randomize_Changed_Points.py:
      * The script only exports csv files. If using small density (1 Dot = 1 Person), use the parquet python scripts below to convert and combine.
6. **Parquet_Conversion.py**
    * Highly recommended if user chose no in Randomize_Points.py, and had to manually create a csv for Alaska.
    * If necessary, this can be run. If the dot density is going to be small, csv files may be too large to later combine and convert to a geojson file.
7. **Combine_Parquets.py**
    * Takes all parquet files and merges them into one.
    * Necessary for reading the file and converting to geojson file.
8. **xy_to_geojson.py**
    * Reads the parquet file and converts the data into a geojson file.
    * A geojson is needed in Tippecanoe to convert the data to vector tiles.
