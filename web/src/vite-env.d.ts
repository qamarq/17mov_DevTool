/// <reference types="vite/client" />

type WeatherType = "CLEAR" | "EXTRASUNNY" | "CLOUDS" | "OVERCAST" | "RAIN" | "CLEARING" | "THUNDER" | "SMOG" | "FOGGY" | "XMAS" | "SNOW" | "SNOWLIGHT" | "BLIZZARD" | "HALLOWEEN" | "NEUTRAL"

interface IncomingData {
    coords: { x: number, y: number, z: number },
    heading: number,
    time: { hour: string, minute: string },
    weather: WeatherType,
    freezeTime: boolean,
    freezeWeather: boolean,
    portals: {
        portalPoly: boolean;
        portalLines: boolean;
        portalCorners: boolean;
        portalInfos: boolean;
    }
}



interface Room {
    timecycle: string;
    flags: {
        total: number;
        list: string[];
    };
    index: number;
    name: string;
    isCurrent?: boolean;
}

interface Portal {
    roomFrom: number;
    roomTo: number;
    index: number;
    flags: {
        total: number;
        list: string[];
    };
}

interface InteriorData {
    roomCount: number;
    currentRoom: Room;
    interiorId: number;
    portalCount: number;
    portals: {
        [key: string]: Portal;
    };
    rooms: Room[];
}


interface TimecyclesData {
    value: string;
    label: string;
}

interface PedBone {
    bone: string;
    boneId: number;
}

interface Preset {
    id: string;
    name: string;
    visible: boolean;
    objectList: { 
        id: string, 
        name: string,
        handle: number, 
        visible: boolean,
        position: { x: number, y: number, z: number },
        rotation: { x: number, y: number, z: number },
        scale: number
    }[];
}

interface Ped {
    id: string;
    model: string;
    name: string;
    handle: number;
    coords: { x: number, y: number, z: number };
    rotation: { x: number, y: number, z: number };
    animation: { dict: string, clip: string };
}