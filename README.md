# DzRank
show reginmal disease forcast in Korea

# API
## GET

```
/show/total
- 현재까지 14일 동안의 전국 순위 테이블을 리스트로 반환합니다. 
```
```
response : 내림차순 정렬되어 있습니다.
[
{ "dzNum": memo에서 입력한 질병 번호,
  "dzName": 질병이름,
  "diz_count": 해당 항목 갯수,
  "ratio": 전체 질병에서의 해당질환의 비율 입니다. 1 ~ 0 사이의 값입니다.  ,
  "trend": 지난 주 해당 질환의 퍼센티지를 1 로 놓았을때 상대적인 이번 주의 퍼센티지 입니다. 저번주에 0건이었던 질병은 -1로 처리합니다. },
},
{...},
{...},
]
```

  
```
/show/total/{end_date}
```
- end_date 까지 14일 동안의 전국 순위 테이블을 보내줍니다. 
- 반환형식은 위와 같습니다.  

```
/show/total/{start_date}/{end_date}
```
- start_date 부터 end_date 까지의 전국 테이블을 보내줍니다. 
- 반환형식은 위와 같습니다.  
  
```
/regional/{region_num}
```
- region_num 지역의 14일 동안의 테이블을 보여줍니다. 
- 반환형식은 위와 같습니다.  
  
```
/regional/{region_num}/{end_date}
```
- 이하동문
  
  
```
/regional/{region_num}/{start_date}/{end_date}
```
- 이하동문
  
  
  
# 웨어러블 테스트용
## POST
```
/test_temp
aid : Device ID  
fever : temperature that recorded  
```
```
올바른 응답일 경우  
{
  "fieldCount":0,
  "affectedRows":1,
  "insertId":2,
  "serverStatus":2,
  "warningCount":0,
  "message":"",
  "protocol41":true,
  "changedRows":0
}
```
