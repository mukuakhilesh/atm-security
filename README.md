 Atm-security

### Problem Statement : 
     Provide a safer environment for the user for atm transactions and reduce the possibility of potential pin theft.

### Deep-Learning model and Dataset : 
Transfer learning on a CNN based model was used for this project.

No dataset which could be used for hand gesture digit recognition could be found online (ones available at kaggle and github were not suitable for us to use because of various reason).
So for the purpose of this project, Dataset was collected from scratch with help of 10-12 persons for each gesture.

 We had ccollected two different datasets in two differnet enviroments.
The dataset for final model is at : 
https://github.com/nikhilsinghh59/Sign-Language-Digit-Dataset

The other datset is available at: https://github.com/nikhilsinghh59/Fingers_Dataset-0-5-

#### Training the Model
The notebook file used for training the model can be found at this [folder](ML_models)
The final trained model used in the projects are available at [this location](ML_models/models)

### Build Nodejs server:



### Running on Pi:
The final gesture detection model alon with the camera modeule was deployed on Raspberry PI 3 B+.

The scripts used for execution of project is available in [Raspberry_PI folder](Raspberry_PI).

     Note: For running the detection model on PI one needs to have Tensorflow and opencv installed.
