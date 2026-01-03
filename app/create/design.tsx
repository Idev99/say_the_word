import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useGameStore } from '../../store/gameStore';
import { useState } from 'react';

const ROUNDS = [1, 2, 3, 4, 5];

export default function CreatorDesignStep() {
    const router = useRouter();
    const { creatorImages, creatorRoundLayouts, setCreatorRoundSlot, resetCreator } = useGameStore();
    const [activeRound, setActiveRound] = useState(1);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

    const currentLayout = creatorRoundLayouts[activeRound] || Array(8).fill(null);

    const handleSlotPress = (index: number) => {
        setSelectedSlot(index);
        setModalVisible(true);
    };

    const handleImageSelect = (uri: string) => {
        if (selectedSlot !== null) {
            setCreatorRoundSlot(activeRound, selectedSlot, uri);
            setModalVisible(false);
            setSelectedSlot(null);
        }
    };

    const handleFinish = () => {
        // Validate Round 1
        const r1 = creatorRoundLayouts[1];
        if (r1.some(i => i === null)) {
            Alert.alert('Incomplete', 'Please fill all slots in Round 1.');
            return;
        }

        Alert.alert('Success', 'Challenge Created!', [
            {
                text: 'Play Now', onPress: () => {
                    // Load custom level and start
                    const { loadCustomLevel } = useGameStore.getState();
                    loadCustomLevel();
                    router.push('/game/custom');
                }
            }
        ]);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Design Your Rounds</Text>
            <View style={styles.steps}><Text style={styles.step}>1 — 2 — </Text><Text style={styles.stepActive}>3</Text></View>

            <Text style={styles.subtitle}>Tap each slot to choose an image.</Text>

            {/* Tabs */}
            <View style={styles.tabs}>
                {ROUNDS.map(r => (
                    <TouchableOpacity
                        key={r}
                        onPress={() => setActiveRound(r)}
                        style={[styles.tab, activeRound === r && styles.tabActive]}
                    >
                        <Text style={[styles.tabText, activeRound === r && styles.tabTextActive]}>Round {r}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Grid */}
            <View style={styles.grid}>
                {currentLayout.map((uri, index) => (
                    <TouchableOpacity key={index} onPress={() => handleSlotPress(index)} style={styles.slot}>
                        {uri ? (
                            <Image source={{ uri }} style={styles.slotImage} />
                        ) : (
                            <Text style={styles.slotPlaceholder}>{index + 1}</Text>
                        )}
                    </TouchableOpacity>
                ))}
            </View>

            <TouchableOpacity onPress={handleFinish} style={styles.finishButton}>
                <Text style={styles.finishText}>Create Challenge</Text>
            </TouchableOpacity>

            {/* Image Selection Modal */}
            <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Choose an Image</Text>
                        <ScrollView contentContainerStyle={styles.modalGallery}>
                            {creatorImages.map((uri, idx) => (
                                <TouchableOpacity key={idx} onPress={() => handleImageSelect(uri)} style={styles.modalImageContainer}>
                                    <Image source={{ uri }} style={styles.modalImage} />
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                            <Text style={styles.closeText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#FAF9F6',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    steps: {
        flexDirection: 'row',
        marginBottom: 20,
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
        marginBottom: 20,
        color: '#666',
    },
    tabs: {
        flexDirection: 'row',
        marginBottom: 20,
        gap: 10,
    },
    tab: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 20,
        backgroundColor: 'white',
    },
    tabActive: {
        backgroundColor: '#FFEB3B', // Yellow
        borderColor: 'black',
        borderWidth: 2,
    },
    tabText: {
        color: '#666',
    },
    tabTextActive: {
        color: 'black',
        fontWeight: 'bold',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        justifyContent: 'center',
        width: '100%',
    },
    slot: {
        width: '22%',
        aspectRatio: 1,
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: '#ccc',
        borderStyle: 'dashed',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    slotImage: {
        width: '100%',
        height: '100%',
    },
    slotPlaceholder: {
        fontSize: 24,
        color: '#ccc',
        fontWeight: 'bold',
    },
    finishButton: {
        marginTop: 40,
        width: '100%',
        padding: 15,
        backgroundColor: '#FFEB3B',
        borderRadius: 10,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'black',
    },
    finishText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        maxHeight: '70%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    modalGallery: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 10,
    },
    modalImageContainer: {
        width: 80,
        height: 80,
        borderRadius: 8,
        overflow: 'hidden',
    },
    modalImage: {
        width: '100%',
        height: '100%',
    },
    closeButton: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#eee',
        borderRadius: 10,
        alignItems: 'center',
    },
    closeText: {
        fontWeight: 'bold',
    },
});
