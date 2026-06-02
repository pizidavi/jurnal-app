import 'tsx/cjs';

import type { ConfigContext, ExpoConfig } from 'expo/config';

import { version } from './package.json';

const NODE_ENV = process.env.NODE_ENV || 'development';
const env: 'production' | 'development' = process.env.EXPO_PUBLIC_ENVIRONMENT ?? 'development';

module.exports = ({ config }: ConfigContext): Partial<ExpoConfig> => ({
  ...config,
  name: getAppName(config.name),
  version,
  android: {
    ...config.android,
    package: getPackageName(config.android?.package),
  },
  ios: {
    ...config.ios,
    bundleIdentifier: getPackageName(config.ios?.bundleIdentifier),
  },
  plugins: getPlugins(config.plugins),
});

function getAppName(name: string | undefined) {
  if (!name) return name;
  if (env !== 'production') return `${name} (${env})`;
  return name;
}

function getPackageName(packageName: string | undefined) {
  if (!packageName) return packageName;
  if (env !== 'production') return `${packageName}.${env}`;
  return packageName;
}

function getPlugins(plugins: (string | [] | [string] | [string, any])[] | undefined) {
  plugins ??= [];

  if (NODE_ENV === 'development')
    plugins.push([
      'expo-dev-client',
      {
        launchMode: 'most-recent',
      },
    ]);

  return plugins;
}
