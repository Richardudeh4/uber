import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useLocationStore } from '@/store'

const FindRide = () => {
    const {userAddress,destinationAddress,setDestinationLocation, setUserLocation} = useLocationStore();
  return (
    <View>
      <Text className='text-2xl'> You're here: {userAddress}</Text>
      <Text className='text-2xl'> You're going here: {destinationAddress}</Text>
    </View>
  )
}

export default FindRide

