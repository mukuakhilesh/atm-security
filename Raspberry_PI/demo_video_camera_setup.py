#!/usr/bin/env python
# coding: utf-8

# In[21]:

# The below code is for loading the model and observing the expected prediction.
# Note the script displays the captured image with predicted output as text. So this is to be used only for camera position setup.
# Displaying the captured video with output slows down the Raspberry PI. So, for actual running use detector.py

import cv2
import numpy as np
import time as tm
from statistics import mode
import tensorflow as tf

tflite_path = './model/mobile_net_v1.tflite'
tflite_inter = tf.lite.Interpreter(model_path = tflite_path)

input_details = tflite_inter.get_input_details()
output_details = tflite_inter.get_output_details()
tflite_inter.allocate_tensors()


def detection():
    print('here')
    cap = cv2.VideoCapture(0)
    start = tm.time()
    end = tm.time()
    pin = []
    while (1):
        ref , image = cap.read()
        img = cv2.cvtColor(image , cv2.COLOR_BGR2RGB)
        resized = cv2.resize(img,(224,224),cv2.INTER_AREA)
        scaled = resized/255.0
        expand_img = np.expand_dims(scaled , axis=0)
        img_np = np.array(expand_img,dtype='float32')
        tflite_inter.set_tensor(input_details[0]['index'] , img_np)
        tflite_inter.invoke()

        tflite_pred = tflite_inter.get_tensor(output_details[0]['index'])
        pred=np.argmax(tflite_pred)
        pin.append(pred)
        cv2.putText(resized , str(pred),(50,50),cv2.FONT_HERSHEY_SIMPLEX , 3 , (255,255,0)
                , 5 , cv2.LINE_AA)
        cv2.imshow('detection' , resized)
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
    tm.sleep(1)
    pin = detection()
    print(pin,flush=True)
