import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { icons, images } from '@/constants'
import InputField from '@/components/InputField'
import CustomButton from '@/components/CustomButton'
import { Link, router } from 'expo-router'
import { Oauth } from '@/components/Oauth'
import { useSignUp } from '@clerk/clerk-expo'
import {ReactNativeModal} from "react-native-modal";
import { fetchAPI } from '@/lib/fetch'

const SignUp = () => {
  const {isLoaded, signUp,  setActive} = useSignUp(); 
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [form , setForm] = useState({
    name: '',
    email: '',
    password: ''
  })

  const [verification , setVerification] = useState({
    state: 'default',
    error: '',
    code: '',
  })
  const onSignUpPress = async () => {
    if (!isLoaded) {
      return
    }

    try {
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
      })

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      setVerification({
        ...verification,
        state: "pending",
      });

    } catch (err: any) {
      Alert.alert("Error", err.errors[0].longMessage);
    }
  }

  const onPressVerify = async () => {
    if (!isLoaded) {
      return
    }
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      })

      if (completeSignUp.status === 'complete') {
        await fetchAPI('/(api)/user', {
          method: "POST",
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            clerkId: completeSignUp.createdUserId,
          })
        })
        await setActive({ session: completeSignUp.createdSessionId })
        setVerification({...verification, state: "success"});
      } else {
        setVerification({...verification, error: "Verification Failed", state: "failed"});
      
      }
    } catch (err: any) {
      setVerification({...verification, error: err.errors[0].longMessage, state: "failed"});
    }
  }
 
  return (
    <ScrollView className='flex-1 bg-white'>
      <View className='flex-1 bg-white'>
    <View className='relative w-full h-[250px]'>
      <Image source={images.signUpCar} className='z-0 w-full h-[250px]'/>
      <Text className='text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5 '>Create Your Account</Text>
    </View>
    <View className='p-5'>
      <InputField 
      label="Name" 
      placeholder="Enter your name" 
      icon={icons.person}
       value={form.name}
        onChangeText={(value) => setForm({
            ...form, 
            name:value
        })}/>
      <InputField 
      label="Email" 
      placeholder="Enter your Email" 
      icon={icons.email}
       value={form.email}
        onChangeText={(value) => setForm({
            ...form, 
            email:value
        })}/>
      <InputField 
      label="Password" 
      placeholder="Enter your password" 
      icon={icons.lock}
      value={form.password}
      onChangeText={(value) => setForm({
            ...form,  
            password:value
        })}
        secureTextEntry={true}
        />
        <CustomButton title='Sign up ' onPress={onSignUpPress} className='mt-6'/>
        <Oauth/>
        <Link href="/sign-in" className='text-lg mt-10 text-general-200 text-center'>
        <Text>
          Already have an Account?
        </Text>
        <Text className='text-primary-500'> Log in</Text>
        </Link>
    </View>
    {/* Verification modal */}
    <ReactNativeModal 
    isVisible={verification.state === "pending"}
    onModalHide={() => {
     if(verification.state === "success") setShowSuccessModal(true);
    }
  
    }
    >
      <View className='bg-white px-7 py-9 rounded-2xl min-h-[300px]'>
        <Text className='text-2xl font-JakartaExtraBold mb-2'>
      Verification 
        </Text>
        <Text className='font-Jakarta mb-5'>
          We have sent a verification code to {form.email}
        </Text>
        <InputField 
        label='Code'
        icon={icons.lock}
        placeholder='12345'
        value={verification.code}
        keyboardType='numeric'
        onChangeText={(code) => setVerification({
          ...verification, 
          code
        })}
       
        />
        {
          verification.error && (
            <Text className='text-red-500 text-sm mt-1'>
              {verification.error}
            </Text>
          )
        }
        <CustomButton title='Verify Email' onPress={onPressVerify} className='mt-5 bg-success-400'/>
      </View>
    </ReactNativeModal>
    <ReactNativeModal isVisible={showSuccessModal}>
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Image source={images.check} className='w-[110px] h-[110px] mx-auto my-5'/>
            <Text className='text-3xl font-JakartaBold text-center'>
            Verified
            </Text>
            <Text className='text-base text-gray-500 text-center mt-2 font-Jakarta'>
              You have successfully verified your account
            </Text>
            <CustomButton 
            title='Browse Home' 
            onPress={() =>{
              setShowSuccessModal(false);
              router.push("/(root)/(tabs)/home")
            }}
            className='mt-2'
            />
          </View>
    </ReactNativeModal>
      </View>
    </ScrollView> 
  )
}

export default SignUp