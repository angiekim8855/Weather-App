import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View, Dimensions, ActivityIndicator } from "react-native";
import * as Location from "expo-location";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const API_KEY = "784ab24ff2ed5d94d4288abed9e25d13";

export default function HomeScreen() {
    const [city, setCity] = useState("Loading...");
    const [days, setDays] = useState([]);
    const [getLocationPermission, setGetLocationPermission] = useState(true);

    const getWeather = async () => {
        const { granted } = await Location.requestForegroundPermissionsAsync();
        if (!granted) {
            setGetLocationPermission(false);
        }
        const {
            coords: { latitude, longitude },
        } = await Location.getCurrentPositionAsync({ accuracy: 5 });

        // const location = await Location.reverseGeocodeAsync({ latitude, longitude });
        // location[0]?.city && setCity(location[0].city);

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${latitude}&lon=${longitude}&APPID=${API_KEY}&units=metric`
        );
        const json = await response.json();
        setDays(json.list);
        setCity(json.city.name);
    };

    useEffect(() => {
        getWeather();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.city}>
                <Text style={styles.cityName}>{city}</Text>
            </View>
            <ScrollView horizontal pagingEnabled contentContainerStyle={styles.weather}>
                {days.length === 0 ? (
                    <View style={styles.day}>
                        <ActivityIndicator size="large" color="white" />
                    </View>
                ) : (
                    days.map((day: any, index) => (
                        <View key={index} style={styles.day}>
                            <Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(1)}</Text>
                            <Text style={styles.description}>{day.weather[0].main}</Text>
                            <Text style={styles.tinyText}>{day.weather[0].description}</Text>
                        </View>
                    ))
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "mediumseagreen" },
    city: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    cityName: {
        fontSize: 60,
        fontWeight: 600,
    },
    weather: {},
    day: {
        width: SCREEN_WIDTH,
        alignItems: "center",
    },
    temp: { marginTop: 50, fontSize: 130 },
    description: { marginTop: -30, fontSize: 50 },
    tinyText: { fontSize: 20 },
});
