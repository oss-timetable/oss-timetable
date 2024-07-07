import { StyleSheet, View } from "react-native";
import { SegmentedButtons, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import WebView from "react-native-webview";

import { fetchFeeds, FeedItem } from '@/models/rss';

const FeedView = () => {
  const [sources, setSources] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeeds().then((feeds) => {
      setSources(feeds);
      setLoading(false);
    });
  }, []);

  return (
    <View>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        sources.map((item, index) => (
          <View key={index}>
            <Text>{item.title}</Text>
            <Text>{item.description}</Text>
          </View>
        ))
      )}
    </View>
  );
}

export default function TabTwoScreen() {
  const colors = useTheme().colors;
  const [value, setValue] = useState("curriculum");

  const styles = StyleSheet.create({
    background: {
      backgroundColor: colors.background,
      flex: 1
    },
    container: {
      flex: 1,
      paddingHorizontal: 10
    },
    title: {
      paddingVertical: 10,
      fontWeight: "bold"
    },
    horizontal: {
      flexDirection: "row",
      justifyContent: "flex-start"
    }
  });
  const buttons = [
    {
      icon: "bus-clock",
      value: "bus"
    },
    {
      icon: "calendar-month",
      value: "curriculum"
    },
    {
      icon: "newspaper-variant-outline",
      value: "feed"
    },
    {
      icon: "text-search",
      value: "icourse"
    },
    {
      icon: 'forum',
      value: 'ustcforum'
    }
  ];

  const MainView = () => {
    if (value === "bus") {
      return (
        <View style={styles.container}>
          <Text variant="headlineMedium" style={styles.title}>Explore</Text>
        </View>
      );
    }
    if (value == "curriculum") {
      return (
        <View style={styles.container}>
          <Text variant="headlineMedium" style={styles.title}>Explore</Text>
        </View>
      );
    }
    if (value == "feed") {
      return (
        <View style={styles.container}>
          <Text variant="headlineMedium" style={styles.title}>Explore</Text>
          <FeedView />
        </View>
      );
    }
    if (value == "icourse") {
      return (
        <WebView
          source={{ uri: "https://icourse.club/" }}
          style={{ marginTop: 0 }}
        />
      );
    }
    if (value == "ustcforum") {
      return (
        <WebView
          source={{ uri: "https://ustcforum.com/" }}
          style={{ marginTop: 0 }}
        />
      );
    }
  };

  return (
    <SafeAreaView style={styles.background} edges={["top"]}>
      <MainView />
      <View style={{ paddingBottom: 10 }}>
        <SegmentedButtons
          value={value}

          onValueChange={setValue}
          buttons={buttons}
        />
      </View>
    </SafeAreaView>
  );
}
