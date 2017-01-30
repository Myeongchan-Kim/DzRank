# real geoPlot

real_df = data.frame(name = "real pos", group = 1, latitude = 37.1, longitude = 127)
geoPlot(real_df, zoom=8, color = real_df$group)


#####################

rm(list = ls())

# install.packages("gdata")
require(gdata)
# install.packages("XML")
# install.packages("rjson")
# install.packages("RgoogleMaps")

# geoplot이 CRAN에 없어서 다운로드 했음
# install.packages("geoPlot_2.3.tar.gz", repos = NULL, type="source")
require(geoPlot)
require(class)

# 데이터 읽기(windows)
help('read.csv')
location_data = read.csv( "fever_location7.csv", sep="," , fileEncoding = "utf8");
head(location_data, 20)

df = data.frame(location_data)
colnames(df) = c("row", "id", "deviceID","latitude", "longitude", "addr1", "addr2", "addr3", "addr4", "addr5")
head(df, 20)

#백업
back_up = df[,2:9]
head(back_up)
write.csv(back_up, file = "fever_location7.csv", sep=",")

names(df)
summary(df)
names(df) <- tolower(names(df))
class(df$latitude)

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
sum(is.na(df$addr1))

head(df, 20)
summary(df)

# addr1 이 대한민국이거나 NA 인것만 남기기.
df_real = df[which(is.na(df$addr1)),] # real data
df_data = df[which(df$addr1 == "대한민국"),] # training data

## split test and train set
split <- 0.9
n_cases <- dim(df_data)[1]
n_cases
train_inds <- sample.int(n_cases,floor(split*n_cases))
test_inds <- (1:n_cases)[-train_inds]
df_test = df_data[test_inds,]
df_train = df_data[train_inds,]

summary(df_real)
summary(df_data)
summary(df_test)

help("dim")
n_data = dim(df_data)[1]
n_test = dim(df_test)[1]
n_triaing = dim(df_train)[1]
n_real = dim(df_real)[1]
n_total = dim(df)[1]

# 쓰지 않는 factor 제거

# train set
map_data = df_data[,c(3,7,4,5)]
map_train = df_train[,c(3,7,4,5)]
map_test = df_test[,c(3,7,4,5)]

head(map_train)
head(map_test)

table(map_train$addr2)
table(map_test$addr2)
map_train$addr2 = factor(map_train$addr2)
map_test$addr2 = factor(map_test$addr2)

# help("geoPlot")
geoPlot(map_train, zoom=7, color = map_train$addr2)

head(map_test)
head(map_train)

# 구하려는 set
map_real = df_real[,c(3,7,4,5)]
head(map_real)
map_real$addr2 = factor(map_real$addr2)
class(map_real$addr2)
table(map_real$addr2)

## - knn function
map_train$class = as.numeric(map_train$addr2)
map_test$class = as.numeric(map_test$addr2)
map_real$class = as.numeric(map_real$addr2)

head(map_train)
head(map_test)
head(map_real)

## 여기까지 완료
require(class)
require(ggplot2)

## train and test
k_max = 2

?knn
knn_pred = matrix(NA, ncol=2, nrow=length(map_test))
knn_pred = knn(map_train[,3:4], map_test[,3:4], cl=map_train[,5], k=2)
head(map_real)
head(map_train)
head(knn_pred)
head(solution_list)

## result!!!!!!!!!!!!!!
sum(knn_pred == solution_list)/length(solution_list) # oh my god

## make it to function

getAccuracy = function(train, test, k_max)
{
  knn_pred = matrix(NA, ncol=2, nrow=length(test))
  knn_pred = knn(train[,3:4], test[,3:4], cl=train[,5], k=k_max)
  
  ## result!!!!!!!!!!!!!!
  accuracy = sum(knn_pred == test[,5])/length(test[,5])
  print(accuracy)
  return(accuracy) # oh my god
}

