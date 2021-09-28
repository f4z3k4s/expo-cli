import { ExpoConfig } from '@expo/config-types';
// @ts-ignore: uses flow
import normalizeColor from '@react-native/normalize-color';

import { ConfigPlugin } from '../Plugin.types';
import { withInfoPlist } from '../plugins/ios-plugins';
import { InfoPlist } from './IosConfig.types';

// Maps to the template AppDelegate.m
const BACKGROUND_COLOR_KEY = 'RCTRootViewBackgroundColor';

export const withRootViewBackgroundColor: ConfigPlugin = config => {
  config = withInfoPlist(config, config => {
    config.modResults = setRootViewBackgroundColor(config, config.modResults);
    return config;
  });
  return config;
};

export function setRootViewBackgroundColor(
  config: Pick<ExpoConfig, 'backgroundColor' | 'ios'>,
  infoPlist: InfoPlist
): InfoPlist {
  const backgroundColor = getRootViewBackgroundColor(config);
  if (!backgroundColor) {
    delete infoPlist[BACKGROUND_COLOR_KEY];
  } else {
    let color = normalizeColor(backgroundColor);
    if (!color) {
      throw new Error('Invalid background color on iOS');
    }
    color = ((color << 24) | (color >>> 8)) >>> 0;
    infoPlist[BACKGROUND_COLOR_KEY] = color;
  }
  return infoPlist;
}

export function getRootViewBackgroundColor(config: Pick<ExpoConfig, 'ios' | 'backgroundColor'>) {
  return config.ios?.backgroundColor || config.backgroundColor || null;
}
