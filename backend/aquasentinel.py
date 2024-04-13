# predict the water quality index based on a set of measurements
def predict_wqi(values):
    import joblib
    model = joblib.load('regressor_model.pkl')
    if(len(values.shape) == 1):
        values = values.reshape(1,-1)
    
    y_pred = model.predict(values)
    
    return y_pred[0]


# determine the water quality class based on a wqi value
# the function takes an array
def get_wqc(wqi):
    import numpy as np
    wqc = []
    wqi = np.array(wqi)
    if(len(wqi.shape) == 0):
        wqi = wqi.reshape(1,-1)
                
    for i in range(wqi.shape[0]):
        if(wqi[i] <= 50):
            wqc.append("good")
        elif(wqi[i] <= 100):
            wqc.append("poor")
        else:
            wqc.append("unsuitable")
    return np.array(wqc, dtype='<U10')[0]


