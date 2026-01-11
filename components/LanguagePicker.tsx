import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback, Image } from 'react-native';
import { useGameStore } from '../store/gameStore';
import { Language } from '../constants/translations';

const FLAGS = {
    EN: require('../assets/flags/en.png'),
    FR: require('../assets/flags/fr.png'),
    ES: require('../assets/flags/es.png'),
};

export default function LanguagePicker() {
    const { language, setLanguage } = useGameStore();
    const [expanded, setExpanded] = useState(false);

    const languages: Language[] = ['EN', 'FR', 'ES'];

    const handleSelect = (lang: Language) => {
        setLanguage(lang);
        setExpanded(false);
    };

    return (
        <View>
            <TouchableOpacity onPress={() => setExpanded(!expanded)} style={styles.button}>
                <Image source={FLAGS[language]} style={styles.flagIcon} />
                <Text style={styles.arrow}>▼</Text>
            </TouchableOpacity>

            {expanded && (
                <Modal transparent visible={expanded} animationType="fade">
                    <TouchableWithoutFeedback onPress={() => setExpanded(false)}>
                        <View style={styles.overlay}>
                            <View style={styles.dropdown}>
                                {languages.map((lang) => (
                                    <TouchableOpacity
                                        key={lang}
                                        onPress={() => handleSelect(lang)}
                                        style={[
                                            styles.option,
                                            language === lang && styles.activeOption
                                        ]}
                                    >
                                        <Image source={FLAGS[lang]} style={styles.dropdownFlag} />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 25,
        paddingHorizontal: 0,
        paddingVertical: 6,
        minWidth: 60,
        shadowColor: '#000',
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 2,
    },
    flagIcon: {
        width: 24,
        height: 16,
        marginRight: 6,
        borderRadius: 2,
        resizeMode: 'contain',
    },
    arrow: {
        fontSize: 10,
        color: 'black',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.1)',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        paddingTop: 60,
        paddingRight: 20,
    },
    dropdown: {
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 15,
        overflow: 'hidden',
        width: 60,
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 5,
    },
    option: {
        paddingVertical: 10,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    activeOption: {
        backgroundColor: '#FFEB3B',
    },
    dropdownFlag: {
        width: 24,
        height: 16,
        borderRadius: 2,
        resizeMode: 'contain',
    },
});
