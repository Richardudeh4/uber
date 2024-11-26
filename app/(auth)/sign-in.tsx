import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { icons, images } from '@/constants'
import InputField from '@/components/InputField'
import CustomButton from '@/components/CustomButton'
import { Link, useRouter } from 'expo-router'
import { Oauth } from '@/components/Oauth'
import { useSignIn } from '@clerk/clerk-expo'

const SignIn= () => {
  const {signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [form , setForm] = useState({
    email: '',
    password: ''
  })
  const onSignInPress = useCallback(async () => {
    if (!isLoaded) return;

    try {
      const signInAttempt = await signIn.create({
        identifier: form.email,
        password: form.password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/(root)/(tabs)/home");
      } else {
        console.log(JSON.stringify(signInAttempt, null, 2));
        Alert.alert("Error", "Log in failed. Please try again.");
      }
    } catch (err: any) {
      console.log(JSON.stringify(err, null, 2));
      Alert.alert("Error", err.errors[0].longMessage);
    }
  }, [isLoaded, form]);

  return (
    <ScrollView className='flex-1 bg-white'>
      <View className='flex-1 bg-white'>
    <View className='relative w-full h-[250px]'>
      <Image source={images.signUpCar} className='z-0 w-full h-[250px]'/>
      <Text className='text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5 '>Welcome back </Text>
    </View>
    <View className='p-5'>
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
            password:value,
        })}
        secureTextEntry={true}
        />
        <CustomButton title='Sign In' onPress={onSignInPress} className='mt-6'/>
        <Oauth/>
        <Link href="/sign-up" className='text-lg mt-10 text-general-200 text-center'>
        <Text>
         Don't  have an account ?
        </Text>
        <Text className='text-primary-500'> Sign up</Text>
        </Link>
    </View>
      </View>
    </ScrollView>
  )
}

export default SignIn
