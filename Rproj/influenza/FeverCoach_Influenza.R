# feverCoaach_Influenza.r
# getwd()
rm(list = ls())

getwd();
setwd('~/ML-AI_study/Rproj')

# data = read.csv('Influenza_location.csv')
# remove same dx on table

# data = read.csv('Influenza_location_group.csv')
# select only in Dec, 2016

## FROM SQL...
# data = read.csv('Influenza_location_Dec.csv')
# 1327 row
# data = read.csv("Influenza_Dec_baby.csv")
# 3412 rows..
# data = read.csv("Influenza_OctNovDec_baby.csv")

data = read.csv("Influenza_JAN_BABY.csv"); # from 2016, Nov
# 2824 rows..

data = data[ , !(names(data) == 'X')]

summary(data)
data$hash_id = as.character(data$hash_id)
data$date = as.character(data$date)
data$date = as.POSIXct(data$date)

summary(data$date)
summary(data$loc_1)
summary(data$address_2)

## Make dzNum
finDzNum = function(string){
  if(nchar(string) > 10){
    x = strsplit(string, split = "_")[[1]]
    index = match("1", x) - 1
    return(index)
  }
  else 
    return(string)
}

data$dz_raw = as.character(data$dz_raw)
data$dzNum = sapply(X = data$dz_raw, FUN = finDzNum )

## Check all is correct.
sum(is.na(data$dzNum))  # not
class(data$dzNum)

## Maybe etc is proper...
data$dzNum[is.na(data$dzNum)] = 22
sum((data$dzNum == 22))
sum(data$dzNum == 21)
data$dzNum = factor(data$dzNum)
table(data$dzNum)

## Make loc -> longitude and latitude
class(data$loc_1)
data$loc_1 = as.character(data$loc_1)
data$loc_2 = as.character(data$loc_2)
data$longitude = as.numeric(data$loc_2)
data$latitude = as.numeric(data$loc_1)
summary(data$longitude)

data[is.na(data$longitude),]
sum(is.na(data$longitude))

# install geo code
# install.packages('ggmap')
library('ggmap')


## example of gemetry translation
# local_list = data.frame()
# gc <- as.numeric(geocode('서울시'))
# class(gc)
# gc <- rbind(gc, as.numeric((geocode('대전광역시'))))
# gc <- rbind(gc, '대전광역시')
# gc = geocode("서울시")
# gc$

## fill latitude
for(i in c(1:dim(data)[1])){
  if( is.na(data[i,]$longitude )) {
    result = geocode(data[i,]$loc_2)
    data[i,]$latitude = result$lat
    data[i,]$longitude = result$lon
  }
}

write.csv(data, file="Influenz_full_Nov_JAN.csv")
data_tmp = data;
data = read.csv("Influenz_full_Nov_JAN.csv")

## fill null value
which(is.na(data$longitude))
naId = which(is.na(data$longitude))
data[naId,]$latitude
gc = geocode('창원')
data[naId,]$latitude = gc$lat
data[naId,]$longitude = gc$lon

which(is.na(data$longitude))

which(is.na(data))
data$born_to_day[data$born_to_day == NULL]
head(data)
data$born_to_day = as.character(data$born_to_day)
data$born_to_day = as.numeric(data$born_to_day)
data = data[which(data$born_to_day > 10),]
bornMena = mean(data$born_to_day, na.rm = TRUE)
data$born_to_day[is.na(data$born_to_day)]
data$born_to_day[is.na(data$born_to_day)] = bornMena
summary(data$born_to_day)

data$weight = as.character(data$weight)
data$weight = as.numeric(data$weight)
summary(data$weight)
meanWeight = mean(data$weight, na.rm = TRUE)
data$weight[is.na(data$weight)] = meanWeight

summary(data$gender)
data$gender = as.character(data$gender)
data$gender = as.numeric(data$gender)
data$gender = as.factor(data$gender)

which(is.na(data$longitude))
which(is.na(data$latitude))
write.csv(data, 'Influenza_fill_na.csv')

data$X = NULL
head(data[,c(1, 5,8,9,10,11,12,13,14,15)])
df = data[,c(1, 5,8,9,10,11,12,13,14,15)]
class(df$date)
df$date = as.character(df$date)
df$date = as.Date(df$date)

