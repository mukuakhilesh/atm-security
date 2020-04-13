#!/usr/bin/env python
# coding: utf-8

# In[21]:
# Note this will not display the output and the captured image.


import tensorflow as tf
import cv2
import numpy as np
import time as tm
from statistics import mode
from imutils.video import WebcamVideoStream           # imutils is used in Raspberry PI for faster video capturing and execution. For PC we can use openCV also
import socket
import sys

# In this we load the tflite model as to run on Raspberry PI
# In case to load .h5 model use below codes which has been commented out. And comment out the codes for tflite.

# classifier = tf.keras.models.load_model('./models/best_mobileNet_model.h5')


tflite_path = './model/mobile_net_v1.tflite'
tflite_inter = tf.lite.Interpreter(model_path = tflite_path)

input_details = tflite_inter.get_input_details()
output_details = tflite_inter.get_output_details()
tflite_inter.allocate_tensors()




import winsound

def detection():
    print('here')
    # cap = cv2.VideoCapture(0)                                                 # To capture stream using OpenCV
    vs = WebcamVideoStream().start()                                            # To capture strem using imutils.
    start = tm.time()
    end = tm.time()
    pin = []
    while (end-start<5):                                                        # We provide a time period of 5 seconds for each pin.
        image = vs.read()                                                       # Reading current frame from imutils.
        # check , image = cap.read()                                            # For reading image using OpenCV

        img = cv2.cvtColor(image , cv2.COLOR_BGR2RGB)
        resized = cv2.resize(img,(224,224),cv2.INTER_AREA)                      # Resizing frame for expected input shape
        scaled = resized/255.0
        expand_img = np.expand_dims(scaled , axis=0)
        img_np = np.array(expand_img,dtype='float32')

        # Prediction using tflite model.
        tflite_inter.set_tensor(input_details[0]['index'] , img_np)
        tflite_inter.invoke()
        tflite_pred = tflite_inter.get_tensor(output_details[0]['index'])
        pred=np.argmax(tflite_pred)

        # For prediction using direct .h5 model
        # pred = np.argmax(classifier.predict(expand_img))

        pin.append(pred)

        end = tm.time()

    vs.stop()                                                                   # The stream needs to be released after every function call. Or it will keep the camera Open.
    vs.stream.release()                                                         # To release capture stream from memory.
    # cv2.destroyAllWindows()
    # cap.release()
    return (mode(pin))


dest = "192.168.43.92"                                                          # IP of the server running the backend of ATM.


sock=socket.socket(socket.AF_INET,socket.SOCK_DGRAM)
sock.bind(("",10000))                                                           # Opening a port for data transmission.

# sender sends the acquired pin to backend
def sender(data):
    a= sock.sendto(str.encode(str(data)),(dest,10000))
    print('sent')
    winsound.Beep(2500, 500)
    #print(a)

# listener waits for pin request from backend
def listener() :
    try :
        print('listening')
        while True:
            data , address = sock.recvfrom(100)
            decode_data = data.decode('utf-8')
            print(decode_data)
            if decode_data:
                if(decode_data=='pin'):
                    res = detection()
                    print(res)
                    sender(res)
    except KeyboardInterrupt :
        exit()

while True:
    listener()
    print(detection())
