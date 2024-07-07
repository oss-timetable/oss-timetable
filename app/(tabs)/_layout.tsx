import { Tabs } from "expo-router";
import React from "react";
import { Icon, useTheme } from "react-native-paper";

export default function TabLayout() {
  const colors = useTheme().colors;

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colors.background
        },
        tabBarInactiveBackgroundColor: colors.background,
        tabBarActiveBackgroundColor: colors.background,
        tabBarActiveTintColor: colors.primary,
        headerShown: false
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Icon source={focused ? "file-document-multiple" : "file-document-multiple-outline"} color={color}
                  size={25} />
          )
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, focused }) => (
            <Icon source={"list-status"} color={color} size={25} />
          )
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, focused }) => (
            <Icon source={focused ? "cog" : "cog-outline"} color={color} size={25} />
          )
        }}
      />
    </Tabs>
  );
}