resultDf = data.frame()
for(j in 1:20){
  ## split test and train set
  split <- 0.9
  n_cases <- dim(df_data)[1]
  train_inds <- sample.int(n_cases,floor(split*n_cases))
  test_inds <- (1:n_cases)[-train_inds]
  
  df_test = df_data[test_inds,]
  df_train = df_data[train_inds,]
  
  map_train = df_train[,c(3,7,4,5)]
  map_test = df_test[,c(3,7,4,5)]
  
  map_train$addr2 = factor(map_train$addr2)
  map_test$addr2 = factor(map_test$addr2)
  
  map_train$class = as.numeric(map_train$addr2)
  map_test$class = as.numeric(map_test$addr2)
  
  
  for(k in 1:15){
    acc = getAccuracy(map_train, map_test, k)
    accdf = data.frame(acc = acc, k = k)
    resultDf = rbind(resultDf, accdf) 
  }
}

resultDf$k = factor(resultDf$k)
summary(resultDf)
p = ggplot(resultDf, aes(k, acc))
p + geom_boxplot()

## apply for real
# help('knn')
k_max = 2
knn_pred = matrix(NA, ncol=2, nrow=length(map_real))
knn_pred = knn(map_train[,3:4], map_real[,3:4], cl=map_train[,5], k=2)
head(map_real)
head(map_train)
head(knn_pred)
head(solution_list)
sum(knn_pred == solution_list)

map_real$class = knn_pred
head(map_real)
addr_list = levels(map_train$addr2)
addr_list = data.frame(addr_list)
addr_list
# help('setNames')
setNames(addr_list, c("addr2"))
addr_list$class = row(addr_list)
addr_list = addr_list[,2:1]
addr_list
head(map_real, 20)

help('merge')
result = merge(map_real, addr_list)
head(result, 20)
summary(result)
head(map_real, 20)
result2 = result[,c(6, 2, 4,5)]
summary(result2)
summary(map_real)
head(result2)

geoPlot(map_train, zoom=8, color = map_train$class)
geoPlot(map_real, zoom=7, color = map_real$class)
geoPlot(result2, zoom=8, color=result2$addr_list)

# k= 1

help('knn')
k_max = 1
knn_pred = matrix(NA, ncol=2, nrow=length(map_real))
knn_pred = knn(map_train[,3:4], map_real[,3:4], cl=map_train[,5], k=1)
head(map_real)
head(map_train)
head(knn_pred)
map_real$class = knn_pred
head(map_real)
addr_list = levels(map_train$addr2)
addr_list = data.frame(addr_list)
addr_list
help('setNames')
setNames(addr_list, c("addr2"))
addr_list$class = row(addr_list)
addr_list = addr_list[,2:1]
addr_list
head(map_real, 20)

help('merge')
result = merge(map_real, addr_list)
head(result, 20)
summary(result)
head(map_real, 20)
result2 = result[,c(6, 2, 4,5)]
summary(result2)
summary(map_real)
head(result2)

help('geoPlot')
geoPlot(map_train, zoom=7, color = map_train$class)
geoPlot(map_real, zoom=7, color = map_real$class)
geoPlot(result2, zoom=7, color=result2$addr_list)


# k= 3

help('knn')
k_max = 3
knn_pred = matrix(NA, ncol=2, nrow=length(map_real))
knn_pred = knn(map_train[,3:4], map_real[,3:4], cl=map_train[,5], k=3)
head(map_real)
head(map_train)
head(knn_pred)
map_real$class = knn_pred
head(map_real)
addr_list = levels(map_train$addr2)
addr_list = data.frame(addr_list)
addr_list
help('setNames')
setNames(addr_list, c("addr2"))
addr_list$class = row(addr_list)
addr_list = addr_list[,2:1]
addr_list
head(map_real, 20)

help('merge')
result = merge(map_real, addr_list)
head(result, 20)
summary(result)
head(map_real, 20)
result2 = result[,c(6, 2, 4,5)]
summary(result2)
summary(map_real)
head(result2)

help('geoPlot')
geoPlot(map_train, zoom=7, color = map_train$class)
geoPlot(map_real, zoom=7, color = map_real$class)
geoPlot(result2, zoom=7, color=result2$addr_list, maptype = "hybrid")


