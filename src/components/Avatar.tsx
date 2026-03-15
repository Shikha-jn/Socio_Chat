// src/components/Avatar.tsx

import React from 'react';
import { View, Image, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Radius } from '../theme';

interface AvatarProps {
  uri: string;
  size?: number;
  showOnline?: boolean;
  isOnline?: boolean;
  style?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
  uri,
  size = 48,
  showOnline = false,
  isOnline = false,
  style,
}) => {
  return (
    <View style={[{ width: size, height: size }, style]}>
      <Image
        source={{ uri }}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: Colors.sand,
        }}
      />
      {showOnline && (
        <View
          style={[
            styles.onlineDot,
            {
              width: size * 0.27,
              height: size * 0.27,
              borderRadius: (size * 0.27) / 2,
              backgroundColor: isOnline ? Colors.online : Colors.textMuted,
              bottom: 1,
              right: 1,
            },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  onlineDot: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: Colors.background,
  },
});
