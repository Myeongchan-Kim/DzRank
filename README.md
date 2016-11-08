# DzRank
show reginmal disease forcast in Korea

# API
## GET
```
/show/total
```
- 현재까지 14일 동안의 전국 순위 테이블을 보내줍니다. 
  
```
/show/total/{end_date}
```
- end_date 까지 14일 동안의 전국 순위 테이블을 보내줍니다. 
  

```
/show/total/{start_date}/{end_date}
```
- start_date 부터 end_date 까지의 전국 테이블을 보내줍니다. 
  
  
```
/regional/{region_num}
```
- region_num 지역의 14일 동안의 테이블을 보여줍니다. 
  
  
```
/regional/{region_num}/{end_date}
```
- 이하동문
  
  
```
/regional/{region_num}/{start_date}/{end_date}
```
- 이하동문
  
  
  
## POST
```
/test_temp
aid : Device ID  
fever : temperature that recorded  
```
