import { type Route } from '@react-navigation/native';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';

export type HomeStackParamList = {
  Home: undefined;
};

export type AppRoute = Route<keyof HomeStackParamList>;
export type AppNavigationProp = NativeStackNavigationProp<HomeStackParamList>;
