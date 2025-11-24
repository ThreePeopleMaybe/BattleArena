import { View, Text, TextInput, TouchableOpacity } from "react-native";
import styles from '@/styleguide/styles'
import COLORS from "@/styleguide/colors";
import SPACING from "@/styleguide/spacing";
import TYPOGRAPHY from "@/styleguide/typgraphy";
import React, { useState } from 'react';
import { Link } from 'expo-router';

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <View style={styles.screenContainer}>
      <View style={styles.formContainer}>
        <Text>
          Register
        </Text>

        <View style={styles.form}>
          <Text style={[styles.label, { color: COLORS.darkText, marginBottom: SPACING.sm }]}>
            Full Name
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            placeholderTextColor={COLORS.lightText}
            value={fullName}
            onChangeText={setFullName}
          />

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
            Password
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor={COLORS.lightText}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Text style={[styles.label, { color: COLORS.darkText, marginBottom: SPACING.sm }]}>
            Confirm Password
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Confirm your password"
            placeholderTextColor={COLORS.lightText}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            activeOpacity={0.8}
          >
            <Text style={[styles.body, { color: COLORS.white, fontWeight: '600' }]}>
              Create Account
            </Text>
          </TouchableOpacity>
        </View>

        <Link href="./loginscreen" asChild>
          <TouchableOpacity>
            
            <Text>
              Already have an account? Login
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}
