
import React from 'react';
import { View, Text } from 'react-native';

export const BannerAdSize = {
    ANCHORED_ADAPTIVE_BANNER: 'ANCHORED_ADAPTIVE_BANNER',
    BANNER: 'BANNER',
    FULL_BANNER: 'FULL_BANNER',
};

export const BannerAd = ({ unitId, size, requestOptions }: { unitId: string, size: any, requestOptions?: any }) => {
    if (__DEV__) {
        return (
            <View style={{ height: 50, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center', borderTopWidth: 1, borderColor: '#ddd' }}>
                <Text style={{ fontSize: 10, color: '#666' }}>[Web Ad Mock] {unitId} ({size})</Text>
            </View>
        );
    }
    return null;
};
