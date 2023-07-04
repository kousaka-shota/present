#DB自体を構築・稼働

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# sqliteのデータベースがあるパス
SQLALCHEMY_DATABASE_URL = "sqlite:///./sql_app.db"

#　データベースを可動
engine = create_engine(
    # sqliteのときだけconnect_argが必要
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False,autoflush=False,bind=engine)

# データベースの構造はdeclarativeを継承しますよ
Base = declarative_base()