/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';

// String constant
const Constants={
  choose_camera:'Choose From Camera',
  choose_gallery:'Choose From Gallery',
  upload_image:'Upload Photo',
  image_success_message:'Image Uploaded Successfully',
  something_went_wrong:'Something went wrong try again after sometime',
}

// APIs constant
const Constants_APIs={
  UPLOAD_API:'https://jsonplaceholder.typicode.com/posts/',
}

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [imageData, setImageData] = useState(null);

  //Choose Image Function
  const selectPhoto = type => {
    switch (type) {
      case 0:
        ImageCropPicker.openPicker({
          width: 300,
          height: 300,
          cropping: true,
        }).then(image => {
          setImageData(image);
        });
        break;
      case 1:
        ImageCropPicker.openCamera({
          width: 300,
          height: 300,
          cropping: true,
        }).then(image => {
          setImageData(image);
        });
        break;
      default:
        break;
    }
  };

  //Image Upload Function
  const uploadImage = () => {
    const formData = new FormData();
    formData.append('image', {
      uri: imageData.path,
      name: 'photo.png',
      filename: 'imageName.png',
      type: 'image/png',
    });


    //API call
    fetch(Constants_APIs.UPLOAD_API, {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(response => {
        Alert.alert(Constants.image_success_message);
        return response;
      })
      .catch(exc => {
        console.log('Response exc:', exc);
        Alert.alert(Constants.something_went_wrong);
        return null;
      });
  };

  // Button Component 
  const RenderButtonView = ({text, onPress}) => (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.5}
      style={styles.buttonContainer}>
      <Text style={styles.buttonTxt}>{text}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.viewContainer}>
        <RenderButtonView
          onPress={() => {
            selectPhoto(1);
          }}
          text={Constants.choose_camera}
        />
        <RenderButtonView
          onPress={() => {
            selectPhoto(0);
          }}
          text={Constants.choose_gallery}
        />
        {imageData?.path && (
          <Image
            style={{width: 200, height: 200}}
            source={{uri: imageData.path}}
          />
        )}
        {imageData?.path && (
          <RenderButtonView
            onPress={() => {
              uploadImage();
            }}
            text={Constants.upload_image}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  viewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    width: 250,
    elevation: 10,
    shadowOpacity: 0.5,
    shadowRadius: 10,
    borderRadius: 10,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'blue',
    marginVertical: 10,
  },
  buttonTxt: {
    color: 'white',
    fontSize: 15,
    letterSpacing: 0.33,
  },
});

export default App;
