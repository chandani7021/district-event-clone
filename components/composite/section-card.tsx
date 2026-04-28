import React, { type ReactNode } from 'react';
import { View } from 'react-native';

interface SectionCardProps {
  children: ReactNode;
}

export function SectionCard({ children }: SectionCardProps) {
  const childArray = React.Children.toArray(children).filter(Boolean);

  return (
    <View className="bg-secondary rounded-xl overflow-hidden">
      {childArray.map((child, i) => (
        <React.Fragment key={i}>
          {i > 0 && <View className="h-[0.5px] bg-border mx-lg" />}
          {child}
        </React.Fragment>
      ))}
    </View>
  );
}
