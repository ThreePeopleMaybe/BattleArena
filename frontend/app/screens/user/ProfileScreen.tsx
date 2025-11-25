import { View, Text, TextInput, TouchableOpacity } from "react-native";
import styles from '@/styleguide/styles'
import COLORS from "@/styleguide/colors";
import SPACING from "@/styleguide/spacing";
import React, { useState } from 'react';
import { Link } from 'expo-router';
import Button from "@/components/button";

export default function ProfileScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.screenContainer}>
      <View style={styles.formContainer}>
        <Text>
          Login
        </Text>

        <View style={styles.form}>
          <Text style={[styles.label, { color: COLORS.darkText, marginBottom: SPACING.sm }]}>
            Email
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor={COLORS.lightText}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <Text style={[styles.label, { color: COLORS.darkText, marginBottom: SPACING.sm }]}>
            Passworda
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor={COLORS.lightText}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

         <Button label="Sign In" onPress={() => alert("Sign In")}/>
        </View>

        <Link href="./register" asChild>
          <TouchableOpacity>
            <Text>
              Don't have an account? Register
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}