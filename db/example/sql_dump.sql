-- EXAMPLE DATA - contains real example of production data, for testing purposes

INSERT INTO "ropidgtfs_trips" ("bikes_allowed", "block_id", "direction_id", "exceptional", "route_id", "service_id", "shape_id", "trip_headsign", "trip_id", "wheelchair_accessible", "create_batch_id", "created_at", "created_by", "update_batch_id", "updated_at", "updated_by", "trip_operation_type", "trip_short_name") VALUES
(1,	'',	'0',	'0',	'L991',	'1111100-1',	'L991V1',	'Nemocnice Motol',	'991_1151_190107',	1,	NULL,	'2019-05-27 03:20:24.44+00',	NULL,	NULL,	'2019-05-27 03:20:24.44+00',	NULL,	1,	''),
(1,	'',	1,	'0',	'L991',	'1111100-1',	'L991V2',	'Depo Hostivař',	'991_4_190107',	1,	NULL,	'2019-05-27 03:20:24.44+00',	NULL,	NULL,	'2019-05-27 03:20:24.44+00',	NULL,	1,	''),
(1,	'',	'0',	'0',	'L991',	'1111100-1',	'L991V3',	'Nemocnice Motol',	'991_1152_190107',	1,	NULL,	'2019-05-27 03:20:24.44+00',	NULL,	NULL,	'2019-05-27 03:20:24.44+00',	NULL,	1,	''),
(1,	'',	1,	'0',	'L991',	'1111100-1',	'L991V4',	'Depo Hostivař',	'991_6_190107',	1,	NULL,	'2019-05-27 03:20:24.44+00',	NULL,	NULL,	'2019-05-27 03:20:24.44+00',	NULL,	1,	''),
(1,	'',	'0',	'0',	'L991',	'1111100-1',	'L991V5',	'Nemocnice Motol',	'991_1153_190107',	1,	NULL,	'2019-05-27 03:20:24.44+00',	NULL,	NULL,	'2019-05-27 03:20:24.44+00',	NULL,	1,	''),
(1,	'',	1,	'0',	'L991',	'1111100-1',	'L991V2',	'Depo Hostivař',	'991_8_180709',	1,	NULL,	'2019-05-27 03:20:24.44+00',	NULL,	NULL,	'2019-05-27 03:20:24.44+00',	NULL,	1,	''),
(1,	'',	'0',	'0',	'L991',	'1111100-1',	'L991V3',	'Nemocnice Motol',	'991_1154_180709',	1,	NULL,	'2019-05-27 03:20:24.44+00',	NULL,	NULL,	'2019-05-27 03:20:24.44+00',	NULL,	1,	''),
(1,	'',	1,	'0',	'L991',	'1111100-1',	'L991V6',	'Skalka',	'991_10_180709',	1,	NULL,	'2019-05-27 03:20:24.44+00',	NULL,	NULL,	'2019-05-27 03:20:24.44+00',	NULL,	1,	''),
(1,	'',	'0',	'0',	'L991',	'1111100-1',	'L991V1',	'Nemocnice Motol',	'991_1155_180709',	1,	NULL,	'2019-05-27 03:20:24.44+00',	NULL,	NULL,	'2019-05-27 03:20:24.44+00',	NULL,	1,	''),
(1,	'',	1,	'0',	'L991',	'1111100-1',	'L991V2',	'Depo Hostivař',	'991_12_180709',	1,	NULL,	'2019-05-27 03:20:24.44+00',	NULL,	NULL,	'2019-05-27 03:20:24.44+00',	NULL,	1,	'');


