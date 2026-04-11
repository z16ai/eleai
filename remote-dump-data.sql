SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict zTDbT8kfpSm5vxa0WX0XEzBjjebWzc5fVHREFqTflgXJ19uXxhLSCVThdG95f9j

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: custom_oauth_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."flow_state" ("id", "user_id", "auth_code", "code_challenge_method", "code_challenge", "provider_type", "provider_access_token", "provider_refresh_token", "created_at", "updated_at", "authentication_method", "auth_code_issued_at", "invite_token", "referrer", "oauth_client_state_id", "linking_target_id", "email_optional") VALUES
	('2566e199-28b5-46aa-9403-04e3515a6401', NULL, 'cc8311b5-3e2a-4e59-ba8c-5645047cbd97', 's256', 'YYu6BCy8XQlwOE8LzvfUWRD-r0RQ3gEMeyhLmoV9YuI', 'google', '', '', '2026-04-08 03:50:33.046908+00', '2026-04-08 03:50:33.046908+00', 'oauth', NULL, NULL, 'http://localhost:3000/auth/callback', NULL, NULL, false),
	('f95727f7-670f-46fc-816d-1f0e61ab5f07', NULL, '19427e86-b341-485e-a50d-7b0cdb9e038b', 's256', 'AOI_xLo3ixNgxt40LhyQ_t0CfMHWoX0naM2F8Gjoyvg', 'google', '', '', '2026-04-08 03:54:54.741877+00', '2026-04-08 03:54:54.741877+00', 'oauth', NULL, NULL, 'http://localhost:3000/auth/callback', NULL, NULL, false),
	('a7c7bc17-e50d-4fd5-98dc-3531f6454018', '33538287-6906-41c9-852a-9491f20e6c57', '7fce1b45-bb71-4d78-9d88-28c982d85301', 's256', 'hTqJ-AJuTVugW9Znahb2JaHC-s3UbRaJd7eeKxDJfXI', 'google', 'ya29.a0Aa7MYipTp28KAKGxhELAxPIXoIxinsSxpUKEzJoc-7b-dkWfLsqWaB4U3EYJ3ar_j8Qotp8PI8lTbiSuzBvmSPcUFhYDU1vCudeQOKktwZAzBfNvEkq9b5t0yq4ApskFCH5YBjDDCDKuCpT788r7Km2HPJDL75Qi6MM2A0_F-pqKALkge5eDg3K4yZCGMdM1j-q6QKHRhZvQsRsuJA1Xo48Kxpva5N86XBeFbei9569nTyawuWWq28M5T2WUvsvc9URYu5NMUtiQdwA-wZdMTooX5yQaCgYKASoSARESFQHGX2Mi_LGgbA0dY2HtKbMLgBUA0g0290', '', '2026-04-09 03:25:44.666534+00', '2026-04-09 03:25:45.283866+00', 'oauth', '2026-04-09 03:25:45.283809+00', NULL, 'http://localhost:3000/auth/callback', NULL, NULL, false),
	('664ca412-f9a2-407b-8e3c-c805609be397', NULL, 'f761d47e-d38c-41e6-9f53-c60f21d9d2f3', 's256', '8Qc_KKjh2jynyx3fh_UV6xFej0sjnMdqfyu45WNpC6E', 'google', '', '', '2026-04-08 03:58:42.578158+00', '2026-04-08 03:58:42.578158+00', 'oauth', NULL, NULL, 'http://localhost:3000/auth/callback', NULL, NULL, false),
	('fc80ae5a-6a05-4f5d-99cb-3b4f25f48812', NULL, 'd6007b03-519b-4b59-adcf-f3c19ba25fbd', 's256', 'RcZkHeVs4E00GOzzC3MC1we8HDDSZa6WbNszGUgan-E', 'google', '', '', '2026-04-08 03:59:04.668864+00', '2026-04-08 03:59:04.668864+00', 'oauth', NULL, NULL, 'http://localhost:3000/auth/callback', NULL, NULL, false),
	('5ecdddea-7c4b-419c-8392-28bdceb10f7c', '33538287-6906-41c9-852a-9491f20e6c57', 'a6b7b9e8-f4fe-4b3f-8d95-a3b9f2a647b9', 's256', 'K7uXGZnyInKDZBiz7BLC99mQJYYX8Rg0SCd4Az5yaFw', 'google', 'ya29.a0Aa7MYiqw7cZ6tkcsyzyrao0JzTQhgexlxdiA8e8jeLS6Zr_Rwni7Ad8XyiOz0CvJJ1g5dXvVhmMWh_b8MRvgyIKE69hSAODBFdcsTkVeaDoVfMuzjqeF5hqH45lVBZr7DClOtVF3SBxdWb9RquaOLsm71KRlRzD3QLWgP7M_H_fZQFu4JGRJhxV5fWeqGXrfVKenvEeu4hsa7udEUnhfe5h7Bfdhy0Yg2UFOAs0H-RzUtFVmi3dNRqyyM0GMN_E7OmoMtUc6_yN6F72ROHtlrjG_NdEaCgYKASMSARESFQHGX2MiAy8MYAHgUQYfwwMZKUpcrA0290', '', '2026-04-09 02:58:49.225354+00', '2026-04-09 02:58:50.021297+00', 'oauth', '2026-04-09 02:58:50.021228+00', NULL, 'http://localhost:3000/auth/callback', NULL, NULL, false),
	('dbb98014-b71b-499d-b97b-c11dea0bcb36', '33538287-6906-41c9-852a-9491f20e6c57', 'c0d23654-99c0-4a92-abe6-8b09a518bc9c', 's256', '2y5S3l7XomLYE-XXfjqeynxlrxNMe5PikuuVQN_pias', 'google', 'ya29.a0Aa7MYipOApI0lLqQA2sLJphBFOKuSTs6iuLlZY_vgeHigV77fsfB2BLALGcyW5VUFBs4_hJPDZxQlHFU9VNh3R0nys0cBPdv3hax2l40hEiSrDuY79UtfTmj6R5Du-iDbEta1ad_GWy2p62X107wMhc2fAlv_DnI2XzUzCCpHuDbyE_BUzHo-nkaJpWTnD87qj-NtOTMsUkbYS3n8khWz41D1IZL0yHAX3pUCc50j0eZ_AHAeni_HA2IzcwcuohNAqlN8bPDGd8kk8_a2VK9XX1_8OEaCgYKAQ4SARESFQHGX2Mi1dAcvgfr4vAoQGCYP4g52w0290', '', '2026-04-09 03:15:56.850278+00', '2026-04-09 03:15:58.130164+00', 'oauth', '2026-04-09 03:15:58.130107+00', NULL, 'http://localhost:3000/auth/callback', NULL, NULL, false),
	('66897f12-3ec0-44af-bc74-380e71cb3232', '33538287-6906-41c9-852a-9491f20e6c57', '770c6851-81f3-4ac9-ac17-e3243bd61d14', 's256', 'fGmhZCcSvt_cqvB980G2F9gqyUkOirbey8zXMRiO7FU', 'google', 'ya29.a0Aa7MYio37WSxpYh-iZOYJ_3A_zAUw49yylnSK8rVsdwbM2UpvSMTC1kXke_2huKltV9l8Id_wKh_rskU22U8UaYPs2cAdHV805E5ngC9pADIXUnkLfwewNtJQ43tZydT9AXgbrxlrGr7S9wy0ocpNZWCIdjNaN8Cencw87cwFz8n2watUtbIFpOJzjrpSuM-vdmBhEq8l7NFM9apnUqxTPI8M1lHBurc-EpoTSbtqqu1uWP8w4CKXc0i-G0Oe8TWA5uoAaFkbsW8dttRujMaA5B-KLgaCgYKAZ8SARESFQHGX2Mi6LpVNac00SS9FFV8V9rLlg0290', '', '2026-04-09 03:24:18.880056+00', '2026-04-09 03:24:19.899692+00', 'oauth', '2026-04-09 03:24:19.899583+00', NULL, 'http://localhost:3000/auth/callback', NULL, NULL, false),
	('398c52e3-e9f5-46e1-aea5-65d0cd2ff1d8', '33538287-6906-41c9-852a-9491f20e6c57', '4f388734-3506-4386-9cc0-69b3b2017437', 's256', '7DrIdM-9K4rWoJQiC37ddl_7yF_5Etm4z4isIxk9cQc', 'google', 'ya29.a0Aa7MYiprZLoaioOtFFDnFj0koHt9SJmZHKrmaWzxzazOAcNI1yG64t0w6xVSncFwHjUHxv279DXsmtELhfjim9NQwJ3I1mOIMN_-TC7N7LCgPfQCWP2IGN2qxFW-7XEuE1cl6zgYu1KTcMXxxrlaQ1U_9BoEOhNfHQakuN9QLgVSqsAUw5nMoH3Qr4uwvoOBTT6uNy81fcqK-FTr26bhmeInLJRjqHG7_WSuLj-Yn2hIv8JgFWBSgb4g6SWZ8dE8Zg0x2XaA_EdSAnWnCNRfp_c4sQaCgYKAaYSARESFQHGX2MiFIfh8xxfMkCmIFWuFcCAQQ0289', '', '2026-04-09 03:35:40.587068+00', '2026-04-09 03:35:41.608665+00', 'oauth', '2026-04-09 03:35:41.608555+00', NULL, 'http://localhost:3000/auth/callback', NULL, NULL, false),
	('bb18bcdd-1755-402d-b520-5c8b7246d2d2', '33538287-6906-41c9-852a-9491f20e6c57', '62169969-57a1-4f7c-9387-c93c44ddb194', 's256', 'zkewGM8Ir3E2ZDSBifsiPf83Z-p1VvESYPK6k5ut73w', 'google', 'ya29.a0Aa7MYiqh62NsAbvrMCtUbPXSRHEQa_VAJMV--ez3F1C7och7tj2StJ5hoznky5jyZkDLjTcuEKtl381FsAezNeJTbLr7_BA2YEaGp11oWBuUi9h6FAjVZ4nu8iwnITfzPFT921e7mqq0EvGheb8clWZJ0DbJTM1X4Jj7LbDkKCZfRCf5OGcRmqjr1qP9Ot-4i_B1iwaaU6XP4Vjwg3TPYgT0obExE4i_4aViiiLnn8ug1dio44R4mOJU_BnmFyADhxT_5MeCMBmVjAGu6w1_NdNdxgAaCgYKAXMSARESFQHGX2Mi5GpA3OggaMP4XyxuJdP6hQ0290', '', '2026-04-09 03:41:11.577808+00', '2026-04-09 03:41:12.220979+00', 'oauth', '2026-04-09 03:41:12.220921+00', NULL, 'http://localhost:3000/auth/callback', NULL, NULL, false),
	('4cf82aa0-373a-49cb-b373-030bd78caa2e', '33538287-6906-41c9-852a-9491f20e6c57', '753ea13b-26c0-421b-85d5-67152e7df713', 's256', 'kqogdwzjcz-URZiTeNjG_Ef_VjQG9C9EvI6Je4Ux13U', 'google', 'ya29.a0Aa7MYiqAk15_IKRJ7VK_XEIUuxPde9U285h4-YgBfSlhuyryQND0uYvhVeGhNrBYtFwZ5HzCXQRyXGipQOmp8zqYiKnH0xUs-m080gyxrpKYhqQxonWm7DQUHxlpHyil_zvhqs1WaqR_CLt2CWzne92D2w8CBhyMmUsHNntf8rWz_bjG9CzmrigmcdYG5skisxS9jZrz-OxC8RPaw5769yETLEEaHq09Vbk0rPQbtgjcIHZ5zFgdDkqHEVx9pHTweXmYsZp2HTWPmKtViANpfFtkLWoaCgYKAc4SARESFQHGX2Mi1L9WmUtyb5uUpskyJ_x9gA0290', '', '2026-04-09 03:50:37.014107+00', '2026-04-09 03:50:37.799828+00', 'oauth', '2026-04-09 03:50:37.79977+00', NULL, 'http://localhost:3000/auth/callback', NULL, NULL, false),
	('bd6f7f59-b86e-46d9-a2d1-d3fdb15a54dc', '33538287-6906-41c9-852a-9491f20e6c57', '2dc53405-6bfc-404e-949a-51a1d26c926b', 's256', 'nNarz8xuiwbhUsgVH2u604xVQOaQqhgDPDI2Mw6eVh0', 'google', 'ya29.a0Aa7MYiopi9X5NUl5twx4gKIgKa6N7sO1usMj-UjbwFU2_WZ6LEDMYGwpmwz9VoOsCe5Ng5eylBxstD527n-A0GkHqlqiUsqbC_CmTi5WzZ3q8ozkqomSx3s-kH7JHG_H7rAJd-Awol0imkTXrgVNko1VuJ3jvl16b5coc5spGrzk7XEnYa6lY9yPFZWsCL-v-tUsBzzFmWwyq-bJPWhZKgx8fL_T7w1csTxUqv5GdjumhedmhIDHqWjhj50jJ9VSQ88CrUlanHPzklW3H7mHtytIyX4aCgYKAcwSARESFQHGX2Mi6MSaXsbUVwq4JJAN4UI9OQ0290', '', '2026-04-09 03:51:25.759509+00', '2026-04-09 03:51:26.734253+00', 'oauth', '2026-04-09 03:51:26.734196+00', NULL, 'http://localhost:3000/auth/callback', NULL, NULL, false);


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', '492b857a-a8e1-4a78-90f8-5cb1c4db70af', 'authenticated', 'authenticated', NULL, '', NULL, NULL, '', NULL, '', NULL, '', '', NULL, '2026-04-09 10:43:01.082297+00', '{"provider": "web3", "providers": ["web3"]}', '{"sub": "web3:solana:E8u3ccSViBwRXxyb4KrwoKet5fgsEUEJq8xPrzBezXfP", "custom_claims": {"chain": "solana", "domain": "localhost:3000", "address": "E8u3ccSViBwRXxyb4KrwoKet5fgsEUEJq8xPrzBezXfP", "network": "", "statement": "I accept the Terms of Service at https://eleai.studio/tos"}, "email_verified": false, "phone_verified": false}', NULL, '2026-04-08 05:10:24.773484+00', '2026-04-09 10:43:01.094923+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '33538287-6906-41c9-852a-9491f20e6c57', 'authenticated', 'authenticated', 'mydoto@gmail.com', NULL, '2026-04-08 04:05:07.426473+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-04-10 14:15:53.435533+00', '{"provider": "google", "providers": ["google"]}', '{"iss": "https://accounts.google.com", "sub": "112636071494127843510", "name": "BENXIN", "email": "mydoto@gmail.com", "picture": "https://lh3.googleusercontent.com/a/ACg8ocK4p7SMSJf9vL4HWm8iS8lmWD-SkhlF0WZTWrzWRePR_oeYsg=s96-c", "full_name": "BENXIN", "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocK4p7SMSJf9vL4HWm8iS8lmWD-SkhlF0WZTWrzWRePR_oeYsg=s96-c", "provider_id": "112636071494127843510", "email_verified": true, "phone_verified": false}', NULL, '2026-04-08 04:05:07.408928+00', '2026-04-11 02:11:35.713106+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '2f49a79e-f8a0-4331-960e-1ba17f768062', 'authenticated', 'authenticated', '378917043@qq.com', '$2a$10$R6WCdO9d5Buc34TR/y5AuOC3W2P1dKnq66Y9iM5VvxlPOElOhvsg6', '2026-04-08 03:55:50.39005+00', NULL, '', '2026-04-08 03:55:28.25206+00', '', NULL, '', '', NULL, '2026-04-10 12:17:24.452904+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "2f49a79e-f8a0-4331-960e-1ba17f768062", "email": "378917043@qq.com", "email_verified": true, "phone_verified": false}', NULL, '2026-04-08 03:55:28.231155+00', '2026-04-10 12:17:24.45636+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'f78ad088-1a5e-4c8e-891f-3bdee590cad4', 'authenticated', 'authenticated', NULL, '', NULL, NULL, '', NULL, '', NULL, '', '', NULL, '2026-04-10 13:57:41.959932+00', '{"provider": "web3", "providers": ["web3"]}', '{"sub": "web3:ethereum:0x49967d260775a29a85bdacd1ec7db870e27e80c8", "custom_claims": {"chain": "ethereum", "domain": "localhost:3000", "address": "0x49967d260775a29a85bdacd1ec7db870e27e80c8", "network": "1", "statement": "I accept the Terms of Service at https://eleai.studio/tos"}, "email_verified": false, "phone_verified": false}', NULL, '2026-04-08 08:16:49.756228+00', '2026-04-10 13:57:41.977165+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('2f49a79e-f8a0-4331-960e-1ba17f768062', '2f49a79e-f8a0-4331-960e-1ba17f768062', '{"sub": "2f49a79e-f8a0-4331-960e-1ba17f768062", "email": "378917043@qq.com", "email_verified": true, "phone_verified": false}', 'email', '2026-04-08 03:55:28.245926+00', '2026-04-08 03:55:28.24598+00', '2026-04-08 03:55:28.24598+00', '4be4f1a1-ee24-4b28-b143-4bd00763a16f'),
	('web3:ethereum:0x49967d260775a29a85bdacd1ec7db870e27e80c8', 'f78ad088-1a5e-4c8e-891f-3bdee590cad4', '{"sub": "web3:ethereum:0x49967d260775a29a85bdacd1ec7db870e27e80c8", "custom_claims": {"chain": "ethereum", "domain": "localhost:3000", "address": "0x49967d260775a29a85bdacd1ec7db870e27e80c8", "network": "1", "statement": "I accept the Terms of Service at https://eleai.studio/tos"}, "email_verified": false, "phone_verified": false}', 'web3', '2026-04-08 08:16:49.782312+00', '2026-04-08 08:16:49.782365+00', '2026-04-10 13:57:41.95373+00', '9db1401c-315e-4874-bb0f-87dd8894c8df'),
	('112636071494127843510', '33538287-6906-41c9-852a-9491f20e6c57', '{"iss": "https://accounts.google.com", "sub": "112636071494127843510", "name": "BENXIN", "email": "mydoto@gmail.com", "picture": "https://lh3.googleusercontent.com/a/ACg8ocK4p7SMSJf9vL4HWm8iS8lmWD-SkhlF0WZTWrzWRePR_oeYsg=s96-c", "full_name": "BENXIN", "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocK4p7SMSJf9vL4HWm8iS8lmWD-SkhlF0WZTWrzWRePR_oeYsg=s96-c", "provider_id": "112636071494127843510", "email_verified": true, "phone_verified": false}', 'google', '2026-04-08 04:05:07.419333+00', '2026-04-08 04:05:07.4194+00', '2026-04-10 14:15:51.913648+00', 'aa6bc8bf-65f8-4763-b36b-aeeb0eeca9e6'),
	('web3:solana:E8u3ccSViBwRXxyb4KrwoKet5fgsEUEJq8xPrzBezXfP', '492b857a-a8e1-4a78-90f8-5cb1c4db70af', '{"sub": "web3:solana:E8u3ccSViBwRXxyb4KrwoKet5fgsEUEJq8xPrzBezXfP", "custom_claims": {"chain": "solana", "domain": "localhost:3000", "address": "E8u3ccSViBwRXxyb4KrwoKet5fgsEUEJq8xPrzBezXfP", "network": "", "statement": "I accept the Terms of Service at https://eleai.studio/tos"}, "email_verified": false, "phone_verified": false}', 'web3', '2026-04-08 05:10:24.779526+00', '2026-04-08 05:10:24.779584+00', '2026-04-09 10:43:01.076245+00', 'dbecf2a8-d97e-448f-9c8a-ca0c13f383cd');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag", "oauth_client_id", "refresh_token_hmac_key", "refresh_token_counter", "scopes") VALUES
	('208930aa-cbe2-4d7e-923d-cef42d353020', '33538287-6906-41c9-852a-9491f20e6c57', '2026-04-10 14:15:53.436637+00', '2026-04-11 02:11:35.723992+00', NULL, 'aal1', NULL, '2026-04-11 02:11:35.723885', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '38.150.8.228', NULL, NULL, NULL, NULL, NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('208930aa-cbe2-4d7e-923d-cef42d353020', '2026-04-10 14:15:53.442486+00', '2026-04-10 14:15:53.442486+00', 'oauth', 'ca6892f1-4e04-475d-986f-148c4c69ee7f');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 91, 'b7o66zb3aong', '33538287-6906-41c9-852a-9491f20e6c57', true, '2026-04-10 14:15:53.439334+00', '2026-04-10 15:14:28.565598+00', NULL, '208930aa-cbe2-4d7e-923d-cef42d353020'),
	('00000000-0000-0000-0000-000000000000', 92, '2mfvevfsq7cn', '33538287-6906-41c9-852a-9491f20e6c57', true, '2026-04-10 15:14:28.574143+00', '2026-04-11 00:50:50.285809+00', 'b7o66zb3aong', '208930aa-cbe2-4d7e-923d-cef42d353020'),
	('00000000-0000-0000-0000-000000000000', 93, 'wzfgultqn2mh', '33538287-6906-41c9-852a-9491f20e6c57', true, '2026-04-11 00:50:50.30335+00', '2026-04-11 02:11:35.683693+00', '2mfvevfsq7cn', '208930aa-cbe2-4d7e-923d-cef42d353020'),
	('00000000-0000-0000-0000-000000000000', 94, '4znnyvzpaolp', '33538287-6906-41c9-852a-9491f20e6c57', false, '2026-04-11 02:11:35.703023+00', '2026-04-11 02:11:35.703023+00', 'wzfgultqn2mh', '208930aa-cbe2-4d7e-923d-cef42d353020');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: webauthn_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: webauthn_credentials; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: image_generations; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."image_generations" ("id", "user_id", "prompt", "model_id", "aspect_ratio", "quality", "image_url", "created_at", "public") VALUES
	('63ed018b-2eee-46a6-aef1-52e8dd68a547', '33538287-6906-41c9-852a-9491f20e6c57', 'A fierce cybernetic gorilla character made of glowing 3D voxels. Neon blue glowing eyes, mechanical arm parts, dense futuristic jungle background with neon vines. Tech-noir lighting, bold blocky aesthetic, high-detail voxel art, Unreal Engine 5 style, jungle-punk vibe.', 'Doubao Seedream 5.0', '3:4', '4K', 'https://pub-8742eaa8e7ce488ba306c3dc5bacddd1.r2.dev/aigenerate/1775815079879-1775815079879-0.png', '2026-04-10 09:58:00.722+00', true),
	('1fd5a959-7f71-4ddc-84dd-b1a24fc9b32a', '33538287-6906-41c9-852a-9491f20e6c57', 'An epic cinematic shot of a Shiba Inu dog wearing a high-tech astronaut suit, standing on the lunar surface. Reflection of the Earth in the helmet visor, holding a gold Bitcoin flag. Hyper-realistic fur textures, cosmic starry background, dramatic lighting, 8k resolution, heroic atmosphere.', 'Doubao Seedream 5.0', '3:4', '4K', 'https://pub-8742eaa8e7ce488ba306c3dc5bacddd1.r2.dev/aigenerate/1775814734440-1775814734440-0.png', '2026-04-10 09:52:15.188+00', true),
	('304c5175-eb06-43c2-86c6-5d2595f06aa4', '33538287-6906-41c9-852a-9491f20e6c57', 'A breathtaking generative abstract art piece, fluid interlocking curves and organic flowing blocks of color (teal, mustard yellow, coral). Intricate algorithmic patterns, clean white negative space, high-end digital museum style, textural depth, inspired by modern code-based art.', 'Doubao Seedream 4.5', '3:2', '4K', 'https://pub-8742eaa8e7ce488ba306c3dc5bacddd1.r2.dev/aigenerate/1775814382539-1775814382539-0.png', '2026-04-10 09:46:26.606+00', true),
	('5a4111ed-3bea-4e3b-a258-21272947ed69', '33538287-6906-41c9-852a-9491f20e6c57', 'A hyper-detailed gold coin, the front featuring a regal Shiba Inu (Doge style) wearing a tiny, sparkling royal crown. He has a majestic, confident expression. The reverse is an elaborate engraving of a rocket ship aiming at a massive crescent moon. Set on a dark velvet background with scattered diamonds. Photorealistic macro photography, dramatic chiaroscuro lighting, 8k.', 'Doubao Seedream 4.5', '16:9', '4K', 'https://pub-8742eaa8e7ce488ba306c3dc5bacddd1.r2.dev/aigenerate/1775812659341-1775812659341-0.png', '2026-04-10 09:17:46.241+00', true),
	('3625160b-5d31-42f4-9ac6-44b22778c20b', '33538287-6906-41c9-852a-9491f20e6c57', 'A macro photo of a single ''Rare Pepe'' trading card, made of holographic foil. The card art is a majestic, digital painting of Pepe as an astronaut planting a ''HODL'' flag on Mars. Below the image are detailed stats: ''RARITY: EXTREME'', ''MINT: 1/1''. The card has a gold border. Realistic texture, high fidelity, focus on the shimmering foil.', 'Doubao Seedream 4.5', '4:3', '4K', 'https://pub-8742eaa8e7ce488ba306c3dc5bacddd1.r2.dev/aigenerate/1775812007935-1775812007935-0.png', '2026-04-10 09:07:01.063+00', true),
	('fc806119-5a3b-4222-a3cd-49b16adca11b', '33538287-6906-41c9-852a-9491f20e6c57', 'An epic oil painting in the style of a classical European master, depicting ''Chad'' (the Meme figure, perfect jawline, muscular) standing on a mountain peak, looking down over a vast, foggy valley. He is wearing a simple toga and holding a gold Bitcoin scepter. Dramatic light and shadow, powerful composition, museum-quality brushwork.', 'Doubao Seedream 4.5', '9:16', '4K', 'https://pub-8742eaa8e7ce488ba306c3dc5bacddd1.r2.dev/aigenerate/1775811873082-1775811873082-0.png', '2026-04-10 09:04:33.912+00', true),
	('49ad178d-7094-49d6-a238-b718cbebeecf', '33538287-6906-41c9-852a-9491f20e6c57', 'Warm vintage coffee-themed backgrounds with rich textures and antique paper details. Perfect for junk journals, ephemera papers, scrapbooking, and cozy creative projects.', 'Doubao Seedream 4.5', '16:9', '4K', 'https://pub-8742eaa8e7ce488ba306c3dc5bacddd1.r2.dev/aigenerate/1775809269198-1775809269198-0.png', '2026-04-10 08:21:13.835+00', true),
	('7336cee1-7c35-486f-8257-ea7337bfe114', '33538287-6906-41c9-852a-9491f20e6c57', 'A fierce cybernetic gorilla character made of glowing 3D voxels. Neon blue glowing eyes, mechanical arm parts, dense futuristic jungle background with neon vines. Tech-noir lighting, bold blocky aesthetic, high-detail voxel art, Unreal Engine 5 style, jungle-punk vibe.', 'Flux 2 Klein 4B', '1:1', '4K', 'https://pub-8742eaa8e7ce488ba306c3dc5bacddd1.r2.dev/aigenerate/1775815180298-1775815180297-0.png', '2026-04-10 09:59:41.34+00', true),
	('6cc6ebd4-b7d8-4777-ba3f-41fb9a4bb2bc', '33538287-6906-41c9-852a-9491f20e6c57', 'A minimalist blue cat character with a simple, friendly face, wearing a space helmet. Bold thick outlines, flat vector illustration, bright solid colors (cyan, white, yellow). Cheerful web3 mascot style, clean and iconic design, collectible sticker aesthetic.', 'Doubao Seedream 5.0', '3:4', '4K', 'https://pub-8742eaa8e7ce488ba306c3dc5bacddd1.r2.dev/aigenerate/1775814849239-1775814849239-0.png', '2026-04-10 09:54:12.584+00', true),
	('3d159a58-881f-4051-9b43-207844975382', '33538287-6906-41c9-852a-9491f20e6c57', 'A rebellious anime character with a cool expression, wearing high-end techwear streetwear and a designer red headband. Messy black hair, floating cherry blossom petals around. Sharp cel-shading, vibrant crimson and black palette, clean ink linework, modern Japanese anime NFT style, high-end fashion aesthetic, side profile portrait.', 'Doubao Seedream 4.5', '21:9', '4K', 'https://pub-8742eaa8e7ce488ba306c3dc5bacddd1.r2.dev/aigenerate/1775812805171-1775812805171-0.png', '2026-04-10 09:20:07.441+00', true),
	('cd4c43a9-956e-42b9-8962-27574308d94b', '33538287-6906-41c9-852a-9491f20e6c57', 'A portrait of a futuristic ''Clone X'' avatar (3D model, cyberpunk aesthetic), featuring clear tech-wear armor with internal glowing blue circuits. Their hair is platinum blonde. They are wearing a unique, glowing collar with ''RTFKT'' and ''NIKE'' symbols. Dark, reflective metallic background, Unreal Engine 5 render, cinematic lighting.', 'Doubao Seedream 4.5', '2:3', '4K', 'https://pub-8742eaa8e7ce488ba306c3dc5bacddd1.r2.dev/aigenerate/1775812204419-1775812204419-0.png', '2026-04-10 09:10:25.813+00', true),
	('a057086c-928e-40c5-84c5-ea73a46d6c6d', '33538287-6906-41c9-852a-9491f20e6c57', 'A whimsical, hand-drawn vector illustration of a Doodle character. It has simple features, rainbow hair, and wears a cloud-shaped backpack. It is happily jumping on a fluffy cloud made of cotton candy, leaving a trail of colorful confetti. Bright and cheerful pastel colors (pink, blue, yellow), clean lines, flat illustration style, aesthetic and joyful.', 'Doubao Seedream 4.5', '2:3', '4K', 'https://pub-8742eaa8e7ce488ba306c3dc5bacddd1.r2.dev/aigenerate/1775811453884-1775811453883-0.png', '2026-04-10 08:57:35.865+00', true),
	('81cfed2d-dcee-4411-91c4-9b23d12e6b0e', '33538287-6906-41c9-852a-9491f20e6c57', 'A whimsical, hand-drawn vector illustration of a Doodle character. It has simple features, rainbow hair, and wears a cloud-shaped backpack. It is happily jumping on a fluffy cloud made of cotton candy, leaving a trail of colorful confetti. Bright and cheerful pastel colors (pink, blue, yellow), clean lines, flat illustration style, aesthetic and joyful.', 'Flux 2 Klein 4B', '1:1', '4K', 'https://pub-8742eaa8e7ce488ba306c3dc5bacddd1.r2.dev/aigenerate/1775811366594-1775811366594-0.png', '2026-04-10 08:56:07.96+00', true),
	('a5c55d6f-95e8-4804-9d14-5630821135ca', '33538287-6906-41c9-852a-9491f20e6c57', 'A powerful artistic prompt where the final image is fully controlled by a single variable. Instructions include diverse variable ideas to generate unique, non-repetitive visuals every time.', 'Doubao Seedream 4.5', '2:3', '4K', 'https://pub-8742eaa8e7ce488ba306c3dc5bacddd1.r2.dev/aigenerate/1775808861682-1775808861682-0.png', '2026-04-10 08:14:23.017+00', true),
	('3e35258a-41bb-49e3-944c-23f76385429d', '33538287-6906-41c9-852a-9491f20e6c57', 'Summer Design for ephemera collage clipart with a soft mixed-media style and playful layered elements. Perfect for scrapbooking, junk journals, and creative summer-themed design projects.', 'Doubao Seedream 4.5', '9:16', '4K', 'https://pub-8742eaa8e7ce488ba306c3dc5bacddd1.r2.dev/aigenerate/1775808466405-1775808466405-0.png', '2026-04-10 08:07:47.538+00', true),
	('d3c7ece5-fdeb-4246-aee2-075094e93a10', '33538287-6906-41c9-852a-9491f20e6c57', 'Warm vintage coffee-themed backgrounds with rich textures and antique paper details. Perfect for junk journals, ephemera papers, scrapbooking, and cozy creative projects.', 'Flux 2 Flex', '9:16', '4K', 'https://pub-8742eaa8e7ce488ba306c3dc5bacddd1.r2.dev/aigenerate/1775808008418-1775808008418-0.png', '2026-04-10 08:00:09.333+00', true),
	('aaf31128-8b7a-4ed5-923a-af40193541d2', '33538287-6906-41c9-852a-9491f20e6c57', 'Warm vintage coffee-themed backgrounds with rich textures and antique paper details. Perfect for junk journals, ephemera papers, scrapbooking, and cozy creative projects.', 'Flux 2 Flex', '2:3', '4K', 'https://pub-8742eaa8e7ce488ba306c3dc5bacddd1.r2.dev/aigenerate/1775807451268-1775807451267-0.png', '2026-04-10 07:50:54.394+00', true),
	('2c3e87a0-35b9-4bd5-9aed-fb825966a24c', '33538287-6906-41c9-852a-9491f20e6c57', 'An adorable round chubby penguin wearing a shiny golden puffer jacket and a tiny ice crown. 3D stylized character design, soft fluffy texture, cinematic studio lighting, pastel blue snowy background. Pixar-style animation, high-detail render, Octane render, cute and cheerful vibe.', 'Doubao Seedream 4.5', '3:4', '4K', 'https://pub-8742eaa8e7ce488ba306c3dc5bacddd1.r2.dev/aigenerate/1775812843136-1775812843136-0.png', '2026-04-10 09:20:43.932+00', true),
	('32248e29-54b1-4246-b093-5cca18f24426', '33538287-6906-41c9-852a-9491f20e6c57', 'A close-up portrait of a whimsical, pixel-art figure (3D voxel style). The character is a yellow cube with simple eyes, wearing prominent, red and black square ''Noggles'' (Nouns glasses). They are holding a pixelated balloon that says ''GOVERNANCE''. Soft pastel background with blurred pixel clouds. Low-poly art style, high contrast.', 'Doubao Seedream 4.5', '2:3', '4K', 'https://pub-8742eaa8e7ce488ba306c3dc5bacddd1.r2.dev/aigenerate/1775812560124-1775812560124-0.png', '2026-04-10 09:16:00.981+00', true),
	('c1dde319-87ee-4cce-96a9-07174d75c5c5', '33538287-6906-41c9-852a-9491f20e6c57', 'A dark, moody portrait of a Mutant Ape, featuring green slime dripping from its fur and glowing orange, venomous eyes. It is wearing a tactical jacket with multiple patches. The background is an abandoned, graffiti-covered industrial lab with flickering neon lights. Cinematic lighting, photorealistic textures, grit, decay, 8k.', 'Doubao Seedream 4.5', '1:1', '4K', 'https://pub-8742eaa8e7ce488ba306c3dc5bacddd1.r2.dev/aigenerate/1775811674783-1775811674783-0.png', '2026-04-10 09:01:18.649+00', true),
	('a6251d9c-bb25-4171-8502-5ab1775ba6fa', '33538287-6906-41c9-852a-9491f20e6c57', 'pepe the frog as a crypto trader, wearing luxury suit and diamond chain, confident grin, sitting on golden throne made of coins, cartoon illustration, vibrant green skin, exaggerated meme facial expression, glossy digital art, internet meme aesthetic, bold clean outlines, colorful neon trading background, web3 mascot style, collectible nft avatar, centered portrait, ultra detailed, high contrast lighting', 'doubao-seedream-4-5', '1:1', '4K', 'https://pub-8742eaa8e7ce488ba306c3dc5bacddd1.r2.dev/images/1775732596389-1775732596389-0.png', '2026-04-09 11:03:17.612+00', true),
	('db470ca8-f2c0-4c55-b269-deefef71aebb', '33538287-6906-41c9-852a-9491f20e6c57', 'pepe the frog as a crypto trader, wearing luxury suit and diamond chain, confident grin, sitting on golden throne made of coins, cartoon illustration, vibrant green skin, exaggerated meme facial expression, glossy digital art, internet meme aesthetic, bold clean outlines, colorful neon trading background, web3 mascot style, collectible nft avatar, centered portrait, ultra detailed, high contrast lighting', 'doubao-seedream-4-5', '1:1', '4K', 'https://pub-8742eaa8e7ce488ba306c3dc5bacddd1.r2.dev/images/1775732572266-1775732572266-0.png', '2026-04-09 11:02:57.015+00', true),
	('2f1838da-0bf5-43c4-894e-ddd47a56434e', '33538287-6906-41c9-852a-9491f20e6c57', 'A hyper-detailed gold coin, the front featuring a regal Shiba Inu (Doge style) wearing a tiny, sparkling royal crown. He has a majestic, confident expression. The reverse is an elaborate engraving of a rocket ship aiming at a massive crescent moon. Set on a dark velvet background with scattered diamonds. Photorealistic macro photography, dramatic chiaroscuro lighting, 8k.', 'doubao-seedream-4-5', '3:4', '4K', 'https://pub-8742eaa8e7ce488ba306c3dc5bacddd1.r2.dev/images/1775716123567-1775716123566-0.png', '2026-04-09 06:28:44.526+00', true),
	('5e33e8a9-d2c5-4225-8da6-747bf116e60c', '33538287-6906-41c9-852a-9491f20e6c57', '一只憨态可掬的熊猫，正端坐在温馨的家里弹奏琵琶。它身着一件绣有竹子图案的绿色长袍，毛茸茸的双手熟练地拨弄着琴弦。熊猫脸上洋溢着陶醉的神情，眼睛微闭，仿佛沉浸在美妙的音乐之中。房间布置简洁，摆放着几盆翠绿的竹子，背景虚化干净，32K，高清画质', 'doubao-seedream-4-5', '3:4', '4K', '/aigenerate/1775546524126-0.png', '2026-04-07 07:22:04.399+00', true),
	('46c3e3ac-7a11-4b5f-af66-8d0517bc5d74', '33538287-6906-41c9-852a-9491f20e6c57', 'Recovered image', 'Doubao Seedream', '1:1', '4K', '/aigenerate/1775186097568-0.png', '2026-04-03 03:14:57.568+00', true),
	('a3c88e1c-19ca-45e4-a1fe-fa02deb45f39', '33538287-6906-41c9-852a-9491f20e6c57', 'A minimalist blue cat character with a simple, friendly face, wearing a space helmet. Bold thick outlines, flat vector illustration, bright solid colors (cyan, white, yellow). Cheerful web3 mascot style, clean and iconic design, collectible sticker aesthetic.', 'Doubao Seedream 4.5', '4:3', '4K', 'https://pub-8742eaa8e7ce488ba306c3dc5bacddd1.r2.dev/aigenerate/1775814397091-1775814397091-0.png', '2026-04-10 09:46:37.829+00', true),
	('757e80c1-0e3b-4382-8a50-88e6ceee206c', '33538287-6906-41c9-852a-9491f20e6c57', 'A wide-eyed girl avatar with a nostalgic 2000s internet aesthetic, wearing a vintage designer beret and oversized sunglasses. Lo-fi glitchy background, neo-tokyo street fashion, flat cel-shading with a slightly grainy film texture. Experimental digital art, soft washed-out colors, aesthetic "dreamcore" vibe.', 'Doubao Seedream 4.5', '4:3', '4K', 'https://pub-8742eaa8e7ce488ba306c3dc5bacddd1.r2.dev/aigenerate/1775812864298-1775812864298-0.png', '2026-04-10 09:21:04.826+00', true),
	('331f6b8b-e1ed-42dd-aa07-648d1fdd73b6', '33538287-6906-41c9-852a-9491f20e6c57', 'A high-quality 3D render of a bored humanoid ape sitting in a dimly lit, luxurious underground clubhouse lounge. The ape has golden fur, wearing a vintage Hawaiian shirt and 3D glasses. He is holding a glass of glowing neon juice. Cinematic lighting, hyper-detailed textures, vibrant pop-art colors, 8k resolution, Unreal Engine 5 style.', 'doubao-seedream-5-0', '1:1', '4K', 'https://pub-8742eaa8e7ce488ba306c3dc5bacddd1.r2.dev/images/1775697781978-1775697781977-0.png', '2026-04-09 01:23:02.74+00', true),
	('3acc11da-df57-4139-95f5-6124107c9457', '33538287-6906-41c9-852a-9491f20e6c57', 'A sprawling, neon-drenched futuristic megacity built within a massive canyon, inspired by Blade Runner. Flying vehicles (spinners) leave light trails as they navigate between towering skyscrapers draped in colossal holographic advertisements. A massive, bio-engineered artificial sun hangs above. Cinematic concept art, digital painting, epic scale.', 'doubao-seedream-5-0', '3:2', '4K', 'https://pub-8742eaa8e7ce488ba306c3dc5bacddd1.r2.dev/images/1775694776675-1775694776675-0.png', '2026-04-09 00:32:57.378+00', true),
	('53fdad0c-c172-455a-8572-4f0fc5a7565c', '33538287-6906-41c9-852a-9491f20e6c57', '拟人化的（小橘猫），头戴破烂的安全帽，身上被雨淋的湿辘辘的，毛发打结在一起，穿着脏兮兮的破衣服，在建筑队（推着装满石头的小推车）沉甸甸的，（下大雨），泥泞路，悲情，苦楚，贫穷，劳累，大师作品，真实，摄影。', 'doubao-seedream-4-5', '3:4', '4K', '/aigenerate/1775544842263-0.png', '2026-04-07 06:54:02.305+00', true),
	('a075f063-79ec-4f69-bcb0-eee501584f63', '33538287-6906-41c9-852a-9491f20e6c57', '拟人化的（小橘猫），头戴破烂的安全帽，身上被雨淋的湿辘辘的，毛发打结在一起，穿着脏兮兮的破衣服，在建筑队（推着装满石头的小推车）沉甸甸的，（下大雨），泥泞路，悲情，苦楚，贫穷，劳累，大师作品，真实，摄影。', 'doubao-seedream-4-5', '3:4', '4K', '/aigenerate/1775544819871-0.png', '2026-04-07 06:53:39.899+00', true),
	('753659ec-1c1d-4c26-a855-303eef9ee609', '33538287-6906-41c9-852a-9491f20e6c57', '拟人化的（小橘猫），头戴破烂的安全帽，身上被雨淋的湿辘辘的，毛发打结在一起，穿着脏兮兮的破衣服，在建筑队（推着装满石头的小推车）沉甸甸的，（下大雨），泥泞路，悲情，苦楚，贫穷，劳累，大师作品，真实，摄影。', 'doubao-seedream-4-5', '3:4', '4K', '/aigenerate/1775544798888-0.png', '2026-04-07 06:53:18.897+00', true),
	('db8f0dff-1bf9-47a4-b05f-812b27fb917f', '33538287-6906-41c9-852a-9491f20e6c57', '拟人化的（小橘猫），头戴破烂的安全帽，身上被雨淋的湿辘辘的，毛发打结在一起，穿着脏兮兮的破衣服，在建筑队（推着装满石头的小推车）沉甸甸的，（下大雨），泥泞路，悲情，苦楚，贫穷，劳累，大师作品，真实，摄影。', 'doubao-seedream-4-5', '3:4', '4K', '/aigenerate/1775544768176-0.png', '2026-04-07 06:52:48.184+00', true),
	('f96d1acd-d6e9-430c-803a-a90454aa9525', '33538287-6906-41c9-852a-9491f20e6c57', 'Recovered image', 'Doubao Seedream', '1:1', '4K', '/aigenerate/1775187825121-0.png', '2026-04-03 03:43:45.121+00', true),
	('45d193f3-668e-4249-b9bf-f1ab38bb879c', '33538287-6906-41c9-852a-9491f20e6c57', 'A wide-eyed girl avatar with a nostalgic 2000s internet aesthetic, wearing a vintage designer beret and oversized sunglasses. Lo-fi glitchy background, neo-tokyo street fashion, flat cel-shading with a slightly grainy film texture. Experimental digital art, soft washed-out colors, aesthetic "dreamcore" vibe.', 'Doubao Seedream 5.0', '1:1', '4K', 'https://pub-8742eaa8e7ce488ba306c3dc5bacddd1.r2.dev/aigenerate/1775814698875-1775814698875-0.png', '2026-04-10 09:51:43.013+00', true),
	('4ee2105d-9130-4b3b-8ee1-fc5dd2720c2a', '33538287-6906-41c9-852a-9491f20e6c57', 'An epic cinematic shot of a Shiba Inu dog wearing a high-tech astronaut suit, standing on the lunar surface. Reflection of the Earth in the helmet visor, holding a gold Bitcoin flag. Hyper-realistic fur textures, cosmic starry background, dramatic lighting, 8k resolution, heroic atmosphere.', 'Doubao Seedream 4.5', '3:4', '4K', 'https://pub-8742eaa8e7ce488ba306c3dc5bacddd1.r2.dev/aigenerate/1775813229343-1775813229343-0.png', '2026-04-10 09:27:13.453+00', true),
	('8ec5e922-950f-44a0-81a8-f801211ed9c0', '33538287-6906-41c9-852a-9491f20e6c57', 'An epic oil painting in the style of a classical European master, depicting ''Chad'' (the Meme figure, perfect jawline, muscular) standing on a mountain peak, looking down over a vast, foggy valley. He is wearing a simple toga and holding a gold Bitcoin scepter. Dramatic light and shadow, powerful composition, museum-quality brushwork.', 'Flux 2 Klein 4B', '3:4', '4K', 'https://pub-8742eaa8e7ce488ba306c3dc5bacddd1.r2.dev/aigenerate/1775811823570-1775811823570-0.png', '2026-04-10 09:03:44.523+00', true),
	('1e497f6e-b792-4f17-beae-e61705703ea4', '33538287-6906-41c9-852a-9491f20e6c57', 'Summer Design for ephemera collage clipart with a soft mixed-media style and playful layered elements. Perfect for scrapbooking, junk journals, and creative summer-themed design projects.', 'Doubao Seedream 4.5', '2:3', '4K', 'https://pub-8742eaa8e7ce488ba306c3dc5bacddd1.r2.dev/aigenerate/1775810838550-1775810838550-0.png', '2026-04-10 08:47:23.013+00', true),
	('8830ad8c-53ae-4a49-b0d4-4c31ee0bc132', '33538287-6906-41c9-852a-9491f20e6c57', 'A curated set of highly detailed prompts designed to generate stunning miniature diorama-style travel souvenirs held in hand, featuring famous landmarks with rich layered environments, cinematic lighting, and ultra-realistic macro aesthetics—perfect for viral AI art and PromptBase listings.', 'Flux 2 Flex', '9:16', '4K', 'https://pub-8742eaa8e7ce488ba306c3dc5bacddd1.r2.dev/aigenerate/1775808181215-1775808181215-0.png', '2026-04-10 08:03:05.579+00', true),
	('24fde9da-0933-4f23-a39b-537f8fa04d02', '33538287-6906-41c9-852a-9491f20e6c57', 'cute fluffy penguin king wearing crystal crown and royal cape, standing on icy throne, soft rounded proportions, charming happy expression, magical snowy fantasy background, polished 3d cartoon illustration, glossy toy-inspired texture, adorable nft avatar style, vibrant pastel blue and purple tones, collectible digital mascot aesthetic, cinematic lighting, ultra detailed', 'doubao-seedream-4-5', '3:4', '4K', 'https://pub-8742eaa8e7ce488ba306c3dc5bacddd1.r2.dev/images/1775721853173-1775721853172-0.png', '2026-04-09 08:04:14.569+00', true),
	('6016cfcd-e676-400b-a23d-85dc3a3ec910', '33538287-6906-41c9-852a-9491f20e6c57', 'A portrait of a digital cyberpunk character, pixel art style but with modern voxel depth. An alien with light blue skin wearing small shades and a dark hoodie, smoking a digital pipe that exhales binary code smoke. Dark background with flickering green matrix-style lights. Low-fi aesthetic, vibrant cyan and magenta highlights, retro-futuristic.', 'doubao-seedream-5-0', '3:4', '4K', 'https://pub-8742eaa8e7ce488ba306c3dc5bacddd1.r2.dev/images/1775697838122-1775697838122-0.png', '2026-04-09 01:23:59.376+00', true),
	('489333df-e1a4-4cf4-a913-262d7fc3e5e3', '33538287-6906-41c9-852a-9491f20e6c57', 'An ancient, enchanted library hidden inside a massive, hollowed-out tree trunk. Thousands of glowing books float in spirals, guided by bioluminescent pixies. Deep greens, blues, and warm gold tones. Magical atmosphere, intricate details, storybook illustration style.', 'doubao-seedream-4-5', '2:3', '4K', 'https://pub-8742eaa8e7ce488ba306c3dc5bacddd1.r2.dev/images/1775694908242-1775694908242-0.png', '2026-04-09 00:35:08.635+00', true),
	('4bad7371-5cc5-4884-a25a-25364053f460', '33538287-6906-41c9-852a-9491f20e6c57', 'A fierce cybernetic gorilla character made of glowing 3D voxels. Neon blue glowing eyes, mechanical arm parts, dense futuristic jungle background with neon vines. Tech-noir lighting, bold blocky aesthetic, high-detail voxel art, Unreal Engine 5 style, jungle-punk vibe.', 'Doubao Seedream 4.5', '9:16', '4K', 'https://pub-8742eaa8e7ce488ba306c3dc5bacddd1.r2.dev/aigenerate/1775813249177-1775813249177-0.png', '2026-04-10 09:27:30.021+00', true),
	('8c9e705f-226a-4780-9afa-7fbb7b10f9c2', '33538287-6906-41c9-852a-9491f20e6c57', 'cute fluffy penguin king wearing crystal crown and royal cape, standing on icy throne, soft rounded proportions, charming happy expression, magical snowy fantasy background, polished 3d cartoon illustration, glossy toy-inspired texture, adorable nft avatar style, vibrant pastel blue and purple tones, collectible digital mascot aesthetic, cinematic lighting, ultra detailed', 'doubao-seedream-4-5', '2:3', '4K', 'https://pub-8742eaa8e7ce488ba306c3dc5bacddd1.r2.dev/images/1775721832481-1775721832481-0.png', '2026-04-09 08:03:57.262+00', true),
	('85bfe750-6b97-4875-a4f0-009f3556928e', '33538287-6906-41c9-852a-9491f20e6c57', 'An anime-style portrait of a wide-eyed girl with a nostalgic 2000s internet aesthetic. She has messy blonde hair, wearing a designer beret and a vintage luxury brand coat with strange patterns. The background is a lo-fi glitchy city street with Japanese typography and glowing butterflies. Flat cel-shading, vibrant yet slightly washed-out colors, dreamcore atmosphere.', 'doubao-seedream-4-5', '2:3', '4K', 'https://pub-8742eaa8e7ce488ba306c3dc5bacddd1.r2.dev/images/1775702444755-1775702444755-0.png', '2026-04-09 02:40:48.644+00', true),
	('a8902671-3bab-44d2-8f9f-a0c85d69b8de', '33538287-6906-41c9-852a-9491f20e6c57', 'A hyper-realistic macro photograph of an intricate, gold-plated Mayan calendar stone discovered in a dense jungle. The stone is covered in ancient hieroglyphs and celestial carvings, partially enveloped by moss and vines. A faint stream of sunlight pierces through the canopy, highlighting the weathered textures. Shot on Sony A1, 85mm lens.', 'doubao-seedream-5-0', '2:3', '4K', 'https://pub-8742eaa8e7ce488ba306c3dc5bacddd1.r2.dev/images/1775694721895-1775694721895-0.png', '2026-04-09 00:32:03.208+00', true),
	('d200ab62-4e44-40dc-b294-972f6a95cd75', '33538287-6906-41c9-852a-9491f20e6c57', 'A macro photography shot of a person''s fingers holding a tiny, detailed 3D pop-up sticker of New York City. The sticker features the Statue of Liberty, Brooklyn Bridge, Empire State Building, and yellow taxis on a blue river. The miniature city has a realistic, textured look. The background is a real, soft-focus, blurred cinematic New York City skyline during daytime. Natural lighting, high depth of field on the fingers and sticker, 8k resolution.', 'doubao-seedream-4-5', '2:3', '4K', 'https://pub-8742eaa8e7ce488ba306c3dc5bacddd1.r2.dev/images/1775653873693-1775653873693-0.png', '2026-04-08 13:11:15.212+00', true),
	('249e63db-4399-4c56-8195-0ea7a57e4733', '33538287-6906-41c9-852a-9491f20e6c57', 'Recovered image', 'Doubao Seedream', '1:1', '4K', '/aigenerate/1775187715536-0.png', '2026-04-03 03:41:55.536+00', true),
	('b7a71bca-5b87-4caa-8815-c26a378f3a38', '33538287-6906-41c9-852a-9491f20e6c57', 'Recovered image', 'Doubao Seedream', '1:1', '4K', '/aigenerate/1775186120479-0.png', '2026-04-03 03:15:20.479+00', true),
	('44dbe9b3-622f-4f1d-8dda-eb9926702b49', '33538287-6906-41c9-852a-9491f20e6c57', 'A dark, moody portrait of a Mutant Ape, featuring green slime dripping from its fur and glowing orange, venomous eyes. It is wearing a tactical jacket with multiple patches. The background is an abandoned, graffiti-covered industrial lab with flickering neon lights. Cinematic lighting, photorealistic textures, grit, decay, 8k.', 'Flux 2 Klein 4B', '1:1', '4K', 'https://pub-8742eaa8e7ce488ba306c3dc5bacddd1.r2.dev/aigenerate/1775815191926-1775815191926-0.png', '2026-04-10 09:59:53+00', true),
	('bccb31f2-e178-4c45-b469-c9812443da6f', '33538287-6906-41c9-852a-9491f20e6c57', 'A breathtaking generative abstract art piece, fluid interlocking curves and organic flowing blocks of color (teal, mustard yellow, coral). Intricate algorithmic patterns, clean white negative space, high-end digital museum style, textural depth, inspired by modern code-based art.', 'Doubao Seedream 5.0', '3:2', '4K', 'https://pub-8742eaa8e7ce488ba306c3dc5bacddd1.r2.dev/aigenerate/1775814882275-1775814882275-0.png', '2026-04-10 09:54:42.964+00', true),
	('d2ffb346-6456-405c-8c8d-24670e0924e2', '33538287-6906-41c9-852a-9491f20e6c57', 'An authentic 8-bit pixel art owl with large glowing eyes, wearing a wizard hat. Deep purple and starry night background, floating magical sparks. Pixel-perfect NFT design, nostalgic arcade aesthetic, vibrant retro colors, simple but iconic silhouette.', 'Flux 2 Flex', '9:16', '4K', 'https://pub-8742eaa8e7ce488ba306c3dc5bacddd1.r2.dev/aigenerate/1775813401961-1775813401961-0.png', '2026-04-10 09:30:02.861+00', true),
	('900ac17d-095e-487a-bb3e-55aa1e6277cf', '33538287-6906-41c9-852a-9491f20e6c57', '拟人化的（小橘猫），头戴破烂的安全帽，身上被雨淋的湿辘辘的，毛发打结在一起，穿着脏兮兮的破衣服，在建筑队（推着装满石头的小推车）沉甸甸的，（下大雨），泥泞路，悲情，苦楚，贫穷，劳累，大师作品，真实，摄影。', 'doubao-seedream-4-5', '3:4', '4K', '/aigenerate/1775544745739-0.png', '2026-04-07 06:52:25.747+00', true),
	('10687854-b91b-4abc-ac8a-a1d22ff90151', '33538287-6906-41c9-852a-9491f20e6c57', 'Recovered image', 'Doubao Seedream', '1:1', '4K', '/aigenerate/1775186309003-0.png', '2026-04-03 03:18:29.003+00', true),
	('d8b5ea96-86c3-4b57-bd13-637c0e62d90e', '33538287-6906-41c9-852a-9491f20e6c57', 'Recovered image', 'Doubao Seedream', '1:1', '4K', '/aigenerate/1775186052630-0.png', '2026-04-03 03:14:12.63+00', true),
	('026b2d48-ae54-4849-bcd1-fd3406e1bdcc', '33538287-6906-41c9-852a-9491f20e6c57', 'Recovered image', 'Doubao Seedream', '1:1', '4K', '/aigenerate/1775184168614-0.png', '2026-04-03 02:42:48.614+00', true),
	('a0018977-84bf-4e83-b4cd-e994b59f801d', '33538287-6906-41c9-852a-9491f20e6c57', 'Recovered image', 'Doubao Seedream', '1:1', '4K', '/aigenerate/1775184143154-0.png', '2026-04-03 02:42:23.154+00', true),
	('bfcb40e9-ab7f-48fd-8621-5e57fcf30443', '33538287-6906-41c9-852a-9491f20e6c57', 'Recovered image', 'Doubao Seedream', '1:1', '4K', '/aigenerate/1775184089411-0.png', '2026-04-03 02:41:29.411+00', true),
	('5936709a-0511-4217-8eab-e121c3168d0d', '33538287-6906-41c9-852a-9491f20e6c57', 'Recovered image', 'Doubao Seedream', '1:1', '4K', '/aigenerate/1775183678446-0.png', '2026-04-03 02:34:38.446+00', true),
	('d4fc8247-0815-43bf-bdd5-6e3d246a3668', '33538287-6906-41c9-852a-9491f20e6c57', 'Recovered image', 'Doubao Seedream', '1:1', '4K', '/aigenerate/1775183502157-0.png', '2026-04-03 02:31:42.157+00', true),
	('02f6b502-3a3e-4c27-a178-5a7b187b440d', '33538287-6906-41c9-852a-9491f20e6c57', 'Recovered image', 'Doubao Seedream', '1:1', '4K', '/aigenerate/1775183372269-0.png', '2026-04-03 02:29:32.269+00', true),
	('1293e873-23b7-45cd-a8c8-39a484378b58', '33538287-6906-41c9-852a-9491f20e6c57', 'Recovered image', 'Doubao Seedream', '1:1', '4K', '/aigenerate/1775183090339-0.png', '2026-04-03 02:24:50.339+00', true),
	('14bb5dda-e99e-4bf3-973f-823da90bbd27', '33538287-6906-41c9-852a-9491f20e6c57', 'An authentic 8-bit pixel art owl with large glowing eyes, wearing a wizard hat. Deep purple and starry night background, floating magical sparks. Pixel-perfect NFT design, nostalgic arcade aesthetic, vibrant retro colors, simple but iconic silhouette.', 'Doubao Seedream 5.0', '2:3', '4K', 'https://pub-8742eaa8e7ce488ba306c3dc5bacddd1.r2.dev/aigenerate/1775815046361-1775815046361-0.png', '2026-04-10 09:57:27.332+00', true),
	('26ac3819-e7d5-4066-a7e7-60fd5361ab2c', '33538287-6906-41c9-852a-9491f20e6c57', 'A majestic oil painting of a noble frog king (Pepe style) in Renaissance attire, sitting on a throne made of emeralds and gold. He has a smug yet serene expression. The background is an opulent palace hall with stained glass windows showing Bitcoin symbols. Rich textures, masterful brushwork, dramatic chiaroscuro lighting, museum-quality art.', 'doubao-seedream-5-0', '2:3', '4K', 'https://pub-8742eaa8e7ce488ba306c3dc5bacddd1.r2.dev/images/1775697880428-1775697880428-0.png', '2026-04-09 01:24:42.168+00', true),
	('c28ec4cd-37e5-4350-9c29-7cd907d401be', '33538287-6906-41c9-852a-9491f20e6c57', 'A rebellious cyber-samurai with glowing blue neon katana standing on a rain-slicked rooftop overlooking a sprawling Neo-Tokyo. Her armor is a fusion of traditional lamellar and advanced carbon fiber. In the background, a massive digital cherry blossom tree blooms on a hologram screen. Anime style, high contrast, deep shadows.', 'doubao-seedream-4-5', '9:16', '4K', 'https://pub-8742eaa8e7ce488ba306c3dc5bacddd1.r2.dev/images/1775694881388-1775694881388-0.png', '2026-04-09 00:34:41.715+00', true),
	('88d18a59-ca20-43c3-9267-235a52a00825', '33538287-6906-41c9-852a-9491f20e6c57', '熊猫在宽敞的厨房里忙碌着，它戴着一顶可爱的厨师帽，身上系着一条蓝色的围裙。灶台上火焰升腾，锅里煮着热气腾腾的汤，熊猫正用勺子搅拌着。旁边的案板上放着切好的竹笋和青菜，它的双手沾满了面粉，正在准备包饺子，厨房的角落里堆满了新鲜的食材，背景虚化干净，32K，高清画质。', 'doubao-seedream-4-5', '3:4', '4K', '/aigenerate/1775546562846-0.png', '2026-04-07 07:22:42.854+00', true),
	('15fb3487-0ece-4860-8e72-372b17fdd1aa', '33538287-6906-41c9-852a-9491f20e6c57', '2 岁的可爱小萌娃，那黑色的大眼睛明亮而有神，仿佛藏着无尽的好奇与纯真，高鼻梁精致挺直，衬托出圆润的脸蛋更加可爱。额前的几缕碎发随风飘动，头上戴着一个粉色的小花环，32K，高清画质。', 'doubao-seedream-4-5', '3:4', '4K', '/aigenerate/1775546444695-0.png', '2026-04-07 07:20:44.702+00', true),
	('88707794-32e9-46e2-a8df-03533ce4c346', '33538287-6906-41c9-852a-9491f20e6c57', '拟人化的（小橘猫），头戴破烂的安全帽，身上被雨淋的湿辘辘的，毛发打结在一起，穿着脏兮兮的破衣服，在建筑队（推着装满石头的小推车）沉甸甸的，（下大雨），泥泞路，悲情，苦楚，贫穷，劳累，大师作品，真实，摄影。', 'doubao-seedream-4-5', '3:4', '4K', '/aigenerate/1775544862573-0.png', '2026-04-07 06:54:22.582+00', true),
	('b2af60ca-198a-4b63-b97e-64d919c0c37f', '33538287-6906-41c9-852a-9491f20e6c57', 'Recovered image', 'Doubao Seedream', '1:1', '4K', '/aigenerate/1775186713336-0.png', '2026-04-03 03:25:13.336+00', true),
	('c1bb7680-fc6e-4fbf-883d-af110b3dfb3d', '33538287-6906-41c9-852a-9491f20e6c57', 'A majestic, iridescent Chinese dragon coiled around a towering, mist-shrouded mountain peak, breathing stylized clouds that morph into constellations. Below, a tiny, ancient temple clings to the cliffside. Vibrant watercolor and ink illustration, traditional Chinese art style mixed with modern fantasy.', 'doubao-seedream-5-0', '16:9', '4K', 'https://pub-8742eaa8e7ce488ba306c3dc5bacddd1.r2.dev/images/1775694842278-1775694842278-0.png', '2026-04-09 00:34:02.6+00', true),
	('09676b32-a800-4d9a-b843-72078422620a', '33538287-6906-41c9-852a-9491f20e6c57', 'Recovered image', 'Doubao Seedream', '1:1', '4K', '/aigenerate/1775186471443-0.png', '2026-04-03 03:21:11.443+00', true),
	('4324f99f-47c3-462f-8258-ff86e5b63e10', '33538287-6906-41c9-852a-9491f20e6c57', 'Create a whimsical gnome with a long textured hat in a soft pastel birthday style. This prompt is perfect for generating cohesive magical clipart, nursery decor, and charming birthday illustrations with a dreamy watercolor aesthetic.', 'doubao-seedream-4-5', '3:4', '4K', '/aigenerate/1775642808539-0.png', '2026-04-08 10:06:48.55+00', true),
	('f9808375-6ffa-475c-9771-23b2f9193022', '33538287-6906-41c9-852a-9491f20e6c57', '拟人化的（小橘猫），头戴破烂的安全帽，身上被雨淋的湿辘辘的，毛发打结在一起，穿着脏兮兮的破衣服，在建筑队（推着装满石头的小推车）沉甸甸的，（下大雨），泥泞路，悲情，苦楚，贫穷，劳累，大师作品，真实，摄影。', 'doubao-seedream-4-5', '3:4', '4K', '/aigenerate/1775544724743-0.png', '2026-04-07 06:52:04.777+00', true),
	('e2824e25-6f5e-42dd-a3f7-74378378a06f', '33538287-6906-41c9-852a-9491f20e6c57', '全景	云层裂开，金色斜阳洒在湿漉漉的山头，水汽升腾。	山头	摇镜头	高角度', 'doubao-seedream-4-0', '9:16', '4K', '/aigenerate/1775288158796-0.png', '2026-04-04 07:35:58.814+00', true),
	('7a24e1c5-d7db-4bf5-ab83-91720eed9be7', '33538287-6906-41c9-852a-9491f20e6c57', 'Recovered image', 'Doubao Seedream', '1:1', '4K', '/aigenerate/1775187850170-0.png', '2026-04-03 03:44:10.17+00', true),
	('82d9579a-a0a0-4e1a-b5f6-6d54a3ac0ddf', '33538287-6906-41c9-852a-9491f20e6c57', 'Recovered image', 'Doubao Seedream', '1:1', '4K', '/aigenerate/1775184422150-0.png', '2026-04-03 02:47:02.15+00', true),
	('8332e4d4-7195-49af-8bbd-75fe3070c4b5', '33538287-6906-41c9-852a-9491f20e6c57', 'Recovered image', 'Doubao Seedream', '1:1', '4K', '/aigenerate/1775184383175-0.png', '2026-04-03 02:46:23.175+00', true),
	('ce3611a3-d8bb-4609-a0cd-8642a3590a90', '33538287-6906-41c9-852a-9491f20e6c57', 'Recovered image', 'Doubao Seedream', '1:1', '4K', '/aigenerate/1775184342936-0.png', '2026-04-03 02:45:42.936+00', true),
	('56b457dd-56fb-4fd7-a349-5f7e3dbe89c0', '33538287-6906-41c9-852a-9491f20e6c57', 'Recovered image', 'Doubao Seedream', '1:1', '4K', '/aigenerate/1775184327929-0.png', '2026-04-03 02:45:27.929+00', true);


--
-- Data for Name: user_points; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."user_points" ("user_id", "points", "last_reset_date", "created_at", "updated_at") VALUES
	('2f49a79e-f8a0-4331-960e-1ba17f768062', 48, '2026-04-09', '2026-04-09 07:28:48.100769+00', '2026-04-09 11:02:58.495+00'),
	('33538287-6906-41c9-852a-9491f20e6c57', 88, '2026-04-10', '2026-04-10 15:15:20.273693+00', '2026-04-10 15:15:20.273693+00');


--
-- Data for Name: user_profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."user_profiles" ("id", "email", "created_at", "updated_at", "web3_account") VALUES
	('33538287-6906-41c9-852a-9491f20e6c57', 'mydoto@gmail.com', '2026-04-09 07:28:48.100769+00', '2026-04-10 15:03:09.552+00', NULL);


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 94, true);


--
-- PostgreSQL database dump complete
--

-- \unrestrict zTDbT8kfpSm5vxa0WX0XEzBjjebWzc5fVHREFqTflgXJ19uXxhLSCVThdG95f9j

RESET ALL;
