import time
import os
import requests


def send_heartbeat():
    heartbeat_endpoint = os.getenv('HEARTBEAT_ENDPOINT', 'https://us-central1-machine-heartbeat.cloudfunctions.net/api/heartbeat/')
    post_body = {'machine_id': get_machine_id()}
    return requests.post(url=heartbeat_endpoint, data=post_body)

def get_machine_id():
    return os.getenv('MACHINE_ID', 'testing')

def run_poll_loop():
    while True:
        try:
            send_heartbeat()
        except Exception as e:
            print("Send heartbeat failed: {}".format(e))
        time.sleep(5)

if __name__ == '__main__':
    run_poll_loop()
