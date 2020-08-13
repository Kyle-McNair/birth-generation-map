import arcpy

arcpy.env.overwriteOutput = True

states = ["AL","AK","AZ","AR","CA","CO","CT","DC","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT",
                    "NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"]

state_count = len(states)

shp = "Enter File Path"
shp = arcpy.MakeFeatureLayer_management(shp)

#Goes into the state shapefile and erases the areas where the Census Block had a population of zero.
def EraseBlocks(bg, erase, s):
    output = "Enter File Path"+s+"_new_bg.shp"
    arcpy.Erase_analysis(bg, erase, output)

#iterates through the 51 states (and DC) to erase the blocks inside the block groups.
for s in states:
    arcpy.AddMessage("Erasing "+s+" blocks..")
    erase = "Enter File Path"+s+"_blank_block.shp"
    bg = "Enter File Path"+s+"_BG.shp"
    EraseBlocks(bg, erase, s)
    arcpy.AddMessage(s + " completed")
