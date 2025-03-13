import { PermissionsAndroid } from 'react-native';
import { useCallback } from 'react';
const requestPermission =  async() => {
    try {
      const permissionGranted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
        title: 'Allow camera access',
        message:
          'App wants to access your camera',
        buttonNegative: 'Deny',
        buttonPositive: 'Allow',
      });
      // then access permission status
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Camera permission granted',permissionGranted);
        // permissons have been accepted - update a useState() here or whatever your usecase is :)
      }
    } catch (err) {
      console.warn("DDFDF");
    }
}
  export { requestPermission };