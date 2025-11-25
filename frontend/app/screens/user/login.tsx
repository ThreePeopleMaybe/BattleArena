import { View, Text, TextInput, TouchableOpacity } from "react-native";
import styles from '@/styleguide/styles'
import COLORS from "@/styleguide/colors";
import SPACING from "@/styleguide/spacing";
import TYPOGRAPHY from "@/styleguide/typgraphy";
import React, { useState } from 'react';
import { Link } from 'expo-router';

export default function LoginScreen() {
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

          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            activeOpacity={0.8}
          >
            <Text style={[styles.body, { color: COLORS.white, fontWeight: '600' }]}>
              Sign In
            </Text>
          </TouchableOpacity>
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