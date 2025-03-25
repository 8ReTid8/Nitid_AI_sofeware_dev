# ใช้ base image Python
FROM python:3.12

# กำหนด working directory
WORKDIR /app

# คัดลอกไฟล์ requirements.txt ไปยัง container
COPY requirements.txt .


# ติดตั้งไลบรารีที่ระบุใน requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# คัดลอกโค้ดทั้งหมดไปยัง container
COPY . .

# เปิด port 5555 (สำหรับ ZeroMQ)
EXPOSE 5555

# CMD python checkduebill.py & \
#     python updatemodel_EURUSD.py & \
#     python updatemodel_GBPUSD.py & \
#     python updatemodel_USDJPY.py & \
#     wait

# CMD ["python", "server.py"]

CMD ["sh", "-c", "python server.py & python checkduebill.py & python updatemodel_EURUSD.py & python updatemodel_GBPUSD.py & python updatemodel_USDJPY.py & wait"]

