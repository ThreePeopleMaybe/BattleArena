import { StyleSheet } from 'react-native';
import { DARKMODE, LIGHTMODE } from './colors';
import SPACING from './spacing';
import { FONTSIZE } from './typgraphy';

const getStyles = (theme = "light") => {
  console.log(theme);
  const COLORS = theme === "dark" ? DARKMODE : LIGHTMODE;

  return StyleSheet.create({
    // ===== SCREEN LAYOUT =====
    screenContainer: {
      flex: 1,
      padding: SPACING.md,
      backgroundColor: COLORS.backgroundColor,
    },
    formContainer: {
      width: "100%",
      maxWidth: 400,
      backgroundColor: COLORS.lightBg,
      borderRadius: 12,
      padding: SPACING.lg,
      alignItems: "center",
    },
    infoContainer: {
      padding: SPACING.md,
      backgroundColor: COLORS.default,
      borderRadius: 10,
      marginTop: SPACING.sm,
      shadowColor: COLORS.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    optionContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: SPACING.sm,
    },

    // ===== FORM =====
    form: {
      width: "100%",
      marginBottom: SPACING.lg,
    },

    // ===== TEXT =====
    title: {
      fontSize: FONTSIZE.h2,
      fontWeight: "bold",
      color: COLORS.primary,
      textAlign: "center",
      marginBottom: SPACING.lg,
    },
    label: {
      fontSize: FONTSIZE.label,
      fontWeight: "bold",
      color: COLORS.text,
      marginBottom: SPACING.sm,
    },
    value: {
      fontSize: FONTSIZE.body,
      color: COLORS.lightText,
      marginBottom: SPACING.md,
    },
    timer: {
      fontSize: FONTSIZE.body,
      fontWeight: "bold",
      color: COLORS.info,
      textAlign: "center",
      marginBottom: SPACING.md,
    },
    errorText: {
      fontSize: FONTSIZE.body,
      color: "red",
      textAlign: "center",
    },
    infoText: {
      fontSize: FONTSIZE.body,
      color: COLORS.info,
      marginBottom: 5,
    },
    text: {
      fontSize: FONTSIZE.body,
      color: COLORS.text,
      marginBottom: 5,
    },
    disabledText: {
      fontSize: FONTSIZE.body,
      color: COLORS.lightText,
      marginBottom: 5,
    },
    question: {
      fontSize: FONTSIZE.h2,
      fontWeight: "bold",
      color: COLORS.darkText,
      textAlign: "center",
      marginBottom: SPACING.lg,
    },
    buttonText: {
      fontSize: FONTSIZE.h3,
      fontWeight: "bold",
      color: COLORS.darkText,
      marginBottom: SPACING.sm,
    },

    // ===== INPUT =====
    input: {
      width: "100%",
      height: 50,
      backgroundColor: COLORS.default,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: COLORS.border,
      marginBottom: SPACING.md,
      paddingHorizontal: SPACING.sm,
      fontSize: FONTSIZE.label,
      color: COLORS.darkText,
    },

    // ===== BUTTONS =====
    button: {
      height: 50,
      borderRadius: 8,
      backgroundColor: COLORS.primary,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: SPACING.sm,
      padding: SPACING.sm,
    },
    dangerButton: {
      height: 50,
      borderRadius: 8,
      backgroundColor: COLORS.danger,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: SPACING.sm,
      padding: SPACING.sm,
    },
    primaryButton: {
      backgroundColor: COLORS.primary,
    },
    secondaryButton: {
      backgroundColor: COLORS.secondary,
    },
    filterButton: {
      padding: SPACING.sm,
      backgroundColor: COLORS.info,
      borderRadius: 5,
      marginBottom: SPACING.sm,
    },
    filterButtonText: {
      color: COLORS.default,
      textAlign: "center",
      fontWeight: "bold",
    },
    favoriteButton: {
      padding: 10,
      borderRadius: 10,
      backgroundColor: COLORS.lightBg,
    },
    favoriteButtonSelected: {
      backgroundColor: COLORS.secondary,
    },
    favoriteButtonText: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#333333",
    },
    optionButton: {
      flex: 1,
      padding: 15,
      backgroundColor: COLORS.lightBg,
      borderRadius: 10,
      marginRight: 10,
    },
    optionText: {
      fontSize: 18,
      fontWeight: "500",
    },
  });
};

export default getStyles;