INSERT INTO "ropidgtfs_stop_times" ("arrival_time", "arrival_time_seconds", "departure_time", "departure_time_seconds", "drop_off_type", "pickup_type", "shape_dist_traveled", "stop_headsign", "stop_id", "stop_sequence", "trip_id", "create_batch_id", "created_at", "created_by", "update_batch_id", "updated_at", "updated_by", "timepoint") VALUES
('7:22:55',	NULL,	'7:22:55',	NULL,	'0',	'0',	0,	'',	'U953Z102P',	1,	'991_1151_190107',	NULL,	'2019-05-27 03:25:47.13+00',	NULL,	NULL,	'2019-05-27 03:25:47.13+00',	NULL,	NULL),
('7:25:00',	NULL,	'7:25:30',	NULL,	'0',	'0',	1.3759,	'',	'U713Z102P',	2,	'991_1151_190107',	NULL,	'2019-05-27 03:25:47.13+00',	NULL,	NULL,	'2019-05-27 03:25:47.13+00',	NULL,	NULL),
('7:27:00',	NULL,	'7:27:30',	NULL,	'0',	'0',	2.60955,	'',	'U921Z102P',	3,	'991_1151_190107',	NULL,	'2019-05-27 03:25:47.13+00',	NULL,	NULL,	'2019-05-27 03:25:47.13+00',	NULL,	NULL),
('7:28:45',	NULL,	'7:29:05',	NULL,	'0',	'0',	3.54618,	'',	'U118Z102P',	4,	'991_1151_190107',	NULL,	'2019-05-27 03:25:47.13+00',	NULL,	NULL,	'2019-05-27 03:25:47.13+00',	NULL,	NULL),
('7:30:15',	NULL,	'7:30:35',	NULL,	'0',	'0',	4.40089,	'',	'U209Z102P',	5,	'991_1151_190107',	NULL,	'2019-05-27 03:25:47.13+00',	NULL,	NULL,	'2019-05-27 03:25:47.13+00',	NULL,	NULL),
('7:31:45',	NULL,	'7:32:05',	NULL,	'0',	'0',	5.25049,	'',	'U476Z102P',	6,	'991_1151_190107',	NULL,	'2019-05-27 03:25:47.13+00',	NULL,	NULL,	'2019-05-27 03:25:47.13+00',	NULL,	NULL),
('7:33:15',	NULL,	'7:33:45',	NULL,	'0',	'0',	6.10383,	'',	'U400Z102P',	7,	'991_1151_190107',	NULL,	'2019-05-27 03:25:47.13+00',	NULL,	NULL,	'2019-05-27 03:25:47.13+00',	NULL,	NULL),
('7:34:45',	NULL,	'7:35:15',	NULL,	'0',	'0',	6.75666,	'',	'U1072Z102P',	8,	'991_1151_190107',	NULL,	'2019-05-27 03:25:47.13+00',	NULL,	NULL,	'2019-05-27 03:25:47.13+00',	NULL,	NULL),
('7:36:20',	NULL,	'7:36:40',	NULL,	'0',	'0',	7.49417,	'',	'U703Z102P',	9,	'991_1151_190107',	NULL,	'2019-05-27 03:25:47.13+00',	NULL,	NULL,	'2019-05-27 03:25:47.13+00',	NULL,	NULL),
('7:37:45',	NULL,	'7:38:05',	NULL,	'0',	'0',	8.27543,	'',	'U360Z102P',	10,	'991_1151_190107',	NULL,	'2019-05-27 03:25:47.13+00',	NULL,	NULL,	'2019-05-27 03:25:47.13+00',	NULL,	NULL),
('7:39:20',	NULL,	'7:39:50',	NULL,	'0',	'0',	9.12765,	'',	'U163Z102P',	11,	'991_1151_190107',	NULL,	'2019-05-27 03:25:47.13+00',	NULL,	NULL,	'2019-05-27 03:25:47.13+00',	NULL,	NULL),
('7:41:10',	NULL,	'7:41:40',	NULL,	'0',	'0',	9.95487,	'',	'U321Z102P',	12,	'991_1151_190107',	NULL,	'2019-05-27 03:25:47.13+00',	NULL,	NULL,	'2019-05-27 03:25:47.13+00',	NULL,	NULL),
('7:44:05',	NULL,	'7:44:25',	NULL,	'0',	'0',	12.1394,	'',	'U157Z102P',	13,	'991_1151_190107',	NULL,	'2019-05-27 03:25:47.13+00',	NULL,	NULL,	'2019-05-27 03:25:47.13+00',	NULL,	NULL),
('7:45:50',	NULL,	'7:46:10',	NULL,	'0',	'0',	13.19997,	'',	'U462Z102P',	14,	'991_1151_190107',	NULL,	'2019-05-27 03:25:47.13+00',	NULL,	NULL,	'2019-05-27 03:25:47.13+00',	NULL,	NULL),
('7:47:45',	NULL,	'7:48:15',	NULL,	'0',	'0',	14.33436,	'',	'U507Z102P',	15,	'991_1151_190107',	NULL,	'2019-05-27 03:25:47.13+00',	NULL,	NULL,	'2019-05-27 03:25:47.13+00',	NULL,	NULL),
('7:50:10',	NULL,	'7:50:10',	NULL,	'0',	'0',	15.86985,	'',	'U306Z102P',	16,	'991_1151_190107',	NULL,	'2019-05-27 03:25:47.13+00',	NULL,	NULL,	'2019-05-27 03:25:47.13+00',	NULL,	NULL);

INSERT INTO "ropidgtfs_stops" ("location_type", "parent_station", "platform_code", "stop_id", "stop_lat", "stop_lon", "stop_name", "stop_url", "wheelchair_boarding", "zone_id", "create_batch_id", "created_at", "created_by", "update_batch_id", "updated_at", "updated_by", "level_id", "stop_code", "stop_desc", "stop_timezone") VALUES
('0',	'U953S1',	'2',	'U953Z102P',	50.06844,	14.50717,	'Skalka',	'',	1,	'P',	NULL,	'2019-05-27 03:20:19.912+00',	NULL,	NULL,	'2019-05-27 03:20:19.912+00',	NULL,	NULL,	NULL,	NULL,	NULL);

INSERT INTO "ropidgtfs_stops" ("location_type", "parent_station", "platform_code", "stop_id", "stop_lat", "stop_lon", "stop_name", "stop_url", "wheelchair_boarding", "zone_id", "create_batch_id", "created_at", "created_by", "update_batch_id", "updated_at", "updated_by", "level_id", "stop_code", "stop_desc", "stop_timezone") VALUES
('0',	'U713S1',	'2',	'U713Z102P',	50.07334,	14.49009,	'Strašnická',	'',	1,	'P',	NULL,	'2019-05-27 03:20:18.808+00',	NULL,	NULL,	'2019-05-27 03:20:18.808+00',	NULL,	NULL,	NULL,	NULL,	NULL);

INSERT INTO "ropidgtfs_stops" ("location_type", "parent_station", "platform_code", "stop_id", "stop_lat", "stop_lon", "stop_name", "stop_url", "wheelchair_boarding", "zone_id", "create_batch_id", "created_at", "created_by", "update_batch_id", "updated_at", "updated_by", "level_id", "stop_code", "stop_desc", "stop_timezone") VALUES
('0',	'U921S1',	'2',	'U921Z102P',	50.07854,	14.47489,	'Želivského',	'',	2,	'P',	NULL,	'2019-05-27 03:20:18.808+00',	NULL,	NULL,	'2019-05-27 03:20:18.808+00',	NULL,	NULL,	NULL,	NULL,	NULL);

