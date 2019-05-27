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


INSERT INTO "ropidgtfs_shapes" ("shape_dist_traveled", "shape_id", "shape_pt_lat", "shape_pt_lon", "shape_pt_sequence", "create_batch_id", "created_at", "created_by", "update_batch_id", "updated_at", "updated_by") VALUES
(0,	'L991V1',	50.06841,	14.50717,	1,	NULL,	'2019-05-27 03:21:35.159+00',	NULL,	NULL,	'2019-05-27 03:21:35.159+00',	NULL),
(0.01713,	'L991V1',	50.06841,	14.50693,	2,	NULL,	'2019-05-27 03:21:35.159+00',	NULL,	NULL,	'2019-05-27 03:21:35.159+00',	NULL),
(0.13226,	'L991V1',	50.06847,	14.50533,	3,	NULL,	'2019-05-27 03:21:35.159+00',	NULL,	NULL,	'2019-05-27 03:21:35.159+00',	NULL),
(0.23339,	'L991V1',	50.06857,	14.50392,	4,	NULL,	'2019-05-27 03:21:35.159+00',	NULL,	NULL,	'2019-05-27 03:21:35.159+00',	NULL),
(0.34914,	'L991V1',	50.06876,	14.50233,	5,	NULL,	'2019-05-27 03:21:35.159+00',	NULL,	NULL,	'2019-05-27 03:21:35.159+00',	NULL),
(0.53804,	'L991V1',	50.06913,	14.49976,	6,	NULL,	'2019-05-27 03:21:35.159+00',	NULL,	NULL,	'2019-05-27 03:21:35.159+00',	NULL),
(0.59752,	'L991V1',	50.06931,	14.49897,	7,	NULL,	'2019-05-27 03:21:35.159+00',	NULL,	NULL,	'2019-05-27 03:21:35.159+00',	NULL),
(0.65156,	'L991V1',	50.06956,	14.49833,	8,	NULL,	'2019-05-27 03:21:35.159+00',	NULL,	NULL,	'2019-05-27 03:21:35.159+00',	NULL),
(0.7329,	'L991V1',	50.06999,	14.4974,	9,	NULL,	'2019-05-27 03:21:35.159+00',	NULL,	NULL,	'2019-05-27 03:21:35.159+00',	NULL),
(0.85384,	'L991V1',	50.07066,	14.49608,	10,	NULL,	'2019-05-27 03:21:35.159+00',	NULL,	NULL,	'2019-05-27 03:21:35.159+00',	NULL);

INSERT INTO "ropidgtfs_calendar" ("end_date", "friday", "monday", "saturday", "service_id", "start_date", "sunday", "thursday", "tuesday", "wednesday", "create_batch_id", "created_at", "created_by", "update_batch_id", "updated_at", "updated_by") VALUES
('20190609',	1,	1,	'0',	'1111100-1',	'20190527',	'0',	1,	1,	1,	NULL,	'2019-05-27 03:20:15.632+00',	NULL,	NULL,	'2019-05-27 03:20:15.632+00',	NULL);

INSERT INTO "ropidgtfs_routes" ("agency_id", "is_night", "route_color", "route_desc", "route_id", "route_long_name", "route_short_name", "route_text_color", "route_type", "route_url", "create_batch_id", "created_at", "created_by", "update_batch_id", "updated_at", "updated_by") VALUES
('99',	'0',	'00A562',	NULL,	'L991',	'Nemocnice Motol - Petřiny - Skalka - Depo Hostivař',	'A',	'FFFFFF',	'1',	'https://pid.cz/linka/A',	NULL,	'2019-05-27 03:20:15.738+00',	NULL,	NULL,	'2019-05-27 03:20:15.738+00',	NULL);

INSERT INTO "ropidgtfs_agency" ("agency_fare_url", "agency_id", "agency_lang", "agency_name", "agency_phone", "agency_timezone", "agency_url", "create_batch_id", "created_at", "created_by", "update_batch_id", "updated_at", "updated_by", "agency_email") VALUES
(NULL,	'99',	'cs',	'Pražská integrovaná doprava',	'+420234704560',	'Europe/Prague',	'https://pid.cz',	NULL,	'2019-05-27 03:20:15.469+00',	NULL,	NULL,	'2019-05-27 03:20:15.469+00',	NULL,	NULL);
