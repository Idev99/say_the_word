import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useGameStore } from '../../store/gameStore';
import { translations } from '../../constants/translations';

export default function CreatorStep1() {
    const router = useRouter();
    const { creatorImages, addCreatorImage, removeCreatorImage, language } = useGameStore();
    const t = translations[language].creator;

    const handlePickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true, // Crop square?
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            addCreatorImage(result.assets[0].uri);
        }
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
                    <View key={index} style={styles.imageContainer}>
                        <Image source={{ uri }} style={styles.image} />
                        <TouchableOpacity onPress={() => removeCreatorImage(index)} style={styles.deleteButton}>
                            <Text style={styles.deleteText}>X</Text>
                        </TouchableOpacity>
                    </View>
                ))}

                <TouchableOpacity onPress={handlePickImage} style={styles.addButton}>
                    <Text style={styles.addText}>{t.addImage}</Text>
                </TouchableOpacity>
            </ScrollView>

            <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
                <Text style={styles.nextText}>{t.next}</Text>
            </TouchableOpacity>
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
    imageContainer: {
        width: 100,
        height: 100,
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#aaa',
    },
    image: {
        width: '100%',
        height: '100%',
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
});