INSERT INTO "ropidgtfs_stops" ("location_type", "parent_station", "platform_code", "stop_id", "stop_lat", "stop_lon", "stop_name", "stop_url", "wheelchair_boarding", "zone_id", "create_batch_id", "created_at", "created_by", "update_batch_id", "updated_at", "updated_by", "level_id", "stop_code", "stop_desc", "stop_timezone") VALUES
('0',	'U118S1',	'2',	'U118Z102P',	50.07829,	14.46189,	'Flora',	'',	2,	'P',	NULL,	'2019-05-27 03:20:16.491+00',	NULL,	NULL,	'2019-05-27 03:20:16.491+00',	NULL,	NULL,	NULL,	NULL,	NULL);

INSERT INTO "ropidgtfs_stops" ("location_type", "parent_station", "platform_code", "stop_id", "stop_lat", "stop_lon", "stop_name", "stop_url", "wheelchair_boarding", "zone_id", "create_batch_id", "created_at", "created_by", "update_batch_id", "updated_at", "updated_by", "level_id", "stop_code", "stop_desc", "stop_timezone") VALUES
('0',	'U209S1',	'2',	'U209Z102P',	50.07764,	14.45004,	'Jiřího z Poděbrad',	'',	2,	'P',	NULL,	'2019-05-27 03:20:16.491+00',	NULL,	NULL,	'2019-05-27 03:20:16.491+00',	NULL,	NULL,	NULL,	NULL,	NULL);

INSERT INTO "ropidgtfs_stops" ("location_type", "parent_station", "platform_code", "stop_id", "stop_lat", "stop_lon", "stop_name", "stop_url", "wheelchair_boarding", "zone_id", "create_batch_id", "created_at", "created_by", "update_batch_id", "updated_at", "updated_by", "level_id", "stop_code", "stop_desc", "stop_timezone") VALUES
('0',	'U476S1',	'2',	'U476Z102P',	50.0754,	14.43908,	'Náměstí Míru',	'',	2,	'P',	NULL,	'2019-05-27 03:20:17.945+00',	NULL,	NULL,	'2019-05-27 03:20:17.945+00',	NULL,	NULL,	NULL,	NULL,	NULL);

INSERT INTO "ropidgtfs_stops" ("location_type", "parent_station", "platform_code", "stop_id", "stop_lat", "stop_lon", "stop_name", "stop_url", "wheelchair_boarding", "zone_id", "create_batch_id", "created_at", "created_by", "update_batch_id", "updated_at", "updated_by", "level_id", "stop_code", "stop_desc", "stop_timezone") VALUES
('0',	'U376S1',	'2',	'U276Z106P',	50.0754,	14.43908,	'I.P. Pavlova',	'',	2,	'P',	NULL,	'2019-05-27 03:20:17.945+00',	NULL,	NULL,	'2019-05-27 03:20:17.945+00',	NULL,	NULL,	NULL,	NULL,	NULL);

INSERT INTO "ropidgtfs_stops" ("location_type", "parent_station", "platform_code", "stop_id", "stop_lat", "stop_lon", "stop_name", "stop_url", "wheelchair_boarding", "zone_id", "create_batch_id", "created_at", "created_by", "update_batch_id", "updated_at", "updated_by", "level_id", "stop_code", "stop_desc", "stop_timezone") VALUES
('0',	'U576S1',	'2',	'U376Z105P',	50.0754,	14.43908,	'Muzeum',	'',	2,	'P',	NULL,	'2019-05-27 03:20:17.945+00',	NULL,	NULL,	'2019-05-27 03:20:17.945+00',	NULL,	NULL,	NULL,	NULL,	NULL);

INSERT INTO "ropidgtfs_stops" ("location_type", "parent_station", "platform_code", "stop_id", "stop_lat", "stop_lon", "stop_name", "stop_url", "wheelchair_boarding", "zone_id", "create_batch_id", "created_at", "created_by", "update_batch_id", "updated_at", "updated_by", "level_id", "stop_code", "stop_desc", "stop_timezone") VALUES
('0',	'U776S1',	'2',	'U476Z104P',	50.0754,	14.43908,	'Dejvická',	'',	2,	'P',	NULL,	'2019-05-27 03:20:17.945+00',	NULL,	NULL,	'2019-05-27 03:20:17.945+00',	NULL,	NULL,	NULL,	NULL,	NULL);

INSERT INTO "ropidgtfs_stops" ("location_type", "parent_station", "platform_code", "stop_id", "stop_lat", "stop_lon", "stop_name", "stop_url", "wheelchair_boarding", "zone_id", "create_batch_id", "created_at", "created_by", "update_batch_id", "updated_at", "updated_by", "level_id", "stop_code", "stop_desc", "stop_timezone") VALUES
('0',	'U876S1',	'2',	'U476Z103P',	50.0754,	14.43908,	'Nádraží Holešovice',	'',	2,	'P',	NULL,	'2019-05-27 03:20:17.945+00',	NULL,	NULL,	'2019-05-27 03:20:17.945+00',	NULL,	NULL,	NULL,	NULL,	NULL);

