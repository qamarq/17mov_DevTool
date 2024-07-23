type WeatherType = "CLEAR" | "EXTRASUNNY" | "CLOUDS" | "OVERCAST" | "RAIN" | "CLEARING" | "THUNDER" | "SMOG" | "FOGGY" | "XMAS" | "SNOW" | "SNOWLIGHT" | "BLIZZARD" | "HALLOWEEN" | "NEUTRAL"

interface IncomingData {
    coords: { x: number, y: number, z: number },
    heading: number,
    time: { hour: string, minute: string },
    weather: WeatherType
}