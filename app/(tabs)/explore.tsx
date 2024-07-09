import { ScrollView, StyleSheet, View } from "react-native";
import { ActivityIndicator, Card, Divider, List, SegmentedButtons, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import WebView from "react-native-webview";

import { FeedItem, fetchFeeds } from "@/models/rss";
import { BusData, calcIsWeekday, fetchBusData, RouteSchedule } from "@/models/bus";
import { openBrowserAsync } from "expo-web-browser";

const BusView = () => {
  const styles = StyleSheet.create({
    schedule: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: 5,
      paddingHorizontal: 20
    }
  });

  const [busData, setBusData] = useState<BusData>();
  const [loading, setLoading] = useState(true);

  const [routeSchedule, setRouteSchedule] = useState<RouteSchedule>();
  const [routeSchedulePickerExpanded, setRouteSchedulePickerExpanded] = useState(false);
  const [isWeekday, setIsWeekday] = useState(calcIsWeekday() ? "weekday" : "weekend");

  useEffect(() => {
    fetchBusData().then((data) => {
      setBusData(data);
      setRouteSchedule(data[isWeekday === "weekday" ? "weekday_routes" : "weekend_routes"][0]);
      setLoading(false);
    });
  }, []);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {loading ? (
        <View style={{ alignSelf: "center", height: "100%" }}>
          <ActivityIndicator />
        </View>
      ) : (
        <View>
          <SegmentedButtons buttons={[
            {
              label: "Weekday",
              value: "weekday"
            }, {
              label: "Weekend",
              value: "weekend"
            }
          ]} value={isWeekday} onValueChange={(value) => {
            setIsWeekday(value);
            setRouteSchedule(busData![value === "weekday" ? "weekday_routes" : "weekend_routes"][0]);
          }} />

          {/*<List.Accordion title={routeSchedule!.route.campuses.map((campus) => campus.name).join(" - ")}>*/}
          {/*  {routeSchedule!.time.map((time, index) => (*/}
          {/*    <List.Item key={index} title={time.map((k) => k ?? "即停").join(" - ")} />*/}
          {/*  ))}*/}
          {/*</List.Accordion>*/}

          <List.Accordion
            title={routeSchedule!.route.campuses.map((campus) => campus.name).join(" - ")}
            style={{ marginVertical: 10 }}
            expanded={routeSchedulePickerExpanded}
            onPress={() => setRouteSchedulePickerExpanded(!routeSchedulePickerExpanded)}
          >
            {busData![isWeekday === "weekday" ? "weekday_routes" : "weekend_routes"].map((routeSchedule, index) => (
              <List.Item
                key={index}
                title={routeSchedule.route.campuses.map((campus) => campus.name).join(" - ")}
                // description={routeSchedule.time.map((time) => time.join(" - ")).join("\n")}
                onPress={() => {
                  setRouteSchedule(routeSchedule);
                  setRouteSchedulePickerExpanded(false);
                }}
              />
            ))}
          </List.Accordion>


          {!routeSchedulePickerExpanded && (
            <View>
              <View style={{ ...styles.schedule }}>
                {routeSchedule!.route.campuses.map((campus, index) => (
                  <Text key={index}>{campus.name}</Text>
                ))}
              </View>

              <Divider style={{ marginVertical: 5 }} />

              {routeSchedule!.time.map((time, index) => (
                <View key={index} style={styles.schedule}>
                  {time.map((k, i) => (
                    <Text key={i}>{k ?? "即停"}</Text>
                  ))}
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
};

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
    <ScrollView showsVerticalScrollIndicator={false}>
      {loading ? (
        <View style={{ alignSelf: "center", height: "100%" }}>
          <ActivityIndicator />
        </View>
      ) : (
        <View style={{ gap: 20 }}>
          {
            sources.map((item, index) => (
              <Card
                mode="outlined"
                onPress={async () => {
                  await openBrowserAsync(item.link);
                }}
                key={index}
              >
                <Card.Title
                  title={item.title}
                  subtitle={item.dateString}
                  right={(props) => (
                    <Text {...props} style={{ color: "gray", marginRight: 20 }}>{item.source}</Text>
                  )}
                />
                <Card.Content>
                  <Text numberOfLines={3}>{item.description}</Text>
                </Card.Content>
              </Card>
            ))}
        </View>
      )}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

export default function ExploreScreen() {
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
      icon: "forum",
      value: "ustcforum"
    }
  ];

  const MainView = () => {
    if (value === "bus") {
      return (
        <View style={styles.container}>
          <Text variant="headlineMedium" style={styles.title}>Bus Timetable</Text>
          <BusView />
        </View>
      );
    }
    if (value == "curriculum") {
      return (
        <View style={styles.container}>
          <Text variant="headlineMedium" style={styles.title}>Courses</Text>
        </View>
      );
    }
    if (value == "feed") {
      return (
        <View style={styles.container}>
          <Text variant="headlineMedium" style={styles.title}>News</Text>
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
      <View style={{ paddingVertical: 10 }}>
        <SegmentedButtons
          value={value}
          onValueChange={setValue}
          buttons={buttons}
        />
      </View>
    </SafeAreaView>
  );
}
