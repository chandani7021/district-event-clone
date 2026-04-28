import React from "react";
import { ScrollView, View } from "react-native";
import { Skeleton } from "@/components/ui/skeleton";

const ITEM_WIDTH = 100;
const SKELETON_ITEMS = 6;

const ArtistItemSkeleton = () => (
    <View className="items-center gap-2" >
        <Skeleton
            width={ITEM_WIDTH}
            height={ITEM_WIDTH}
            borderRadius={999}
        />
        <Skeleton width={ITEM_WIDTH * 0.8} height={14} borderRadius={6} />
    </View>
);

export const ArtistCarouselSkeleton = () => {
    return (
        <View className="w-full gap-6 px-0 max-w-1440" >
            {/* Header skeleton */}
            <Skeleton width={200} height={28} borderRadius={6} />

            {/* Two skeleton rows */}
            <View className="w-full overflow-hidden">
                <ScrollView
                    horizontal
                    scrollEnabled={false}
                    showsHorizontalScrollIndicator={false}
                >
                    <View className="gap-6" >
                        {/* Row 1 */}
                        <View className="flex-row gap-3" >
                            {Array.from({ length: SKELETON_ITEMS }).map((_, i) => (
                                <ArtistItemSkeleton key={i} />
                            ))}
                        </View>
                        {/* Row 2 */}
                        <View className="flex-row gap-3" >
                            {Array.from({ length: SKELETON_ITEMS }).map((_, i) => (
                                <ArtistItemSkeleton key={i} />
                            ))}
                        </View>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
};