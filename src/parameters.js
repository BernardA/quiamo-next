// THESE MOVED TO .env.local for confidentiality
// THE REMAINING KEPT HERE AS .env does not handle arrays

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
export const LANG = 'br';

export const ONLINE_CHECK_INTERVAL = 300000; // milliseconds
export const TOKEN_TTL = 1800; // seconds
export const MAX_IDLE_TIME = 1500;
export const IDLE_TIME_LOGOUT = 60;

export const COOKIE_MAX_AGE = 2592000; // 30 days
export const COOKIE_SAME_SITE = 'strict';

export const ROOT_CATEGORIES="Produtos,Serviços";


