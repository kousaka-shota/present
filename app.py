import streamlit as st
import random
import requests
import json
import datetime
import pandas as pd


page = st.sidebar.selectbox("choose",["users","rooms","bookings"])


if page == "users":
    st.title("ユーザー登録画面")
    with st.form(key="user"):
        user_name:str = st.text_input("ユーザー名",max_chars=12)
        data={
            "user_name":user_name
        }
        submit_button = st.form_submit_button(label="ユーザー登録")

    if submit_button:
        url="http://127.0.0.1:8000/users"
        res = requests.post(url,json=data)
        if res.status_code == 200:
            st.success("ユーザー登録完了")
        st.json(res.json())

elif page == "rooms":
    st.title("会議室登録")
    with st.form(key="room"):
        room_name:str = st.text_input("会議室名",max_chars=12)
        capacity:int = st.number_input("定員",step=1)
        data={
            "room_name":room_name,
            "capacity":capacity
        }
        submit_button = st.form_submit_button(label="会議室登録")

    if submit_button:
        st.write("## 送信データ")
        st.json(data)
        st.write("## レスポンス結果")
        url="http://127.0.0.1:8000/rooms"
        res = requests.post(url,json=data)
        if res.status_code == 200:
            st.success("会議室の登録が完了しました")
        st.json(res.json())

elif page == "bookings":
    st.title("会議室予約")
    #ユーザー一覧取得
    url_users = "http://127.0.0.1:8000/users"
    res_users = requests.get(url_users)
    users = res_users.json()
    users_name = {}
    #usernameをキーにする辞書型に変換
    for user in users:
        users_name[user["user_name"]] = user["user_id"]
    
    #会議室一覧取得
    url_rooms = "http://127.0.0.1:8000/rooms"
    res_rooms = requests.get(url_rooms).json()
    rooms_name ={}
    #roomnameをキーにする辞書型に変換
    for room in res_rooms:
        rooms_name[room["room_name"]] = {
            "capacity":room["capacity"],
            "room_id":room["room_id"]
            }

    st.write("### 会議室一覧")
    df_rooms = pd.DataFrame(res_rooms)
    st.table(df_rooms)


    url_booking = "http://127.0.0.1:8000/bookings"
    res_booking = requests.get(url_booking).json()
    df_booking = pd.DataFrame(res_booking)

    # userIDがキーとなる辞書を作製
    users_id = {}
    for user in users:
        users_id[user["user_id"]] = user["user_name"]

    #roomIDがキーとなる辞書を作製
    rooms_id = {}
    for room in res_rooms:
        rooms_id[room["room_id"]] = {
            "room_name" :room["room_name"],
            "capacity" : room["capacity"]
            }

    to_user_name = lambda x: users_id[x]
    to_room_name = lambda x: rooms_id[x]["room_name"]
    to_datetime = lambda x: datetime.datetime.fromisoformat(x).strftime("%Y/%m/%d %H:%M")

    df_booking["user_id"] = df_booking["user_id"].map(to_user_name)
    df_booking["room_id"] = df_booking["room_id"].map(to_room_name)
    df_booking["start_datetime"] = df_booking["start_datetime"].map(to_datetime)
    df_booking["end_datetime"] = df_booking["end_datetime"].map(to_datetime)
    
    df_booking = df_booking.rename(columns={
        "user_id":"予約者名",
        "room_id":"会議室名",
        "booked_num":"予約人数",
        "start_datetime":"開始日時",
        "end_datetime":"終了日時",
        "booking_id":"予約番号",
    })

    st.write("### 予約一覧")
    st.table(df_booking)

    with st.form(key="booking"):
        user_name:str = st.selectbox("予約者名",users_name.keys())
        room_name:str = st.selectbox("予約者名",rooms_name.keys())
        booked_num:int=st.number_input("予約人数",step=1,min_value=0)
        date= st.date_input("日付を入力：",min_value=datetime.date.today())
        start_time = st.time_input("開始時刻：",value=datetime.time(hour=9,minute=0))
        end_time = st.time_input("終了時刻：",value=datetime.time(hour=20,minute=0))


        submit_button = st.form_submit_button(label="予約")

    if submit_button:
        
        user_id:int = users_name[user_name]
        room_id:int = rooms_name[room_name]["room_id"]
        capacity:int = rooms_name[room_name]["capacity"]
        data={
            "user_id":user_id,
            "room_id":room_id,
            "booked_num":booked_num,
            "start_datetime":datetime.datetime(
                year=date.year,month=date.month,day=date.day,hour=start_time.hour,minute=start_time.minute
            ).isoformat(),
            "end_datetime":datetime.datetime(
                year=date.year,month=date.month,day=date.day,hour=end_time.hour,minute=end_time.minute
            ).isoformat()
        }

        if booked_num >= capacity:
            st.error(f"{room_name}の定員は、{capacity}人です。予約人数を{capacity}人以下に変更してください")

        elif start_time >= end_time:
            st.error("開始時刻が終了時刻を超えています")

        elif start_time < datetime.time(hour=9 ,minute=0,second=0) or end_time > datetime.time(hour=20 ,minute=0,second=0):
            st.error("利用時間は9:00~20:00になります")

        else:
            url="http://127.0.0.1:8000/bookings"
            res = requests.post(url,json=data)
            if res.status_code == 200:
                st.success("予約が完了しました")
            elif res.status_code == 404 and res.json():
                st.error("指定時間は既に予約されています")
            st.json(res.json())