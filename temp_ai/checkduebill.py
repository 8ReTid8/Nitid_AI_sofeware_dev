import logging
import time
import requests
import schedule


API_URL = "http://client:3000/api/checkduebill"  # เปลี่ยนเป็น API ที่ต้องการ

def checkduebill():

    payload = {}
    response = requests.post(API_URL, json=payload)
    if response.status_code == 200:
        print(f"Billing checked")
    else:
        print(f"Failed to register model: {response.text}")
        
schedule.every(720).minutes.do(checkduebill)

# ฟังก์ชันหลัก
def main():
    logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
    logging.info("checkduebill RUNNING")
    # รัน scheduler
    while True:
        schedule.run_pending()
        time.sleep(1)

if __name__ == "__main__":
    main()