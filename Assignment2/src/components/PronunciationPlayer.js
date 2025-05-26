import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import audioFiles from '../../resources/audioMap';

export default function PronunciationPlayer({ 
  label, 
  gender,
  isOpen,
  onOpen,
  onClose,
  speed,
  onSpeedChange
}) {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const genderIcon = gender === 'male' ? 'male' : 'female';
  const genderColor = gender === 'male' ? '#4287f5' : '#e0564c';

  const playSound = async () => {
    if (isPlaying) {
      await stopSound();
      return;
    }

    setIsLoading(true);
    const fileKey = `${label} ${gender === 'male' ? 'Male' : 'Female'}`;
    const audioSource = audioFiles[fileKey];

    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        audioSource,
        { shouldPlay: true }
      );
      
      setSound(newSound);
      await newSound.setRateAsync(speed, true);
      setIsPlaying(true);
      setIsLoading(false);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying(false);
        }
      });
    } catch (error) {
      console.error('Error playing sound:', error);
      setIsLoading(false);
    }
  };

  const stopSound = async () => {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const speedOptions = [
    { label: '0.25x', value: 0.25 },
    { label: '0.33x', value: 0.33 },
    { label: '0.75x', value: 0.75 },
    { label: '1.0x', value: 1.0 },
  ];

  return (
    <View style={styles.container}>
      {/* Play/Pause Button */}
      <TouchableOpacity onPress={playSound} style={styles.playButton}>
        {isLoading ? (
          <ActivityIndicator size="small" color="#666" />
        ) : (
          <Ionicons 
            name={isPlaying ? "pause" : "play"} 
            size={24} 
            color="#4287f5" 
          />
        )}
      </TouchableOpacity>

      {/* Drug Name Label */}
      <Text style={styles.label} numberOfLines={1} ellipsizeMode="tail">
        {label}
      </Text>

      {/* Gender Icon */}
      <Ionicons 
        name={genderIcon} 
        size={20} 
        color={genderColor} 
        style={styles.genderIcon} 
      />

      {/* Speed Selector */}
      {isOpen ? (
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={speed}
            style={styles.picker}
            onValueChange={(itemValue) => {
              onSpeedChange(itemValue);
              if (isPlaying && sound) {
                sound.setRateAsync(itemValue, true);
              }
            }}>
            {speedOptions.map((option) => (
              <Picker.Item 
                key={option.value} 
                label={option.label} 
                value={option.value} 
              />
            ))}
          </Picker>
        </View>
      ) : (
        <TouchableOpacity onPress={onOpen} style={styles.speedButton}>
          <Text style={styles.speedText}>{speed}x</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginVertical: 6,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  playButton: {
    padding: 8,
    marginRight: 10,
  },
  label: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  genderIcon: {
    marginHorizontal: 12,
  },
  pickerContainer: {
    width: 100,
    height: 40,
    justifyContent: 'center',
  },
  picker: {
    width: '100%',
    height: '100%',
  },
  speedButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  speedText: {
    fontSize: 14,
    color: '#333',
  },
});
  // const [items, setItems] = useState([
  //   { label: '1.0', value: 1.0 },
  //   { label: '0.75', value: 0.75 },
  //   { label: '0.33', value: 0.33 },
  //   { label: '0.25', value: 0.25 },
  // ]);

//   const [setSound] = useState();

//   const playSound = async () => {
//     try {
//       const fileKey = `${label} ${gender === 'male' ? '1 - male' : '- female'}.wav`;
//       const audioModule = audioFiles[fileKey];

//       if (!audioModule) {
//         console.warn(`Audio not found for: ${fileKey}`);
//         return;
//       }

//       const { sound } = await Audio.Sound.createAsync(
//         require("./assets/audio.wav"),
//         {shouldPlay: true}
//       );

//       await sound.setRateAsync(speed, true);
//       await sound.playAsync();
//     } catch (error) {
//       console.error('Error playing sound:', error);
//     }
//   };

//   useEffect(() => {
//     return sound ? () => {
//       console.log("Unloading Sound");
//       sound.unloadAsync();
//     }
//     : undefined;
//   }, [sound]);
  
//   const genderIcon = gender === 'male' ? 'male' : 'female';
//   const genderColor = gender === 'male' ? '#007AFF' : '#FF2D55';

//   return (
//     <View style={styles.container}>
//       <Ionicons name="volume-high" size={20} color="black" onPress={playSound} style={styles.iconButton}/>

//       <Text style={styles.label}>{label}</Text>

//       <Ionicons name={genderIcon} size={20} color={genderColor} style={styles.genderIcon} />

//       <View style={{ width: 100, zIndex: 1000}}>
//         <DropDownPicker
//           open={isOpen}
//           setOpen={(open) => (open ? onOpen() : onClose())}
//           value={speed}
//           setValue={(valueOrFn) => {
//             const value = typeof valueOrFn === 'function' ? valueOrFn(speed) : valueOrFn;
//             setSpeed(value);
//           }}
//           items={items}
//           setItems={setItems}
//           style={styles.dropdown}
//           dropDownContainerStyle={{ zIndex: 2000 }}
//           textStyle={{ fontSize: 14 }}
//         />
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 8,
//     padding: 10,
//     borderRadius: 8,
//     backgroundColor: '#fff',
//     elevation: 2,
//   },
//   iconButton: {
//     marginRight: 10,
//   },
//   label: {
//     fontWeight: 'bold',
//     fontSize: 16,
//     flex: 1,
//   },
//   genderIcon: {
//     marginHorizontal: 10,
//   },
//   dropdown: {
//     minHeight: 30,
//     borderColor: '#ccc',
//     zIndex: 1000,

//   },
// });


