# DzRank
show reginmal disease forcast in Korea

# API
## GET
'''
/show/total
'''
- 14 days total table until NOW  
  
'''/show/total/{end_date}'''
- 14 days total table until end_date  

'''/show/total/{start_date}/{end_date}'''
- total table of from start_date until end_date
  
'''/regional/{region_num}'''
- 14 days regional table until NOW
- target region is {region_num}

'''/regional/{region_num}/{end_date}'''
- 이하동문

'''/regional/{region_num}/{start_date}/{end_date}'''
- 이하동문

## POST
'''/test_temp'''
x-www-form-urlencoded  
aid : Device ID  
fever : temperature that recorded  
