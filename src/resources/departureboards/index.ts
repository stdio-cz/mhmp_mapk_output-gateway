export * from "./DepartureBoardsModel";
export * from "./DepartureBoardsRouter";

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
    service_id: string;
    stop_id: string;
    stop_name: string;
    platform_code: string;
    route_type: number;
    wheelchair_boarding: number;
    wheelchair_accessible: number;
    is_canceled: boolean;
}