INSERT INTO "ropidgtfs_shapes" ("shape_dist_traveled", "shape_id", "shape_pt_lat", "shape_pt_lon", "shape_pt_sequence", "create_batch_id", "created_at", "created_by", "update_batch_id", "updated_at", "updated_by") VALUES
(0,	'L991V1',	50.06841,	14.50717,	1,	NULL,	'2019-05-27 03:21:35.159+00',	NULL,	NULL,	'2019-05-27 03:21:35.159+00',	NULL),
(0.01713,	'L991V1',	50.06841,	14.50693,	2,	NULL,	'2019-05-27 03:21:35.159+00',	NULL,	NULL,	'2019-05-27 03:21:35.159+00',	NULL),
(0.13226,	'L991V1',	50.06847,	14.50533,	3,	NULL,	'2019-05-27 03:21:35.159+00',	NULL,	NULL,	'2019-05-27 03:21:35.159+00',	NULL),
(0.23339,	'L991V1',	50.06857,	14.50392,	4,	NULL,	'2019-05-27 03:21:35.159+00',	NULL,	NULL,	'2019-05-27 03:21:35.159+00',	NULL),
(0.34914,	'L991V1',	50.06876,	14.50233,	5,	NULL,	'2019-05-27 03:21:35.159+00',	NULL,	NULL,	'2019-05-27 03:21:35.159+00',	NULL),
(0.53804,	'L991V2',	50.06913,	14.49976,	6,	NULL,	'2019-05-27 03:21:35.159+00',	NULL,	NULL,	'2019-05-27 03:21:35.159+00',	NULL),
(0.59752,	'L991V3',	50.06931,	14.49897,	7,	NULL,	'2019-05-27 03:21:35.159+00',	NULL,	NULL,	'2019-05-27 03:21:35.159+00',	NULL),
(0.65156,	'L991V4',	50.06956,	14.49833,	8,	NULL,	'2019-05-27 03:21:35.159+00',	NULL,	NULL,	'2019-05-27 03:21:35.159+00',	NULL),
(0.7329,	'L991V5',	50.06999,	14.4974,	9,	NULL,	'2019-05-27 03:21:35.159+00',	NULL,	NULL,	'2019-05-27 03:21:35.159+00',	NULL),
(0.85384,	'L991V2',	50.07066,	14.49608,	10,	NULL,	'2019-05-27 03:21:35.159+00',	NULL,	NULL,	'2019-05-27 03:21:35.159+00',	NULL);

INSERT INTO "ropidgtfs_calendar" ("end_date", "friday", "monday", "saturday", "service_id", "start_date", "sunday", "thursday", "tuesday", "wednesday", "create_batch_id", "created_at", "created_by", "update_batch_id", "updated_at", "updated_by") VALUES
('20190609',	1,	1,	'0',	'1111100-1',	'20190527',	'0',	1,	1,	1,	NULL,	'2019-05-27 03:20:15.632+00',	NULL,	NULL,	'2019-05-27 03:20:15.632+00',	NULL);

INSERT INTO "ropidgtfs_routes" ("agency_id", "is_night", "route_color", "route_desc", "route_id", "route_long_name", "route_short_name", "route_text_color", "route_type", "route_url", "create_batch_id", "created_at", "created_by", "update_batch_id", "updated_at", "updated_by") VALUES
('99',	'0',	'00A562',	NULL,	'L991',	'Nemocnice Motol - Petřiny - Skalka - Depo Hostivař',	'A',	'FFFFFF',	'1',	'https://pid.cz/linka/A',	NULL,	'2019-05-27 03:20:15.738+00',	NULL,	NULL,	'2019-05-27 03:20:15.738+00',	NULL);

INSERT INTO "ropidgtfs_agency" ("agency_fare_url", "agency_id", "agency_lang", "agency_name", "agency_phone", "agency_timezone", "agency_url", "create_batch_id", "created_at", "created_by", "update_batch_id", "updated_at", "updated_by", "agency_email") VALUES
(NULL,	'99',	'cs',	'Pražská integrovaná doprava',	'+420234704560',	'Europe/Prague',	'https://pid.cz',	NULL,	'2019-05-27 03:20:15.469+00',	NULL,	NULL,	'2019-05-27 03:20:15.469+00',	NULL,	NULL);

