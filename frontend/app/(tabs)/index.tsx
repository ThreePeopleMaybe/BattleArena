import { Link } from 'expo-router';
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import styles from '@/styleguide/styles'
import COLORS from "@/styleguide/colors";
import SPACING from "@/styleguide/spacing";
import TYPOGRAPHY from "@/styleguide/typgraphy";
import React, { useState } from 'react';

export default function LandingScreen() {
  return (
    <View style={styles.screenContainer}>
      <View style={styles.formContainer}>
        <Text style={[styles.body, { color: COLORS.mediumText, marginBottom: SPACING['2xl'] }]}>
          Your App Name
        </Text>

        <Link href="../../screens/user/login" asChild>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            activeOpacity={0.8}
          >
            <Text style={[styles.body, { color: COLORS.white, fontWeight: '600' }]}>
              Login
            </Text>
          </TouchableOpacity>
        </Link>

        <Link href="../../screens/user/register" asChild>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            activeOpacity={0.8}
          >
            <Text style={[styles.body, { color: COLORS.white, fontWeight: '600' }]}>
              Register
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}
