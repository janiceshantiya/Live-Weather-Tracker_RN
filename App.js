import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Location from 'expo-location';

const API_KEY = '6c89e645cf5d497eb77111338251007'; // 🔐 Replace with your OpenWeatherMap API key

export default function App() {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [location, setLocation] = useState(null);
  const [temperature, setTemperature] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        // Request location permission
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('Permission to access location was denied');
          return;
        }

        // Get coordinates
        let loc = await Location.getCurrentPositionAsync({});
        const city = await Location.reverseGeocodeAsync(loc.coords);
        setLocation(city[0]?.city || 'Unknown');

        // Fetch temperature
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${loc.coords.latitude}&lon=${loc.coords.longitude}&appid=${API_KEY}&units=metric`;
        const response = await fetch(weatherUrl);
        const data = await response.json();

        if (data.main && data.main.temp !== undefined) {
          setTemperature(data.main.temp);
        } else {
          console.log("Temperature data not found in response");
      }

      } catch (error) {
        console.log('Error fetching weather:', error);
      }
    })();
  }, []);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowPicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const getDay = () => {
    const options = { weekday: 'long' };
    return date.toLocaleDateString('en-US', options);
  };

  const getTime = () => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.day}>{getDay()}</Text>
      <Text style={styles.time}>{getTime()}</Text>

      <View style={styles.datePickerContainer}>
        {showPicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onChange}
          />
        )}
      </View>

      <View style={styles.weatherContainer}>
        <Text style={styles.city}>{location || 'Fetching City...'}</Text>
        <Text style={styles.temp}>
              {temperature !== null ? `${Math.round(temperature)} °C` : '34°C'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F6F9',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  day: {
    fontSize: 22,
    fontWeight: '500',
    color: '#333',
  },
  time: {
    fontSize: 54,
    fontWeight: 'bold',
    color: '#1e1e1e',
    marginVertical: 20,
  },
  datePickerContainer: {
    marginBottom: 30,
  },
  weatherContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  city: {
    fontSize: 26,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  temp: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ff6b6b',
  },
});