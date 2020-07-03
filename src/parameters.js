// THESE MOVED TO .env.local for confidentiality
// THE REMAINING KEPT HERE AS .env does not handle arrays

// export const GOOGLE_MAPS_API_KEY = 'AIzaSyADwjPl37JyT1DGKvXBXAf1h8Me0V9Kpbg';
// export const GOOGLE_PEOPLE_API_KEY = 'AIzaSyBGlc_MTKgHSXS-jF_iMEvaUn6wy6x86pk';
// export const GOOGLE_PEOPLE_API_CLIENT_ID = '602981629590-dlvh9koop9rcud5rrdodapqsk6j5gk2e.apps.googleusercontent.com';
// export const GOOGLE_PEOPLE_API_SCOPES = 'https://www.googleapis.com/auth/contacts.readonly';
// export const GOOGLE_PEOPLE_API_DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/people/v1/rest'];
// export const GOOGLE_PEOPLE_API_SCRIPT_SCR = 'https://apis.google.com/js/api.js';
// export const GOOGLE_SOCIAL_LOGIN = '602981629590-c234p0kr2gn4qjo4qivid526vbedrfnp.apps.googleusercontent.com';

// file uploads
export const MESSAGE_ATTACHMENT_ACCEPTED_MIME_TYPES = ['jpg', 'image/jpeg', 'image/png', 'application/pdf', 'application/x-pdf'];
export const RESIZED_FILE_WIDTH = 250; // px
export const MAX_ATTACHMENTS_ALLOWED = 3;
export const AVATAR_ACCEPTED_MIME_TYPES = ['image/jpeg', 'image/png'];
export const AVATAR_MAX_PIXEL_WIDTH = 250;
export const UPLOAD_MAX_SIZE = 3000000; // bytes

export const USER_IMAGE_DIRECTORY = '/images/user/';
export const MESSAGE_ATTACHMENT_DIRECTORY = '/images/message/';
export const AVATAR_PLACEHOLDER_PATH = '/images/user/avatar-placeholder.png';
export const LOADING_INDICATOR_IMG = '/images/circles.svg';
export const CACHE_DATE = '290519';

export const TIMEZONE = 'America/Sao Paulo';
export const LOCALE = 'pt-BR';
export const CURRENCY = 'BRL';

export const ONLINE_CHECK_INTERVAL = 300000; // milliseconds
export const TOKEN_TTL = 1800; // seconds
export const MAX_IDLE_TIME = 1500;
export const IDLE_TIME_LOGOUT = 60;

export const COOKIE_MAX_AGE = 2592000; // 30 days
export const COOKIE_SAME_SITE = 'strict';

export const ROOT_CATEGORIES="Produtos,Serviços";


