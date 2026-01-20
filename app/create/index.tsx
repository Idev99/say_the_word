import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, Modal, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useGameStore } from '../../store/gameStore';
import { translations } from '../../constants/translations';
import { BannerAd, BannerAdSize } from '../../components/AdBanner';
import { AD_UNITS } from '../../utils/AdManager';

export default function CreatorStep1() {
    const router = useRouter();
    const { creatorImages, creatorImageNames, addCreatorImage, removeCreatorImage, setCreatorImageName, language } = useGameStore();
    const t = translations[language].creator;

    const [modalVisible, setModalVisible] = useState(false);
    const [currentUri, setCurrentUri] = useState('');
    const [imageName, setImageName] = useState('');

    const handlePickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.4, // Strict compression for storage efficiency
        });

        if (!result.canceled) {
            setCurrentUri(result.assets[0].uri);
            setImageName('');
            setModalVisible(true);
        }
    };

    const handleSaveImage = () => {
        if (!imageName.trim()) {
            Alert.alert(t.incompleteRounds?.title || "Missing Name", "Please enter a name for this image.");
            return;
        }
        addCreatorImage(currentUri);
        setCreatorImageName(currentUri, imageName.trim());
        setModalVisible(false);
        setCurrentUri('');
        setImageName('');
    };

    const handleNext = () => {
        if (creatorImages.length < 3) {
            Alert.alert(t.errorNotEnoughImages.title, t.errorNotEnoughImages.message);
            return;
        }
        router.push('/create/mode');
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => router.push('/challenges')}
                style={styles.homeButton}
            >
                <Image
                    source={require('../../assets/icons/home.png')}
                    style={styles.homeIcon}
                />
            </TouchableOpacity>

            <Text style={styles.title}>{t.step1Title}</Text>
            <View style={styles.steps}><Text style={styles.stepActive}>1</Text><Text style={styles.step}> — 2 — 3</Text></View>

            <Text style={styles.subtitle}>{t.step1Subtitle}</Text>

            <ScrollView contentContainerStyle={styles.gallery}>
                {creatorImages.map((uri, index) => (
                    <View key={index} style={styles.imageCard}>
                        <View style={styles.imageContainer}>
                            <Image source={{ uri }} style={styles.image} />
                            <TouchableOpacity onPress={() => removeCreatorImage(index)} style={styles.deleteButton}>
                                <Text style={styles.deleteText}>X</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.imageLabel} numberOfLines={1}>{creatorImageNames[uri]}</Text>
                    </View>
                ))}

                <TouchableOpacity onPress={handlePickImage} style={styles.addButton}>
                    <Text style={styles.addText}>{t.addImage}</Text>
                </TouchableOpacity>
            </ScrollView>

            <TouchableOpacity onPress={handleNext} style={[styles.nextButton, { bottom: 80 }]}>
                <Text style={styles.nextText}>{t.next}</Text>
            </TouchableOpacity>

            {/* Naming Modal */}
            <Modal visible={modalVisible} transparent={true} animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{(t as any).nameImage || "Name your image"}</Text>
                        {currentUri ? <Image source={{ uri: currentUri }} style={styles.previewImage} /> : null}
                        <TextInput
                            style={styles.nameInput}
                            value={imageName}
                            onChangeText={setImageName}
                            autoFocus
                        />
                        <TouchableOpacity onPress={handleSaveImage} style={styles.saveButton}>
                            <Text style={styles.saveText}>{(t as any).saveImage || "Save Name"}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
                            <Text style={styles.cancelText}>{t.cancel}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Fixed Banner at the bottom */}
            <View style={styles.bannerContainer}>
                <BannerAd
                    unitId={AD_UNITS.BANNER}
                    size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
                    requestOptions={{
                        requestNonPersonalizedAdsOnly: true,
                    }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    steps: {
        flexDirection: 'row',
        marginBottom: 30,
    },
    stepActive: {
        fontWeight: 'bold',
        color: '#4CAF50',
        fontSize: 18,
    },
    step: {
        fontSize: 18,
        color: '#ccc',
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 20,
    },
    gallery: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 10,
        paddingBottom: 100,
    },
    imageCard: {
        width: 100,
        alignItems: 'center',
        marginBottom: 10,
    },
    imageContainer: {
        width: 100,
        height: 100,
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#aaa',
        marginBottom: 5,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    imageLabel: {
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
        width: '100%',
    },
    deleteButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'red',
        borderRadius: 10,
        width: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    deleteText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        width: '90%',
        maxWidth: 380,
        alignItems: 'center',
        borderWidth: 3,
        borderColor: 'black',
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    previewImage: {
        width: 120,
        height: 120,
        borderRadius: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    nameInput: {
        width: '100%',
        padding: 15,
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 10,
        fontSize: 18,
        marginBottom: 20,
        backgroundColor: '#f5f5f5',
    },
    saveButton: {
        width: '100%',
        padding: 15,
        backgroundColor: '#4CAF50',
        borderRadius: 10,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'black',
        marginBottom: 10,
    },
    saveText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    cancelButton: {
        width: '100%',
        padding: 12,
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        alignItems: 'center',
    },
    cancelText: {
        color: '#666',
        fontSize: 16,
        fontWeight: '600',
    },
    addButton: {
        width: 100,
        height: 100,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#4CAF50',
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
    },
    addText: {
        color: '#4CAF50',
        fontWeight: 'bold',
        textAlign: 'center',
        paddingHorizontal: 5,
    },
    nextButton: {
        position: 'absolute',
        bottom: 30,
        width: '100%',
        padding: 15,
        backgroundColor: '#FFEB3B',
        borderRadius: 10,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'black',
    },
    nextText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    homeButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 25,
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 1,
        shadowRadius: 0,
        zIndex: 100,
    },
    homeIcon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
    bannerContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderTopWidth: 2,
        borderTopColor: 'black',
        paddingVertical: 5,
    },
});
