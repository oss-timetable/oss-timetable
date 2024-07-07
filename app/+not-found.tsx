import { Link } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

export default function NotFoundScreen() {
  const colors = useTheme().colors;
  return (
    <View style={{ ...styles.container, backgroundColor: colors.background }}>
      <Text variant="titleMedium">This screen doesn't exist.</Text>
      <Link href="/" style={styles.link}>
        <Text variant="bodyMedium">Go to home screen!</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20
  },
  link: {
    marginTop: 15,
    paddingVertical: 15
  }
});
