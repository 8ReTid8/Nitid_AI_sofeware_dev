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

# กำหนดคำสั่งเริ่มต้น container
CMD ["python", "main.py"]