INSERT INTO "vehiclepositions_trips" ("cis_id", "cis_number", "cis_order", "cis_short_name", "created_at", "gtfs_route_id", "gtfs_route_short_name", "gtfs_trip_id", "id", "updated_at", "start_cis_stop_id", "start_cis_stop_platform_code", "start_time", "start_timestamp", "vehicle_type", "wheelchair_accessible", "create_batch_id", "created_by", "update_batch_id", "updated_by") VALUES
(100115,	95,	39,	'115',	'2019-05-26 08:43:16.991+00',	'L115',	'115',	'115_107_180501',	'2019-05-26T09:13:00Z_100115_115_95',	'2019-05-26 09:56:37.275+00',	56714,	'D',	'11:13:00',	'2019-05-26 09:13:00+00',	3,	'1',	NULL,	NULL,	NULL,	NULL),
(100155,	104,	3,	'155',	'2019-05-26 08:35:16.925+00',	'L155',	'155',	'155_627_181215',	'2019-05-26T09:05:00Z_100155_155_104',	'2019-05-26 09:44:25.081+00',	59007,	'B',	'11:05:00',	'2019-05-26 09:05:00+00',	3,	'1',	NULL,	NULL,	NULL,	NULL),
(100155,	108,	1,	'155',	'2019-05-26 08:35:16.925+00',	'L155',	'155',	'155_1336_190504',	'2019-05-26T09:05:00Z_100155_155_108',	'2019-05-26 09:56:50.251+00',	57517,	'C',	'11:05:00',	'2019-05-26 09:05:00+00',	3,	'1',	NULL,	NULL,	NULL,	NULL),
(100155,	103,	3,	'155',	'2019-05-26 09:58:09.894+00',	'L155',	'155',	'155_632_181215',	'2019-05-26T10:28:00Z_100155_155_103',	'2019-05-26 11:04:53.759+00',	27902,	'F',	'12:28:00',	'2019-05-26 10:28:00+00',	3,	'1',	NULL,	NULL,	NULL,	NULL),
(100163,	67,	51,	'163',	'2019-05-26 08:27:16.981+00',	'L163',	'163',	'163_681_181027',	'2019-05-26T08:57:00Z_100163_163_67',	'2019-05-26 10:00:37.554+00',	53181,	'E',	'10:57:00',	'2019-05-26 08:57:00+00',	3,	'1',	NULL,	NULL,	NULL,	NULL),
(100166,	50,	2,	'166',	'2019-05-26 10:59:06.214+00',	'L166',	'166',	'166_250_180908',	'2019-05-26T11:29:00Z_100166_166_50',	'2019-05-26 12:27:17.008+00',	59501,	'B',	'13:29:00',	'2019-05-26 11:29:00+00',	3,	'1',	NULL,	NULL,	NULL,	NULL),
(100115,	45,	39,	'115',	'2019-05-27 05:10:39.922+00',	'L115',	'115',	'115_29_180430',	'2019-05-27T05:40:00Z_100115_115_45',	'2019-05-27 06:26:49.932+00',	56714,	'D',	'07:40:00',	'2019-05-27 05:40:00+00',	3,	'1',	NULL,	NULL,	NULL,	NULL),
(100221,	69,	12,	'221',	'2019-05-26 08:04:09.962+00',	'L221',	'221',	'221_501_181027',	'2019-05-26T08:34:00Z_100221_221_69',	'2019-05-26 09:35:56.071+00',	47090,	'17',	'10:34:00',	'2019-05-26 08:34:00+00',	3,	'1',	NULL,	NULL,	NULL,	NULL),
(100164,	73,	2,	'164',	'2019-05-26 10:32:10.183+00',	'L164',	'164',	'164_110_181027',	'2019-05-26T11:02:00Z_100164_164_73',	'2019-05-26 11:54:17.072+00',	50697,	'E',	'13:02:00',	'2019-05-26 11:02:00+00',	3,	'1',	NULL,	NULL,	NULL,	NULL),
(100221,	134,	13,	'221',	'2019-05-25 15:58:07.493+00',	'L221',	'221',	'221_623_190316',	'2019-05-25T16:28:00Z_100221_221_134',	'2019-05-25 17:29:50.951+00',	59059,	'B',	'18:28:00',	'2019-05-25 16:28:00+00',	3,	'1',	NULL,	NULL,	NULL,	NULL);


INSERT INTO "vehiclepositions_stops" ("arrival_time", "arrival_timestamp", "cis_stop_id", "cis_stop_platform_code", "cis_stop_sequence", "created_at", "delay_arrival", "delay_departure", "delay_type", "departure_time", "departure_timestamp", "updated_at", "trips_id", "create_batch_id", "created_by", "update_batch_id", "updated_by") VALUES
(NULL,	NULL,	56794,	'B',	2,	'2019-05-26 08:43:18.51503+00',	NULL,	25,	3,	'11:15:00',	'2019-05-26 09:15:00+00',	'2019-05-26 09:56:38.676097+00',	'2019-05-26T09:13:00Z_100115_115_95',	-1,	'integration-engine',	-1,	'integration-engine'),
(NULL,	NULL,	56714,	'D',	1,	'2019-05-26 08:43:18.51503+00',	NULL,	33,	3,	'11:13:00',	'2019-05-26 09:13:00+00',	'2019-05-26 09:56:38.676097+00',	'2019-05-26T09:13:00Z_100115_115_95',	-1,	'integration-engine',	-1,	'integration-engine'),
(NULL,	NULL,	56794,	'A',	7,	'2019-05-26 08:43:18.51503+00',	NULL,	91,	3,	'11:23:00',	'2019-05-26 09:23:00+00',	'2019-05-26 09:56:38.676097+00',	'2019-05-26T09:13:00Z_100115_115_95',	-1,	'integration-engine',	-1,	'integration-engine'),
(NULL,	NULL,	59066,	'A',	3,	'2019-05-26 08:43:18.51503+00',	NULL,	52,	3,	'11:17:00',	'2019-05-26 09:17:00+00',	'2019-05-26 09:56:38.676097+00',	'2019-05-26T09:13:00Z_100115_115_95',	-1,	'integration-engine',	-1,	'integration-engine'),
(NULL,	NULL,	58953,	'B',	5,	'2019-05-26 08:43:18.51503+00',	NULL,	91,	3,	'11:20:00',	'2019-05-26 09:20:00+00',	'2019-05-26 09:56:38.676097+00',	'2019-05-26T09:13:00Z_100115_115_95',	-1,	'integration-engine',	-1,	'integration-engine'),
(NULL,	NULL,	59113,	'A',	4,	'2019-05-26 08:43:18.51503+00',	NULL,	85,	3,	'11:19:00',	'2019-05-26 09:19:00+00',	'2019-05-26 09:56:38.676097+00',	'2019-05-26T09:13:00Z_100115_115_95',	-1,	'integration-engine',	-1,	'integration-engine'),
('11:25:00',	'2019-05-26 09:25:00+00',	56714,	'B',	8,	'2019-05-26 08:43:18.51503+00',	64,	NULL,	'0',	NULL,	NULL,	'2019-05-26 09:56:38.676097+00',	'2019-05-26T09:13:00Z_100115_115_95',	-1,	'integration-engine',	-1,	'integration-engine'),
(NULL,	NULL,	58789,	'A',	6,	'2019-05-26 08:43:18.51503+00',	NULL,	63,	3,	'11:22:00',	'2019-05-26 09:22:00+00',	'2019-05-26 09:56:38.676097+00',	'2019-05-26T09:13:00Z_100115_115_95',	-1,	'integration-engine',	-1,	'integration-engine');

