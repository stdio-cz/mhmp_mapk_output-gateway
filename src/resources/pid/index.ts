export * from "./models/DepartureBoardsModel";
export * from "./PIDRouter";

export interface IDeparture {
    delay_seconds: number;
    delay_minutes: number;
    is_delay_available: boolean;
    arrival_time: string;
    departure_time: string;
    arrival_datetime: string;
    departure_datetime: string;
    arrival_datetime_real: string;
    departure_datetime_real: string;
    route_short_name: string;
    trip_id: string;
    trip_headsign: string;
    trip_short_name?: string;
    service_id: string;
    stop_id: string;
    stop_name: string;
    last_stop_id: string;
    last_stop_name: string;
    platform_code: string;
    route_type: number;
    wheelchair_boarding: number;
    wheelchair_accessible: number;
    is_canceled: boolean;
}

export interface IStop {
    stop_id: string;
    stop_name: string;
    platform_code: string;
}

export interface IDepartureBoard {
    departures: [IDeparture];
    infotexts: [any];
    stops: [IStop];
}
