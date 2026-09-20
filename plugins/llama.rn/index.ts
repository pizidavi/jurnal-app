import fs from 'node:fs';
import path from 'node:path';
import { withDangerousMod, type ConfigPlugin } from 'expo/config-plugins';

const PROGUARD_RULES = `
# llama.rn
-keep class com.rnllama.** { *; }
`;

const withNativeModelsProguard: ConfigPlugin = config =>
  withDangerousMod(config, [
    'android',
    config => {
      const filePath = path.join(
        config._internal?.projectRoot ?? '',
        'android',
        'app',
        'proguard-rules.pro',
      );

      const contents = fs.readFileSync(filePath, 'utf-8');
      if (!contents.includes(PROGUARD_RULES)) {
        fs.writeFileSync(filePath, `${contents}${PROGUARD_RULES}`);
      }

      return config;
    },
  ]);

export default withNativeModelsProguard;
