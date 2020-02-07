#!/usr/bin/env python
# coding: utf-8

# In[21]:


from keras.models import load_model
import cv2
import numpy as np
import time as tm
from statistics import mode
import time
from collections import Counter 


classifier = load_model('final.h5')

def detection():
    #print('here')
    cap = cv2.VideoCapture(0)
    start = tm.time()
    end = tm.time()
    pin = []
    while (end -start < 7):
        ref , image = cap.read()
        img = cv2.cvtColor(image , cv2.COLOR_BGR2RGB)
        resized = cv2.resize(img,(224,224),cv2.INTER_AREA)
        scaled = resized/255.0
        expand_img = np.expand_dims(scaled , axis=0)
        pred = np.argmax(classifier.predict(expand_img))
        pin.append(pred)
        cv2.putText(img , str(pred),(50,50),cv2.FONT_HERSHEY_SIMPLEX , 3 , (255,255,0)
                , 5 , cv2.LINE_AA)
        cv2.imshow('detection' , img)
        end = tm.time()
        if cv2.waitKey(1) & 0xFF == ord('q'):
            cv2.destroyAllWindows()
            cap.release()
            break
            
    cv2.destroyAllWindows()
    cap.release()
    return (mode(pin))


while True:
   # a = input()
    # if (a=='q'):
    #     break
    time.sleep(1)
    pin = detection()
    print(pin,flush=True)