INSERT INTO "vehiclepositions_stops" ("arrival_time", "arrival_timestamp", "cis_stop_id", "cis_stop_platform_code", "cis_stop_sequence", "created_at", "delay_arrival", "delay_departure", "delay_type", "departure_time", "departure_timestamp", "updated_at", "trips_id", "create_batch_id", "created_by", "update_batch_id", "updated_by") VALUES
('11:13:00',	'2019-05-26 09:13:00+00',	27902,	'I',	6,	'2019-05-26 08:35:18.459141+00',	91,	NULL,	'0',	NULL,	NULL,	'2019-05-26 09:44:26.743686+00',	'2019-05-26T09:05:00Z_100155_155_104',	-1,	'integration-engine',	-1,	'integration-engine'),
(NULL,	NULL,	57511,	'B',	2,	'2019-05-26 08:35:18.459141+00',	NULL,	111,	3,	'11:06:00',	'2019-05-26 09:06:00+00',	'2019-05-26 09:44:26.743686+00',	'2019-05-26T09:05:00Z_100155_155_104',	-1,	'integration-engine',	-1,	'integration-engine'),
(NULL,	NULL,	57512,	'A',	3,	'2019-05-26 08:35:18.459141+00',	NULL,	102,	3,	'11:08:00',	'2019-05-26 09:08:00+00',	'2019-05-26 09:44:26.743686+00',	'2019-05-26T09:05:00Z_100155_155_104',	-1,	'integration-engine',	-1,	'integration-engine'),
(NULL,	NULL,	57513,	'A',	4,	'2019-05-26 08:35:18.459141+00',	NULL,	97,	3,	'11:09:00',	'2019-05-26 09:09:00+00',	'2019-05-26 09:44:26.743686+00',	'2019-05-26T09:05:00Z_100155_155_104',	-1,	'integration-engine',	-1,	'integration-engine'),
(NULL,	NULL,	59007,	'B',	1,	'2019-05-26 08:35:18.459141+00',	NULL,	129,	3,	'11:05:00',	'2019-05-26 09:05:00+00',	'2019-05-26 09:44:26.743686+00',	'2019-05-26T09:05:00Z_100155_155_104',	-1,	'integration-engine',	-1,	'integration-engine'),
(NULL,	NULL,	57514,	'B',	5,	'2019-05-26 08:35:18.459141+00',	NULL,	90,	3,	'11:11:00',	'2019-05-26 09:11:00+00',	'2019-05-26 09:44:26.743686+00',	'2019-05-26T09:05:00Z_100155_155_104',	-1,	'integration-engine',	-1,	'integration-engine');