attach(df)
df = df[order(date),]
detach(df);
head(df, 50)

# 이상한 data 검사
sum(is.na(df$latitude))
sum(df$latitude > 39) # 이북
sum(df$latitude < 33) # 마라도 북위 33
sum(df$longitude > 133) # 독도 동경132
sum(df$longitude < 125) # 백령도 

df = df[which(df$latitude < 39),]
df = df[which(df$latitude > 33),]
df = df[which(df$longitude < 133),]
df = df[which(df$longitude > 125),]

sum(df$latitude > 39) # 이북
sum(df$latitude < 33) # 마라도 북위 33
sum(df$longitude > 133) # 독도 동경132
sum(df$longitude < 125) # 백령도 
sum(is.na(df$longitude))

class(df$born_to_day)
head(df)
df = df[which(df$born_to_day > 10),]
## total 3386 data.

write.csv(df, 'ford3.csv')

summary(df$longitude)
summary(df$latitude)


# install.packages("gdata")
require(gdata)
# install.packages("XML")
# install.packages("rjson")
# install.packages("RgoogleMaps")

# geoplot이 CRAN에 없어서 다운로드 했음
# install.packages("geoPlot_2.3.tar.gz", repos = NULL, type="source")
require(geoPlot)

result = df[,c(1,8,10,9)]
head(result)
geoPlot(result, zoom = 7, color= result$dzNum)
?geoPlot

Influenza = result[which(df$dzNum == 7),]
Influenza
geoPlot(Influenza, zoom = 7, color = Influenza$dzNum)

result$bigLat = round(result$latitude * 10) / 10
result$bigLon = round(result$longitude * 10) / 10
result$bigLat = factor(result$bigLat)
result$bigLon = factor(result$bigLon)
summary(result$longitude)
summary(result$latitude)
summary(result$bigLon)
summary(result$bigLat)

write.csv(data, file = "influenzaResult.csv")
?write.csv

filteredData = result
write.csv(filteredData, file= "filteredDzinfo.csv")
head(filteredData)
filteredData$newFac <- with(filteredData, interaction(bigLat,  bigLon))
head(filteredData)
class(filteredData$newFac)
summary(filteredData$newFac)

geoPlot(filteredData[,c(1, 2,3,4)], zoom = 7, color = filteredData$dzNum)

tmpResult = filteredData[filteredData$bigLat == 37.5 & filteredData$bigLon == 126.9,]
dim(tmpResult)
summary(tmpResult)
summary(tmpResult$dzNum)
ratio =  dim(tmpResult[tmpResult$dzNum == 7,])[1] / dim(tmpResult)[1]
ratio

require("doBy")
head(filteredData)
class(filteredData$dzNum)
filteredData$dzNum = as.character(filteredData$dzNum)
filteredData$dzNum = as.numeric(filteredData$dzNum)
filteredData$dzNum = as.factor(filteredData$dzNum)
head(filteredData)
summary(filteredData$dzNum)
getRatio = function(x){
  sum(x == 7) / sum( x > -1) * 100
}
result = summaryBy(dzNum ~ bigLon + bigLat, data = filteredData, FUN= getRatio)
result
class(result)
names(result)  = c("longitude", "latitude", "ratio")
summary(result)
mapResult = cbind(1, result)
summary(mapResult)
mapResult = mapResult[c(1,4,3,2)]
mapResult$longitude = as.numeric(as.character(mapResult$longitude))
mapResult$latitude = as.numeric(as.character(mapResult$latitude))
mapResult$intensity = mapResult$ratio * 7
mapResult$intensity[mapResult$intensity > 255 ] = 255
summary(mapResult)

geoPlot(mapResult, zoom = 7, color = rgb(mapResult$intensity / 255 , (1 - mapResult$intensity / 255) / 1.5,0,1))

## revert location to address code sample
# ?revgeocode
# result = revgeocode(gc, output = 'more')
# result = sapply(gc, )
# # result = revgeocode(gc, output = 'all')
# local_list = rbind(local_list, result['locality'])
# local_list


