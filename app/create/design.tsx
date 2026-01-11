import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useGameStore } from '../../store/gameStore';
import { useState } from 'react';
import { translations } from '../../constants/translations';

const ROUNDS = [1, 2, 3, 4, 5];

export default function CreatorDesignStep() {
    const router = useRouter();
    const { creatorImages, creatorRoundLayouts, setCreatorRoundSlot, resetCreator, language } = useGameStore();
    const t = translations[language].creator;

    const [activeRound, setActiveRound] = useState(1);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

    const currentLayout = creatorRoundLayouts[activeRound] || Array(8).fill(null);

    const [confirmModalVisible, setConfirmModalVisible] = useState(false);

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
        // Check for ANY empty slots across all rounds
        const hasEmptySlots = [1, 2, 3, 4, 5].some(r => {
            const layout = creatorRoundLayouts[r] || Array(8).fill(null);
            return layout.some(slot => slot === null);
        });

        if (hasEmptySlots) {
            // Show custom confirmation modal
            setConfirmModalVisible(true);
            return;
        }

        // If no empty slots, proceed directly
        proceedToGame();
    };

    const proceedToGame = () => {
        const { loadCustomLevel } = useGameStore.getState();
        loadCustomLevel();
        router.push('/game/custom');
    };

    const handleConfirmFill = () => {
        const { fillRandomSlots } = useGameStore.getState();
        fillRandomSlots();
        setConfirmModalVisible(false);
        proceedToGame();
    };

    const handleBack = () => {
        router.back();
    };

    return (
        <View style={styles.container}>
            {/* Header with Back Button */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <Text style={styles.backButtonText}>←</Text>
                </TouchableOpacity>
                <Text style={styles.title}>{t.designTitle}</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.steps}><Text style={styles.step}>1 — 2 — </Text><Text style={styles.stepActive}>3</Text></View>

            <Text style={styles.subtitle}>{t.designSubtitle}</Text>

            {/* Centered Numbered Tabs */}
            <View style={styles.tabsContainer}>
                <View style={styles.tabs}>
                    {ROUNDS.map(r => (
                        <TouchableOpacity
                            key={r}
                            onPress={() => setActiveRound(r)}
                            style={[styles.tab, activeRound === r && styles.tabActive]}
                        >
                            <Text style={[styles.tabText, activeRound === r && styles.tabTextActive]}>{r}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
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
                <Text style={styles.finishText}>{t.finish}</Text>
            </TouchableOpacity>

            {/* Image Selection Modal */}
            <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{t.chooseImage}</Text>
                        <ScrollView contentContainerStyle={styles.modalGallery}>
                            {creatorImages.map((uri, idx) => (
                                <TouchableOpacity key={idx} onPress={() => handleImageSelect(uri)} style={styles.modalImageContainer}>
                                    <Image source={{ uri }} style={styles.modalImage} />
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                            <Text style={styles.closeText}>{t.cancel}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            {/* Confirmation Modal */}
            <Modal visible={confirmModalVisible} animationType="fade" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.confirmModalContent}>
                        <Text style={styles.modalTitle}>{t.incompleteRounds.title}</Text>
                        <Text style={styles.confirmMessage}>
                            {t.incompleteRounds.message}
                        </Text>

                        <View style={styles.confirmButtons}>
                            <TouchableOpacity onPress={() => setConfirmModalVisible(false)} style={[styles.confirmButton, styles.cancelButton]}>
                                <Text style={styles.cancelButtonText}>{t.incompleteRounds.no}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={handleConfirmFill} style={[styles.confirmButton, styles.okButton]}>
                                <Text style={styles.okButtonText}>{t.incompleteRounds.yes}</Text>
                            </TouchableOpacity>
                        </View>
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
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 10,
    },
    backButton: {
        padding: 10,
    },
    backButtonText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
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
    tabsContainer: {
        alignItems: 'center',
        marginBottom: 20,
        width: '100%',
    },
    tabs: {
        flexDirection: 'row',
        gap: 15,
    },
    tab: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    tabActive: {
        backgroundColor: '#FFEB3B', // Yellow
        borderColor: 'black',
        borderWidth: 2,
    },
    tabText: {
        color: '#666',
        fontSize: 16,
    },
    tabTextActive: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 18,
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
    // Confirm Modal Styles
    confirmModalContent: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 25,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: '90%',
        maxWidth: 400,
    },
    confirmMessage: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 22,
    },
    confirmButtons: {
        flexDirection: 'row',
        gap: 15,
        width: '100%',
    },
    confirmButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
    },
    cancelButton: {
        backgroundColor: 'white',
        borderColor: '#ccc',
    },
    okButton: {
        backgroundColor: '#FFEB3B',
        borderColor: 'black',
    },
    cancelButtonText: {
        color: '#666',
        fontWeight: 'bold',
    },
    okButtonText: {
        color: 'black',
        fontWeight: 'bold',
    },
});