INSERT INTO "vehiclepositions_stops" ("arrival_time", "arrival_timestamp", "cis_stop_id", "cis_stop_platform_code", "cis_stop_sequence", "created_at", "delay_arrival", "delay_departure", "delay_type", "departure_time", "departure_timestamp", "updated_at", "trips_id", "create_batch_id", "created_by", "update_batch_id", "updated_by") VALUES
(NULL,	NULL,	56699,	'E',	3,	'2019-05-26 08:35:18.459141+00',	NULL,	81,	3,	'11:07:00',	'2019-05-26 09:07:00+00',	'2019-05-26 09:56:51.883279+00',	'2019-05-26T09:05:00Z_100155_155_108',	-1,	'integration-engine',	-1,	'integration-engine'),
('11:25:00',	'2019-05-26 09:25:00+00',	27902,	'I',	14,	'2019-05-26 08:35:18.459141+00',	119,	NULL,	'0',	NULL,	NULL,	'2019-05-26 09:56:51.883279+00',	'2019-05-26T09:05:00Z_100155_155_108',	-1,	'integration-engine',	-1,	'integration-engine'),
(NULL,	NULL,	56699,	'A',	2,	'2019-05-26 08:35:18.459141+00',	NULL,	64,	3,	'11:06:00',	'2019-05-26 09:06:00+00',	'2019-05-26 09:56:51.883279+00',	'2019-05-26T09:05:00Z_100155_155_108',	-1,	'integration-engine',	-1,	'integration-engine'),
(NULL,	NULL,	56700,	'A',	5,	'2019-05-26 08:35:18.459141+00',	NULL,	58,	3,	'11:11:00',	'2019-05-26 09:11:00+00',	'2019-05-26 09:56:51.883279+00',	'2019-05-26T09:05:00Z_100155_155_108',	-1,	'integration-engine',	-1,	'integration-engine'),
(NULL,	NULL,	57511,	'B',	10,	'2019-05-26 08:35:18.459141+00',	NULL,	137,	3,	'11:18:00',	'2019-05-26 09:18:00+00',	'2019-05-26 09:56:51.883279+00',	'2019-05-26T09:05:00Z_100155_155_108',	-1,	'integration-engine',	-1,	'integration-engine'),
(NULL,	NULL,	57512,	'A',	11,	'2019-05-26 08:35:18.459141+00',	NULL,	126,	3,	'11:20:00',	'2019-05-26 09:20:00+00',	'2019-05-26 09:56:51.883279+00',	'2019-05-26T09:05:00Z_100155_155_108',	-1,	'integration-engine',	-1,	'integration-engine'),
(NULL,	NULL,	65151,	'A',	7,	'2019-05-26 08:35:18.459141+00',	NULL,	95,	3,	'11:14:00',	'2019-05-26 09:14:00+00',	'2019-05-26 09:56:51.883279+00',	'2019-05-26T09:05:00Z_100155_155_108',	-1,	'integration-engine',	-1,	'integration-engine'),
(NULL,	NULL,	57515,	'A',	4,	'2019-05-26 08:35:18.459141+00',	NULL,	2,	3,	'11:09:00',	'2019-05-26 09:09:00+00',	'2019-05-26 09:56:51.883279+00',	'2019-05-26T09:05:00Z_100155_155_108',	-1,	'integration-engine',	-1,	'integration-engine'),
(NULL,	NULL,	57517,	'C',	1,	'2019-05-26 08:35:18.459141+00',	NULL,	27,	3,	'11:05:00',	'2019-05-26 09:05:00+00',	'2019-05-26 09:56:51.883279+00',	'2019-05-26T09:05:00Z_100155_155_108',	-1,	'integration-engine',	-1,	'integration-engine'),
(NULL,	NULL,	57515,	'B',	6,	'2019-05-26 08:35:18.459141+00',	NULL,	118,	3,	'11:12:00',	'2019-05-26 09:12:00+00',	'2019-05-26 09:56:51.883279+00',	'2019-05-26T09:05:00Z_100155_155_108',	-1,	'integration-engine',	-1,	'integration-engine'),
(NULL,	NULL,	59007,	'B',	9,	'2019-05-26 08:35:18.459141+00',	NULL,	145,	3,	'11:17:00',	'2019-05-26 09:17:00+00',	'2019-05-26 09:56:51.883279+00',	'2019-05-26T09:05:00Z_100155_155_108',	-1,	'integration-engine',	-1,	'integration-engine'),
(NULL,	NULL,	65163,	'A',	8,	'2019-05-26 08:35:18.459141+00',	NULL,	92,	3,	'11:15:00',	'2019-05-26 09:15:00+00',	'2019-05-26 09:56:51.883279+00',	'2019-05-26T09:05:00Z_100155_155_108',	-1,	'integration-engine',	-1,	'integration-engine'),
(NULL,	NULL,	57513,	'A',	12,	'2019-05-26 08:35:18.459141+00',	NULL,	128,	3,	'11:21:00',	'2019-05-26 09:21:00+00',	'2019-05-26 09:56:51.883279+00',	'2019-05-26T09:05:00Z_100155_155_108',	-1,	'integration-engine',	-1,	'integration-engine'),
(NULL,	NULL,	57514,	'B',	13,	'2019-05-26 08:35:18.459141+00',	NULL,	130,	3,	'11:23:00',	'2019-05-26 09:23:00+00',	'2019-05-26 09:56:51.883279+00',	'2019-05-26T09:05:00Z_100155_155_108',	-1,	'integration-engine',	-1,	'integration-engine');

