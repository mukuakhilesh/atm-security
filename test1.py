import time
import sys
import winsound

for i in range(0,4):
    time.sleep(1)
    print(str(i),flush=True)
    winsound.Beep(2555,500)
