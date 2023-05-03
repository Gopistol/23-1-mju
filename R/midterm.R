# 60221300 고건 r통계 중간고사

library(dplyr)
library(ggplot2)
library(nycflights13)

data(flights)
data(airlines)

# 1
table(is.na(flights$dep_time))
# 이 dataset은 2013년 뉴욕 항공편에 대한 정보만을 담고 있으므로 따로 조건을 걸지 않음

# 2
ggplot(data = flights, aes(x = carrier)) + geom_bar()

flights %>%
  group_by(carrier) %>%
  summarise(carrier_flights = n()) %>%
  arrange(desc(carrier_flights)) %>%
  head(5)
# UA 항공사가 가장 많은 항공기를 운행했다.

# 3

# 결측치 제외
dep_delay_new = flights %>% 
  select(dep_delay, carrier) %>%
  filter(!is.na(dep_delay))

# 평균출발지연시간 구하기
mean_dep_delay = dep_delay_new %>% 
  group_by(carrier) %>%
  summarise(mean_dep_delay = mean(dep_delay))


# join 사용
df_3 = left_join(mean_dep_delay, airlines, by="carrier")
df_3

df_3 %>%
  arrange(mean_dep_delay) %>%
  head(1)
# US가 가장 출발 지연시간이 짧다.

# 4

df_4 = flights %>%
  filter(!is.na(arr_delay) & !is.na(dep_time)) %>%
  group_by(dest) %>%
  summarise(count = n(),
            dist = mean(distance),
            delay = mean(arr_delay))
df_4
# x축: 평균 운항 거리, y축: 평균도착지연시간, point 크기: count

qplot(dist, delay,
      data = df_4, size=count)

# 5

df_is_delayed = flights %>%
  filter(!is.na(dep_time)) %>% 
  summarise(origin = origin, is_delayed = ifelse(dep_delay < 5, "on_time", "delayed"))

df_on_time = df_is_delayed %>%
  group_by(origin) %>%
  filter(is_delayed == "on_time") %>%
  summarise(on_time = n())

df_delayed = df_is_delayed %>%
  group_by(origin) %>%
  filter(is_delayed == "delayed") %>%
  summarise(delayed = n())

df_5 = left_join(df_on_time, df_delayed, by="origin")

df_5 = df_5 %>%
  summarise(On_time = on_time / (on_time + delayed),
            Delayed = delayed / (on_time + delayed))

df_5_table <- data.frame(On_Time = df_5[,1],
                         Delayed = df_5[,2])

rownames(df_5_table) = c("EWR", "JFK", "LGA")
df_5_table