INSERT INTO "vehiclepositions_positions" ("created_at", "delay", "delay_stop_arrival", "delay_stop_departure", "gtfs_next_stop_id", "gtfs_shape_dist_traveled", "is_canceled", "lat", "lng", "origin_time", "origin_timestamp", "tracking", "trips_id", "create_batch_id", "created_by", "update_batch_id", "updated_at", "updated_by", "id") VALUES
(now(),	127,	NULL,	83,	'U2817Z1',	52.2,	NULL,	50.02875,	15.19213,	'12:27:16',	'2019-05-27 10:27:16+00',	2,	'2019-05-26T09:13:00Z_100115_115_95',	NULL,	NULL,	NULL,	'2019-05-27 10:27:32.038+00',	NULL,	1),
(now(),	57,	NULL,	61,	'U967Z3P',	25.9,	NULL,	50.03694,	14.56214,	'12:24:09',	'2019-05-27 10:24:09+00',	2,	'2019-05-26T09:13:00Z_100115_115_95',	NULL,	NULL,	NULL,	'2019-05-27 10:24:35.463+00',	NULL,	2),
(now(),	385,	NULL,	383,	'U1644Z2',	34.2,	NULL,	50.03932,	14.24612,	'12:27:31',	'2019-05-27 10:27:31+00',	2,	'2019-05-26T09:13:00Z_100115_115_95',	NULL,	NULL,	NULL,	'2019-05-27 10:27:47.267+00',	NULL,	3),
(now(),	-21,	NULL,	22,	'U2286Z1',	37.1,	NULL,	50.24147,	14.31026,	'12:27:27',	'2019-05-27 10:27:27+00',	2,	'2019-05-26T09:13:00Z_100115_115_95',	NULL,	NULL,	NULL,	'2019-05-27 10:27:48.887+00',	NULL,	4),
(now(),	256,	245,	NULL,	'U78Z73',	36.5,	NULL,	50.12662,	14.47038,	'12:24:13',	'2019-05-27 10:24:13+00',	2,	'2019-05-26T09:13:00Z_100115_115_95',	NULL,	NULL,	NULL,	'2019-05-27 10:24:36.519+00',	NULL,	5),
(now(),	478,	NULL,	497,	'U188Z1P',	23.3,	NULL,	50.11107,	14.591,	'12:27:25',	'2019-05-27 10:27:25+00',	2,	'2019-05-26T09:13:00Z_100115_115_95',	NULL,	NULL,	NULL,	'2019-05-27 10:27:46.891+00',	NULL,	6),
(now(),	298,	NULL,	300,	'U461Z1P',	29.9,	NULL,	50.03539,	14.59305,	'12:27:25',	'2019-05-27 10:27:25+00',	2,	'2019-05-26T09:13:00Z_100115_115_95',	NULL,	NULL,	NULL,	'2019-05-27 10:27:46.707+00',	NULL,	7),
(now(),	267,	NULL,	271,	'U4413Z2',	31.6,	NULL,	50.17277,	14.1221,	'12:27:31',	'2019-05-27 10:27:31+00',	2,	'2019-05-26T09:13:00Z_100115_115_95',	NULL,	NULL,	NULL,	'2019-05-27 10:27:48.895+00',	NULL,	8),
(now(),	385,	NULL,	390,	'U336Z2',	29.4,	NULL,	50.02967,	14.60214,	'12:27:30',	'2019-05-27 10:27:30+00',	2,	'2019-05-26T09:13:00Z_100115_115_95',	NULL,	NULL,	NULL,	'2019-05-27 10:27:48.32+00',	NULL,	9),
(now(),	163,	NULL,	163,	'U55Z2P',	18.9,	NULL,	50.13257,	14.47052,	'12:27:43',	'2019-05-27 10:27:43+00',	2,	'2019-05-26T09:13:00Z_100115_115_95',	NULL,	NULL,	NULL,	'2019-05-27 10:27:46.599+00',	NULL,	10),
(now(),	344,	NULL,	310,	'U4507Z2',	26.1,	NULL,	49.85952,	14.50574,	'12:27:29',	'2019-05-27 10:27:29+00',	2,	'2019-05-26T09:13:00Z_100115_115_95',	NULL,	NULL,	NULL,	'2019-05-27 10:27:47.529+00',	NULL,	11),
(now(),	566,	NULL,	576,	'U1796Z1',	30.5,	NULL,	50.35788,	14.47421,	'12:27:36',	'2019-05-27 10:27:36+00',	2,	'2019-05-26T09:13:00Z_100115_115_95',	NULL,	NULL,	NULL,	'2019-05-27 10:27:48.028+00',	NULL,	12),
(now(),	752,	745,	NULL,	'U2019Z1',	25.3,	NULL,	49.96941,	14.80906,	'12:27:25',	'2019-05-27 10:27:25+00',	2,	'2019-05-26T09:13:00Z_100115_115_95',	NULL,	NULL,	NULL,	'2019-05-27 10:27:48.408+00',	NULL,	13),
(now(),	236,	NULL,	225,	'U2349Z1',	31.2,	NULL,	50.16256,	14.75678,	'12:27:23',	'2019-05-27 10:27:23+00',	2,	'2019-05-26T09:13:00Z_100115_115_95',	NULL,	NULL,	NULL,	'2019-05-27 10:27:49.404+00',	NULL,	14),
(now(),	31,	NULL,	60,	'U337Z4',	36.3,	NULL,	50.02615,	14.39524,	'12:27:26',	'2019-05-27 10:27:26+00',	2,	'2019-05-26T09:13:00Z_100115_115_95',	NULL,	NULL,	NULL,	'2019-05-27 10:27:47.345+00',	NULL,	15),
(now(),	273,	252,	NULL,	'U1942Z13',	22.7,	NULL,	50.18338,	14.65627,	'12:23:27',	'2019-05-27 10:23:27+00',	2,	'2019-05-26T09:13:00Z_100115_115_95',	NULL,	NULL,	NULL,	'2019-05-27 10:23:46.116+00',	NULL,	16),
(now(),	121,	NULL,	110,	'U1952Z1',	31.6,	NULL,	49.83629,	14.33417,	'12:27:30',	'2019-05-27 10:27:30+00',	2,	'2019-05-26T09:13:00Z_100115_115_95',	NULL,	NULL,	NULL,	'2019-05-27 10:27:47.305+00',	NULL,	17),
(now(),	148,	NULL,	163,	'U9871Z1',	28.7,	NULL,	50.35566,	14.3611,	'12:25:33',	'2019-05-27 10:25:33+00',	2,	'2019-05-26T09:13:00Z_100115_115_95',	NULL,	NULL,	NULL,	'2019-05-27 10:25:46.859+00',	NULL,	18),
(now(),	401,	NULL,	423,	'U9162Z1',	26.9,	NULL,	50.33257,	14.52904,	'12:27:29',	'2019-05-27 10:27:29+00',	2,	'2019-05-26T09:13:00Z_100115_115_95',	NULL,	NULL,	NULL,	'2019-05-27 10:27:49.338+00',	NULL,	19);