import { type Route } from '@react-navigation/native';
import {
  type NativeStackNavigationProp,
  type NativeStackScreenProps,
} from '@react-navigation/native-stack';

export type HomeStackParamList = {
  Home: undefined;
  Note: { noteId: number };
};

export type AppRoute = Route<keyof HomeStackParamList>;
export type AppNavigationProp = NativeStackNavigationProp<HomeStackParamList>;

export type NoteScreenProps = NativeStackScreenProps<HomeStackParamList, 'Note'>;
