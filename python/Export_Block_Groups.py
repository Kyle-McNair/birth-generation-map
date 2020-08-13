import arcpy

arcpy.env.overwriteOutput = True

# dictionary of states with their fips code.
states = {
    'SC': '45', 'KY': '21', 'OR': '41', 'SD': '46',
    'FL': '12', 'WY': '56', 'NJ': '34', 'NM': '35', 
    'TX': '48', 'PA': '42', 'AK': '02', 'NV': '32', 'NH': '33', 'VA': '51', 'CO': '08',
    'LA': '22', 'NC': '37', 'ND': '38', 'NE': '31', 
    'TN': '47', 'NY': '36', 'IN': '18', 'IA': '19', 'MA': '25', 'AZ': '04', 'ID': '16', 'CT': '09',
    'MN': '27', 'MI': '26', 'RI': '44', 'KS': '20', 'MT': '30', 'MS': '28',
    'CA': '06', 'AL': '01', 'AR': '05', 'VT': '50', 'IL': '17', 'GA': '13',
    'WA': '53', 'DE': '10', 'DC': '11', 'WI': '55', 'WV': '54', 'HI': '15',
    'ME': '23', 'MD': '24', 'OK': '40', 'OH': '39', 'UT': '49', 'MO': '29',
}

shp = "Enter File Path"
shp = arcpy.MakeFeatureLayer_management(shp)

# Takes the entire national data and makes a copy of the shapefile by state.
def BlockGroupExport(st_id, st_abv, shp):
    selection = 'STATEFP = ' +"'"+ st_id+"'"
    attribute = arcpy.SelectLayerByAttribute_management(shp, "NEW_SELECTION", selection)
    arcpy.CopyFeatures_management(shp, "Enter File Path"+st_abv+"_BG")


for i, p in states.items():
    BlockGroupExport(p, i, shp)
